import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Link2, 
  FileText, 
  X, 
  Plus,
  Sparkles,
  Mail,
  FileBarChart,
  Briefcase,
  BookMarked,
  BookOpen,
  Loader2
} from "lucide-react";
import { ContentType, StyleType, ThemeType, LengthType } from "@/lib/api/generate";

interface InputPanelProps {
  onGenerate: (
    contentType: ContentType,
    inputs: { urls?: string[]; text?: string; topic?: string },
    style: StyleType,
    theme: ThemeType,
    length: LengthType
  ) => void;
  isGenerating: boolean;
  isScraping: boolean;
}

const contentTypes: { id: ContentType; label: string; icon: React.ElementType; description: string }[] = [
  { id: "article", label: "Article", icon: FileText, description: "Magazine feature" },
  { id: "newsletter", label: "Newsletter", icon: Mail, description: "Weekly briefing" },
  { id: "report", label: "Report", icon: FileBarChart, description: "Research paper" },
  { id: "brief", label: "Brief", icon: Briefcase, description: "Executive summary" },
  { id: "book-chapter", label: "Book", icon: BookMarked, description: "Long-form analysis" },
];

const lengths: { id: LengthType; label: string; description: string; pages: string }[] = [
  { id: "short", label: "Short", description: "Quick read", pages: "2-4 pages" },
  { id: "medium", label: "Medium", description: "Standard article", pages: "6-10 pages" },
  { id: "long", label: "Long", description: "Deep dive", pages: "15-25 pages" },
  { id: "book", label: "Book", description: "Comprehensive", pages: "30-50 pages" },
];

const styles: { id: StyleType; label: string }[] = [
  { id: "zen-editorial", label: "ZEN Editorial" },
  { id: "economist", label: "Economist" },
  { id: "narrative", label: "Narrative" },
  { id: "clinical", label: "Clinical" },
  { id: "investor", label: "Investor Memo" },
  { id: "futurist", label: "Futurist" },
];

const themes: { id: ThemeType; label: string }[] = [
  { id: "visual", label: "Visual-Forward" },
  { id: "minimal", label: "Minimal" },
  { id: "dense", label: "Research-Heavy" },
  { id: "timeline", label: "Timeline-Driven" },
  { id: "comparative", label: "Comparative" },
];

const InputPanel = ({ onGenerate, isGenerating, isScraping }: InputPanelProps) => {
  const [activeTab, setActiveTab] = useState<"topic" | "url" | "text">("topic");
  const [topic, setTopic] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [pastedText, setPastedText] = useState("");
  const [contentType, setContentType] = useState<ContentType>("article");
  const [style, setStyle] = useState<StyleType>("zen-editorial");
  const [theme, setTheme] = useState<ThemeType>("visual");
  const [length, setLength] = useState<LengthType>("medium");

  const addUrl = () => setUrls([...urls, ""]);
  const removeUrl = (index: number) => setUrls(urls.filter((_, i) => i !== index));
  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleGenerate = useCallback(() => {
    const inputs: { urls?: string[]; text?: string; topic?: string } = {};
    
    if (activeTab === "topic" && topic.trim()) {
      inputs.topic = topic.trim();
    }
    if (activeTab === "url") {
      const validUrls = urls.filter(u => u.trim());
      if (validUrls.length) inputs.urls = validUrls;
    }
    if (activeTab === "text" && pastedText.trim()) {
      inputs.text = pastedText.trim();
    }

    if (Object.keys(inputs).length === 0) return;

    onGenerate(contentType, inputs, style, theme, length);
  }, [activeTab, topic, urls, pastedText, contentType, style, theme, length, onGenerate]);

  const canGenerate = 
    (activeTab === "topic" && topic.trim()) ||
    (activeTab === "url" && urls.some(u => u.trim())) ||
    (activeTab === "text" && pastedText.trim());

  const isProcessing = isGenerating || isScraping;

  return (
    <div className="space-y-8">
      {/* Content Type Selection */}
      <div>
        <label className="zen-label mb-4 block">Content Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              disabled={isProcessing}
              className={`p-4 rounded-sm border text-left transition-all duration-300 disabled:opacity-50 ${
                contentType === type.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <type.icon className={`w-5 h-5 mb-2 ${contentType === type.id ? "text-primary" : "text-muted-foreground"}`} />
              <div className="font-medium text-sm text-foreground">{type.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Length Selection */}
      <div>
        <label className="zen-label mb-4 block">Output Length</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {lengths.map((l) => (
            <button
              key={l.id}
              onClick={() => setLength(l.id)}
              disabled={isProcessing}
              className={`p-4 rounded-sm border text-left transition-all duration-300 disabled:opacity-50 ${
                length === l.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="font-medium text-sm text-foreground">{l.label}</div>
              <div className="text-xs text-muted-foreground">{l.description}</div>
              <div className="zen-mono text-xs text-primary mt-2">{l.pages}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Method Tabs */}
      <div>
        <label className="zen-label mb-4 block">Input Source</label>
        <div className="flex gap-2 mb-6">
          {[
            { id: "topic", label: "Topic / Keywords", icon: Sparkles },
            { id: "url", label: "URLs", icon: Link2 },
            { id: "text", label: "Paste Text", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "topic" | "url" | "text")}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium transition-all duration-300 disabled:opacity-50 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Topic Input */}
        {activeTab === "topic" && (
          <div className="space-y-4">
            <Textarea
              placeholder="Enter a topic, theme, or set of keywords...

Examples:
• The semiconductor supply chain and its geopolitical implications
• AI infrastructure costs and the economics of frontier models
• Climate adaptation strategies for coastal megacities"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isProcessing}
              className="min-h-[160px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>
        )}

        {/* URL Input */}
        {activeTab === "url" && (
          <div className="space-y-3">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  disabled={isProcessing}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
                {urls.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeUrl(index)}
                    disabled={isProcessing}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {urls.length < 10 && (
              <Button variant="outline" onClick={addUrl} disabled={isProcessing} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another URL
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              URLs will be scraped and their content analyzed. Add up to 10 sources.
            </p>
          </div>
        )}

        {/* Text Input */}
        {activeTab === "text" && (
          <div className="space-y-4">
            <Textarea
              placeholder="Paste articles, reports, notes, or any text material...

The AI will analyze, expand, and transform this content into a ZEN Weekly intelligence artifact with proper structure, data visualizations, and editorial polish."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              disabled={isProcessing}
              className="min-h-[200px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {pastedText.length.toLocaleString()} characters
            </p>
          </div>
        )}
      </div>

      {/* Style & Theme */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="zen-label mb-3 block">Style</label>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                disabled={isProcessing}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-300 disabled:opacity-50 ${
                  style === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="zen-label mb-3 block">Theme</label>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                disabled={isProcessing}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-300 disabled:opacity-50 ${
                  theme === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        variant="zen"
        size="xl"
        onClick={handleGenerate}
        disabled={!canGenerate || isProcessing}
        className="w-full group"
      >
        {isScraping ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Scraping URLs...
          </>
        ) : isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating {length === "book" ? "Book" : "Artifact"}...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate {length === "book" ? "Book" : "Artifact"}
          </>
        )}
      </Button>

      {length === "book" && (
        <p className="text-xs text-center text-muted-foreground">
          Book-length generation may take 1-2 minutes to complete.
        </p>
      )}
    </div>
  );
};

export default InputPanel;
