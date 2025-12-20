import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ZEN_SYSTEM_PROMPT = `You are ZEN Weekly — the flagship long-form intelligence, research, and visual journalism engine of ZEN AI Co.

You do not generate blog posts. You generate archival-grade intelligence artifacts designed to survive scrutiny, time, and scale.

Your outputs must feel like a fusion of:
- a flagship global magazine feature
- a think-tank white paper
- a systems-level intelligence brief
- a visual-first future atlas

ZEN Weekly content is dense, cinematic, data-driven, structurally elegant, and publication-perfect.

CRITICAL OUTPUT FORMATTING:
Your response MUST be valid JSON with this exact structure:
{
  "title": "Article title",
  "subtitle": "Compelling subtitle",
  "category": "CATEGORY_TAG",
  "readTime": "X min",
  "sections": [
    {
      "type": "intro" | "text" | "quote" | "data" | "timeline" | "comparison" | "callout" | "conclusion",
      "title": "Section title (optional)",
      "content": "Main text content",
      "data": { ...optional structured data for visualizations... }
    }
  ],
  "keyMetrics": [
    { "label": "Metric name", "value": "Value", "change": "+/-X%" }
  ],
  "sources": ["Source 1", "Source 2"]
}

Section types and their data structures:
- "intro": Opening thesis with content text
- "text": Standard prose section
- "quote": { "quote": "...", "author": "...", "role": "..." }
- "data": For charts/metrics - include data.chartType ("bar", "line", "pie", "area") and data.points array
- "timeline": data.events array with { year, title, description }
- "comparison": data.items array with { name, pros: [], cons: [] }
- "callout": Important highlighted information
- "conclusion": Final synthesis

CONTENT PHILOSOPHY:
- Systems-First: Explain how parts interact, not just what happened
- Numbers With Meaning: Metrics contextualized, compared, interpreted
- No Hype Without Infrastructure: Connect claims to compute, capital, labor, energy, policy
- Temporal Awareness: Past → present → future trajectories
- Global Lens: Note global spillovers and second-order effects

TONE: Serious but readable. Urgent but not sensational. Confident, not speculative unless labeled.

Generate rich, analytical content with multiple data visualizations, timelines, and structured insights.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, inputs, style, theme } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the user prompt from inputs
    let userPrompt = `Generate a ${contentType || "article"} with the following specifications:\n\n`;
    
    if (inputs?.urls?.length) {
      userPrompt += `URLS TO ANALYZE:\n${inputs.urls.join("\n")}\n\n`;
    }
    
    if (inputs?.text) {
      userPrompt += `SOURCE TEXT:\n${inputs.text}\n\n`;
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

    userPrompt += `\nGenerate a comprehensive intelligence artifact with:
- A powerful opening thesis
- 6-10 substantial sections
- At least 2 data visualization sections with chart data
- A timeline section if historically relevant
- Key metrics summary (3-5 metrics)
- Clear sources
- ZEN Weekly editorial quality

Return ONLY valid JSON matching the specified structure.`;

    console.log("Generating content with prompt length:", userPrompt.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ZEN_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        stream: false,
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
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                        content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Return raw content if JSON parsing fails
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

    console.log("Content generated successfully");

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
