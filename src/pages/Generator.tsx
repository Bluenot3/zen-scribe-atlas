import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputPanel from "@/components/generator/InputPanel";
import ArtifactRenderer from "@/components/generator/ArtifactRenderer";
import { generateArtifact, GeneratedArtifact, ContentType, StyleType, ThemeType } from "@/lib/api/generate";

const Generator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [artifact, setArtifact] = useState<GeneratedArtifact | null>(null);

  const handleGenerate = useCallback(async (
    contentType: ContentType,
    inputs: { urls?: string[]; text?: string; topic?: string },
    style: StyleType,
    theme: ThemeType
  ) => {
    setIsGenerating(true);
    setArtifact(null);

    try {
      const result = await generateArtifact(contentType, inputs, style, theme);
      
      if (result.success && result.artifact) {
        setArtifact(result.artifact);
        toast({
          title: "Artifact Generated",
          description: `"${result.artifact.title}" is ready for review.`,
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

  const handleCopy = async () => {
    if (!artifact) return;
    
    // Create markdown version
    let markdown = `# ${artifact.title}\n\n`;
    if (artifact.subtitle) markdown += `*${artifact.subtitle}*\n\n`;
    
    artifact.sections.forEach(section => {
      if (section.title) markdown += `## ${section.title}\n\n`;
      if (section.content) markdown += `${section.content}\n\n`;
    });

    await navigator.clipboard.writeText(markdown);
    toast({ title: "Copied to clipboard" });
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
                  New Artifact
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <span className="font-serif font-bold text-primary-foreground text-lg">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-semibold text-foreground tracking-tight text-lg">ZEN Weekly</span>
                  <span className="zen-label text-[10px] hidden sm:block">Content Generator</span>
                </div>
              </div>
            </div>

            {artifact && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="zen" size="sm">
                  <Download className="w-4 h-4 mr-2" />
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
                Create Publication-Ready Content
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform topics, URLs, or raw text into archival-grade intelligence artifacts 
                with data visualizations, structured analysis, and editorial polish.
              </p>
            </div>

            {/* Input Panel */}
            <div className="zen-card p-8">
              <InputPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
            </div>
          </div>
        ) : (
          <div className="animate-fade-up">
            <ArtifactRenderer artifact={artifact} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Generator;
