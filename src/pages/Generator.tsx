import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputPanel from "@/components/generator/InputPanel";
import ArtifactRenderer from "@/components/generator/ArtifactRenderer";
import { 
  generateArtifact, 
  scrapeUrls,
  GeneratedArtifact, 
  ContentType, 
  StyleType, 
  ThemeType,
  LengthType
} from "@/lib/api/generate";

const Generator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [artifact, setArtifact] = useState<GeneratedArtifact | null>(null);
  const [currentStyle, setCurrentStyle] = useState<StyleType>("zen-editorial");

  const handleGenerate = useCallback(async (
    contentType: ContentType,
    inputs: { urls?: string[]; text?: string; topic?: string },
    style: StyleType,
    theme: ThemeType,
    length: LengthType
  ) => {
    setCurrentStyle(style);
    setArtifact(null);

    const finalInputs: any = { ...inputs };

    // If URLs provided, scrape them first
    if (inputs.urls?.length) {
      setIsScraping(true);
      try {
        const scrapeResult = await scrapeUrls(inputs.urls);
        
        if (scrapeResult.success && scrapeResult.results) {
          const scrapedContent = scrapeResult.results
            .filter(r => r.success && r.content)
            .map(r => ({
              url: r.url,
              title: r.title || "",
              content: r.content || "",
            }));

          if (scrapedContent.length > 0) {
            finalInputs.scrapedContent = scrapedContent;
            toast({
              title: "URLs Scraped",
              description: `Successfully extracted content from ${scrapedContent.length} source(s).`,
            });
          } else {
            toast({
              title: "Scraping Warning",
              description: "Could not extract content from URLs. Generating from URL references only.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Scrape error:", error);
        toast({
          title: "Scraping Failed",
          description: "Could not scrape URLs. Generating from URL references only.",
          variant: "destructive",
        });
      } finally {
        setIsScraping(false);
      }
    }

    setIsGenerating(true);

    try {
      const result = await generateArtifact(contentType, finalInputs, style, theme, length);
      
      if (result.success && result.artifact) {
        setArtifact(result.artifact);
        toast({
          title: "Artifact Generated",
          description: `"${result.artifact.title}" — ${result.artifact.sections.length} sections ready for review.`,
        });
      } else {
        toast({
          title: "Generation Failed",
          description: result.error || "Unable to generate content. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const handleReset = () => {
    setArtifact(null);
  };

  const handleUpdateArtifact = (updated: GeneratedArtifact) => {
    setArtifact(updated);
  };

  const handleCopy = async () => {
    if (!artifact) return;
    
    // Create markdown version
    let markdown = `# ${artifact.title}\n\n`;
    if (artifact.subtitle) markdown += `*${artifact.subtitle}*\n\n`;
    markdown += `**Category:** ${artifact.category} | **Read Time:** ${artifact.readTime}\n\n`;
    markdown += `---\n\n`;
    
    // Key metrics
    if (artifact.keyMetrics.length > 0) {
      markdown += `## Key Metrics\n\n`;
      artifact.keyMetrics.forEach(m => {
        markdown += `- **${m.label}:** ${m.value}${m.change ? ` (${m.change})` : ""}\n`;
      });
      markdown += `\n`;
    }
    
    // Sections
    artifact.sections.forEach(section => {
      if (section.title) markdown += `## ${section.title}\n\n`;
      if (section.content) markdown += `${section.content}\n\n`;
      
      if (section.type === "quote" && section.data?.quote) {
        markdown += `> "${section.data.quote}"\n`;
        if (section.data.author) markdown += `> — ${section.data.author}${section.data.role ? `, ${section.data.role}` : ""}\n`;
        markdown += `\n`;
      }
      
      if (section.type === "timeline" && section.data?.events) {
        section.data.events.forEach(e => {
          markdown += `- **${e.year}** - ${e.title}: ${e.description}\n`;
        });
        markdown += `\n`;
      }
      
      if (section.type === "data" && section.data?.points) {
        markdown += `| Name | Value |\n|------|-------|\n`;
        section.data.points.forEach(p => {
          markdown += `| ${p.name} | ${p.value} |\n`;
        });
        markdown += `\n`;
      }
    });
    
    // Sources
    if (artifact.sources.length > 0) {
      markdown += `## Sources\n\n`;
      artifact.sources.forEach((s, i) => {
        markdown += `${i + 1}. ${s}\n`;
      });
    }

    await navigator.clipboard.writeText(markdown);
    toast({ title: "Copied to clipboard as Markdown" });
  };

  const handleExportText = () => {
    if (!artifact) return;

    let text = `${artifact.title}\n${"=".repeat(artifact.title.length)}\n\n`;
    if (artifact.subtitle) text += `${artifact.subtitle}\n\n`;
    
    artifact.sections.forEach(section => {
      if (section.title) text += `${section.title}\n${"-".repeat(section.title.length)}\n\n`;
      if (section.content) text += `${section.content}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Exported as text file" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="zen-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-4">
              {artifact && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  New
                </Button>
              )}
              <a href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <span className="font-serif font-bold text-primary-foreground text-lg">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-semibold text-foreground tracking-tight text-lg">ZEN Weekly</span>
                  <span className="zen-label text-[10px] hidden sm:block">Content Generator</span>
                </div>
              </a>
            </div>

            {artifact && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="zen" size="sm" onClick={handleExportText}>
                  <FileText className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="zen-container py-12">
        {!artifact ? (
          <div className="max-w-4xl mx-auto">
            {/* Generator Header */}
            <div className="text-center mb-12">
              <span className="zen-label mb-4 block">Intelligence Artifact Generator</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
                Generate Publication-Ready Content
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform topics, URLs, or pasted text into rich intelligence artifacts 
                with data visualizations, timelines, and infographics. From short articles to 50-page books.
              </p>
            </div>

            {/* Input Panel */}
            <div className="zen-card p-8">
              <InputPanel 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating} 
                isScraping={isScraping}
              />
            </div>
          </div>
        ) : (
          <div className="animate-fade-up">
            <ArtifactRenderer 
              artifact={artifact} 
              onUpdate={handleUpdateArtifact}
              style={currentStyle}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Generator;
