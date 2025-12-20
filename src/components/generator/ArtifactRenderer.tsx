import { useState } from "react";
import { GeneratedArtifact, Section, KeyMetric, regenerateSection, StyleType } from "@/lib/api/generate";
import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus, Quote, AlertTriangle, CheckCircle, RefreshCw, X, Loader2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface ArtifactRendererProps {
  artifact: GeneratedArtifact;
  onUpdate: (artifact: GeneratedArtifact) => void;
  style?: StyleType;
}

const CHART_COLORS = ["hsl(38, 92%, 50%)", "hsl(38, 60%, 40%)", "hsl(220, 15%, 40%)", "hsl(220, 15%, 55%)", "hsl(38, 40%, 60%)"];

const MetricCard = ({ metric }: { metric: KeyMetric }) => {
  const isPositive = metric.change?.startsWith("+");
  const isNegative = metric.change?.startsWith("-");

  return (
    <div className="zen-card p-6">
      <div className="zen-label mb-2">{metric.label}</div>
      <div className="font-serif text-3xl font-bold text-foreground mb-1">{metric.value}</div>
      {metric.change && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground"}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : isNegative ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          {metric.change}
        </div>
      )}
    </div>
  );
};

const DataChart = ({ section }: { section: Section }) => {
  const chartType = section.data?.chartType || "bar";
  const points = section.data?.points || [];

  if (!points.length) return null;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart data={points}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
            <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "4px" }} />
            <Bar dataKey="value" fill="hsl(38, 92%, 50%)" radius={[2, 2, 0, 0]} />
          </BarChart>
        ) : chartType === "line" ? (
          <LineChart data={points}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
            <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "4px" }} />
            <Line type="monotone" dataKey="value" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ fill: "hsl(38, 92%, 50%)" }} />
          </LineChart>
        ) : chartType === "area" ? (
          <AreaChart data={points}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
            <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "4px" }} />
            <Area type="monotone" dataKey="value" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 50%, 30%)" />
          </AreaChart>
        ) : (
          <PieChart>
            <Pie data={points} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {points.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "4px" }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

const TimelineSection = ({ section }: { section: Section }) => {
  const events = section.data?.events || [];
  
  return (
    <div className="relative pl-8 space-y-8">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      {events.map((event, index) => (
        <div key={index} className="relative animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="absolute -left-5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
          <div className="zen-mono text-primary text-sm mb-1">{event.year}</div>
          <h4 className="font-serif font-semibold text-foreground mb-1">{event.title}</h4>
          <p className="text-muted-foreground text-sm">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

const ComparisonSection = ({ section }: { section: Section }) => {
  const items = section.data?.items || [];
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={index} className="zen-card p-6">
          <h4 className="font-serif font-semibold text-foreground mb-4">{item.name}</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-green-500 text-xs font-medium mb-2">
                <CheckCircle className="w-3 h-3" />PROS
              </div>
              <ul className="space-y-1">
                {item.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-red-500 text-xs font-medium mb-2">
                <AlertTriangle className="w-3 h-3" />CONS
              </div>
              <ul className="space-y-1">
                {item.cons.map((con, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const QuoteSection = ({ section }: { section: Section }) => {
  const quote = section.data?.quote || section.content;
  const author = section.data?.author;
  const role = section.data?.role;

  return (
    <div className="relative py-8 px-6 md:px-12 bg-secondary/30 border-l-4 border-primary">
      <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/30" />
      <blockquote className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed mb-4">
        "{quote}"
      </blockquote>
      {author && (
        <div className="text-sm">
          <span className="text-foreground font-medium">{author}</span>
          {role && <span className="text-muted-foreground"> — {role}</span>}
        </div>
      )}
    </div>
  );
};

interface EditableSectionProps {
  section: Section;
  index: number;
  onRegenerate: (index: number, instruction: string) => Promise<void>;
  isRegenerating: boolean;
}

const EditableSection = ({ section, index, onRegenerate, isRegenerating }: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [instruction, setInstruction] = useState("");

  const handleRegenerate = async () => {
    if (!instruction.trim()) return;
    await onRegenerate(index, instruction);
    setIsEditing(false);
    setInstruction("");
  };

  const renderContent = () => {
    switch (section.type) {
      case "intro":
        return (
          <div className="text-lg md:text-xl text-foreground leading-relaxed font-serif">
            {section.content}
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            {section.title && <h3 className="font-serif text-2xl font-bold text-foreground">{section.title}</h3>}
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</div>
          </div>
        );

      case "quote":
        return <QuoteSection section={section} />;

      case "data":
        return (
          <div className="zen-card p-6 space-y-4">
            {section.title && <h3 className="font-serif text-xl font-bold text-foreground">{section.title}</h3>}
            {section.content && <p className="text-muted-foreground text-sm">{section.content}</p>}
            <DataChart section={section} />
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-4">
            {section.title && <h3 className="font-serif text-2xl font-bold text-foreground">{section.title}</h3>}
            <TimelineSection section={section} />
          </div>
        );

      case "comparison":
        return (
          <div className="space-y-4">
            {section.title && <h3 className="font-serif text-2xl font-bold text-foreground">{section.title}</h3>}
            <ComparisonSection section={section} />
          </div>
        );

      case "callout":
        return (
          <div className="zen-card p-6 border-l-4 border-primary bg-primary/5">
            {section.title && <h4 className="font-serif font-bold text-foreground mb-2">{section.title}</h4>}
            <p className="text-foreground">{section.content}</p>
          </div>
        );

      case "conclusion":
        return (
          <div className="py-8 border-t border-border">
            {section.title && <h3 className="font-serif text-2xl font-bold text-foreground mb-4">{section.title}</h3>}
            <div className="text-lg text-foreground leading-relaxed">{section.content}</div>
          </div>
        );

      default:
        return <div className="text-muted-foreground">{section.content}</div>;
    }
  };

  return (
    <div className="group relative">
      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-sm bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary"
        title="Regenerate this section"
      >
        <Edit3 className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className={isRegenerating ? "opacity-50" : ""}>
        {renderContent()}
      </div>

      {/* Edit Panel */}
      {isEditing && (
        <div className="mt-4 p-4 bg-secondary/50 border border-border rounded-sm space-y-3 animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Regenerate this section</span>
            <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <Textarea
            placeholder="How should this section change?

Examples:
• Make this more analytical with specific data
• Add a comparison table
• Convert to a timeline
• Make it more concise
• Add industry statistics"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="min-h-[100px] bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex gap-2">
            <Button
              variant="zen"
              size="sm"
              onClick={handleRegenerate}
              disabled={!instruction.trim() || isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const ArtifactRenderer = ({ artifact, onUpdate, style = "zen-editorial" }: ArtifactRendererProps) => {
  const { toast } = useToast();
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const handleRegenerate = async (index: number, instruction: string) => {
    setRegeneratingIndex(index);

    try {
      // Build context from surrounding sections
      const contextParts = [
        `Title: ${artifact.title}`,
        `Subtitle: ${artifact.subtitle}`,
        ...artifact.sections.slice(Math.max(0, index - 2), index + 3).map((s, i) => 
          `Section ${index - 2 + i}: ${s.title || s.type} - ${s.content?.slice(0, 200)}...`
        )
      ];

      const result = await regenerateSection(
        index,
        artifact.sections[index],
        contextParts.join("\n"),
        instruction,
        style
      );

      if (result.success && result.section) {
        const newSections = [...artifact.sections];
        newSections[index] = result.section;
        onUpdate({ ...artifact, sections: newSections });
        toast({ title: "Section regenerated" });
      } else {
        toast({
          title: "Regeneration failed",
          description: result.error || "Unable to regenerate section",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Regeneration error:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate section",
        variant: "destructive",
      });
    } finally {
      setRegeneratingIndex(null);
    }
  };

  return (
    <article className="max-w-4xl mx-auto pl-12">
      {/* Header */}
      <header className="mb-12 pb-8 border-b border-border">
        <div className="flex items-center gap-4 mb-6">
          <span className="zen-mono text-xs bg-primary text-primary-foreground px-3 py-1">
            {artifact.category}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {artifact.readTime}
          </span>
          <span className="text-sm text-muted-foreground">
            {artifact.sections.length} sections
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
          {artifact.title}
        </h1>
        {artifact.subtitle && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {artifact.subtitle}
          </p>
        )}
      </header>

      {/* Key Metrics */}
      {artifact.keyMetrics.length > 0 && (
        <div className="mb-12">
          <h2 className="zen-label mb-4">Key Metrics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artifact.keyMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      )}

      {/* Editable Sections */}
      <div className="space-y-10">
        {artifact.sections.map((section, index) => (
          <EditableSection
            key={index}
            section={section}
            index={index}
            onRegenerate={handleRegenerate}
            isRegenerating={regeneratingIndex === index}
          />
        ))}
      </div>

      {/* Sources */}
      {artifact.sources.length > 0 && (
        <footer className="mt-12 pt-8 border-t border-border">
          <h3 className="zen-label mb-4">Sources</h3>
          <ul className="space-y-2">
            {artifact.sources.map((source, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4 mt-0.5 shrink-0" />
                {source}
              </li>
            ))}
          </ul>
        </footer>
      )}

      {/* Edit Hint */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Hover over any section and click <Edit3 className="w-3 h-3 inline" /> to regenerate it with custom instructions</p>
      </div>
    </article>
  );
};

export default ArtifactRenderer;
