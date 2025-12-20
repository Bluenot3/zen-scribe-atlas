import { supabase } from "@/integrations/supabase/client";

export type ContentType = "article" | "newsletter" | "report" | "brief" | "book-chapter";
export type StyleType = "zen-editorial" | "economist" | "narrative" | "clinical" | "investor" | "futurist";
export type ThemeType = "minimal" | "dense" | "visual" | "timeline" | "comparative";

export interface GenerationInputs {
  urls?: string[];
  text?: string;
  topic?: string;
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

export async function generateArtifact(
  contentType: ContentType,
  inputs: GenerationInputs,
  style: StyleType = "zen-editorial",
  theme: ThemeType = "visual"
): Promise<GenerationResponse> {
  const { data, error } = await supabase.functions.invoke("generate-artifact", {
    body: { contentType, inputs, style, theme },
  });

  if (error) {
    console.error("Generation error:", error);
    return { success: false, error: error.message };
  }

  return data as GenerationResponse;
}
