import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ZEN_SYSTEM_PROMPT = `You are ZEN Weekly — the flagship long-form intelligence, research, and visual journalism engine of ZEN AI Co.

You generate archival-grade intelligence artifacts designed to survive scrutiny, time, and scale. Your outputs feel like a fusion of a flagship global magazine feature, a think-tank white paper, a systems-level intelligence brief, and a visual-first future atlas.

CRITICAL OUTPUT FORMATTING:
Your response MUST be valid JSON with this exact structure:
{
  "title": "Article title",
  "subtitle": "Compelling subtitle",
  "category": "CATEGORY_TAG",
  "readTime": "X min",
  "sections": [...],
  "keyMetrics": [...],
  "sources": [...]
}

SECTION TYPES (use variety based on content):
1. "intro" - Opening thesis, compelling hook
2. "text" - Standard prose section with title and content
3. "quote" - Include data: { quote, author, role }
4. "data" - Charts/metrics: data: { chartType: "bar"|"line"|"pie"|"area", points: [{name, value}] }
5. "timeline" - Historical progression: data: { events: [{year, title, description}] }
6. "comparison" - Analysis: data: { items: [{name, pros:[], cons:[]}] }
7. "callout" - Key insight highlight
8. "conclusion" - Final synthesis

EDITORIAL PHILOSOPHY:
- Systems-First: Explain how parts interact with causal chains
- Numbers With Meaning: Contextualized, compared metrics
- No Hype Without Infrastructure: Connect to compute, capital, labor, energy, policy
- Temporal Awareness: Past → present → future trajectories
- Global Lens: Note spillovers and second-order effects

TONE: Serious but readable. Urgent but not sensational. Confident.`;

const LENGTH_CONFIGS = {
  short: { 
    sections: "4-6", 
    dataViz: "1-2", 
    words: "1,500-2,500",
    instruction: "Create a focused, impactful piece" 
  },
  medium: { 
    sections: "8-12", 
    dataViz: "3-4", 
    words: "4,000-6,000",
    instruction: "Create a comprehensive analysis with multiple perspectives" 
  },
  long: { 
    sections: "15-20", 
    dataViz: "5-7", 
    words: "10,000-15,000",
    instruction: "Create an in-depth investigation covering all angles" 
  },
  book: { 
    sections: "25-40", 
    dataViz: "10-15", 
    words: "25,000-50,000",
    instruction: "Create a book-length exploration with chapters, extensive research, multiple data visualizations per topic, detailed timelines, and comprehensive analysis. Think of this as a 30-50 page intelligence report." 
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, inputs, style, theme, length = "medium" } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const lengthConfig = LENGTH_CONFIGS[length as keyof typeof LENGTH_CONFIGS] || LENGTH_CONFIGS.medium;

    // Build the user prompt from inputs
    let userPrompt = `Generate a ${contentType || "article"} with these specifications:\n\n`;
    userPrompt += `LENGTH: ${length.toUpperCase()} (${lengthConfig.sections} sections, ${lengthConfig.words} words)\n`;
    userPrompt += `${lengthConfig.instruction}\n\n`;
    
    if (inputs?.scrapedContent?.length) {
      userPrompt += `SOURCE CONTENT FROM URLS:\n`;
      inputs.scrapedContent.forEach((item: { url: string; title: string; content: string }, i: number) => {
        userPrompt += `\n--- SOURCE ${i + 1}: ${item.title || item.url} ---\n`;
        userPrompt += item.content.slice(0, 15000); // Limit content per source
        userPrompt += `\n`;
      });
      userPrompt += `\n`;
    }
    
    if (inputs?.text) {
      userPrompt += `SOURCE TEXT TO TRANSFORM:\n${inputs.text}\n\n`;
    }
    
    if (inputs?.topic) {
      userPrompt += `TOPIC/THEME: ${inputs.topic}\n\n`;
    }

    if (style) {
      userPrompt += `STYLE: ${style}\n`;
    }

    if (theme) {
      userPrompt += `THEME: ${theme}\n`;
    }

    userPrompt += `\nGENERATE:
- ${lengthConfig.sections} substantial sections using varied section types
- ${lengthConfig.dataViz} data visualization sections with actual chart data
- Timeline sections for historical/evolutionary topics
- Comparison sections when analyzing alternatives
- 3-5 key metrics with values and changes
- Pull quotes from sources when available
- Clear source citations

Return ONLY valid JSON matching the specified structure. Every data visualization must have complete chartType and points array.`;

    console.log("Generating", length, "content. Prompt length:", userPrompt.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro", // Using pro for longer content
        messages: [
          { role: "system", content: ZEN_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content generated");
    }

    // Parse the JSON response
    let parsedContent;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                        content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      parsedContent = { 
        title: "Generated Content",
        subtitle: "",
        category: "ANALYSIS",
        readTime: "10 min",
        sections: [{ type: "text", content }],
        keyMetrics: [],
        sources: []
      };
    }

    console.log("Content generated:", parsedContent.sections?.length, "sections");

    return new Response(
      JSON.stringify({ success: true, artifact: parsedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate content" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
