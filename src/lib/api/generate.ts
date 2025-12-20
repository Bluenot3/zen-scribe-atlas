import { supabase } from "@/integrations/supabase/client";

export type ContentType = "article" | "newsletter" | "report" | "brief" | "book-chapter";
export type StyleType = "zen-editorial" | "economist" | "narrative" | "clinical" | "investor" | "futurist";
export type ThemeType = "minimal" | "dense" | "visual" | "timeline" | "comparative";
export type LengthType = "short" | "medium" | "long" | "book";

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
}

export interface GenerationInputs {
  urls?: string[];
  text?: string;
  topic?: string;
  scrapedContent?: ScrapedContent[];
}

export interface Section {
  type: "intro" | "text" | "quote" | "data" | "timeline" | "comparison" | "callout" | "conclusion";
  title?: string;
  content?: string;
  data?: {
    chartType?: "bar" | "line" | "pie" | "area";
    points?: Array<{ name: string; value: number; [key: string]: any }>;
    events?: Array<{ year: string; title: string; description: string }>;
    items?: Array<{ name: string; pros: string[]; cons: string[] }>;
    quote?: string;
    author?: string;
    role?: string;
  };
}

export interface KeyMetric {
  label: string;
  value: string;
  change?: string;
}

export interface GeneratedArtifact {
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  sections: Section[];
  keyMetrics: KeyMetric[];
  sources: string[];
}

export interface GenerationResponse {
  success: boolean;
  artifact?: GeneratedArtifact;
  error?: string;
}

export interface ScrapeResponse {
  success: boolean;
  results?: Array<{
    url: string;
    success: boolean;
    content?: string;
    title?: string;
    error?: string;
  }>;
  error?: string;
}

export async function scrapeUrls(urls: string[]): Promise<ScrapeResponse> {
  const { data, error } = await supabase.functions.invoke("scrape-urls", {
    body: { urls },
  });

  if (error) {
    console.error("Scrape error:", error);
    return { success: false, error: error.message };
  }

  return data as ScrapeResponse;
}

export async function generateArtifact(
  contentType: ContentType,
  inputs: GenerationInputs,
  style: StyleType = "zen-editorial",
  theme: ThemeType = "visual",
  length: LengthType = "medium"
): Promise<GenerationResponse> {
  const { data, error } = await supabase.functions.invoke("generate-artifact", {
    body: { contentType, inputs, style, theme, length },
  });

  if (error) {
    console.error("Generation error:", error);
    return { success: false, error: error.message };
  }

  return data as GenerationResponse;
}

export interface RegenerateResponse {
  success: boolean;
  section?: Section;
  error?: string;
}

export async function regenerateSection(
  sectionIndex: number,
  section: Section,
  context: string,
  instruction: string,
  style: StyleType = "zen-editorial"
): Promise<RegenerateResponse> {
  const { data, error } = await supabase.functions.invoke("regenerate-section", {
    body: { sectionIndex, section, context, instruction, style },
  });

  if (error) {
    console.error("Regenerate error:", error);
    return { success: false, error: error.message };
  }

  return data as RegenerateResponse;
}
