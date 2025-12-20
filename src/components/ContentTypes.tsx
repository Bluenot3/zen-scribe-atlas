import { FileText, Mail, BookOpen, Briefcase, GraduationCap, Share2 } from "lucide-react";

const contentTypes = [
  {
    icon: FileText,
    title: "Long-Form Articles",
    description: "Magazine-quality features with systems analysis, data visualization, and geopolitical context.",
    tag: "FLAGSHIP"
  },
  {
    icon: Mail,
    title: "Intelligence Newsletters",
    description: "Weekly briefings distilled for decision-makers. Structured for rapid consumption.",
    tag: "WEEKLY"
  },
  {
    icon: BookOpen,
    title: "Research Reports",
    description: "White papers and deep dives. 20-50 page analyses with full citation infrastructure.",
    tag: "PREMIUM"
  },
  {
    icon: Briefcase,
    title: "Executive Briefs",
    description: "Board-ready summaries. Strategic implications front-loaded.",
    tag: "C-SUITE"
  },
  {
    icon: GraduationCap,
    title: "Curriculum Material",
    description: "Teaching frameworks and structured learning modules for institutional use.",
    tag: "EDUCATION"
  },
  {
    icon: Share2,
    title: "Platform-Native Posts",
    description: "LinkedIn, Substack, Wix-optimized content. Paste-perfect formatting.",
    tag: "SOCIAL"
  }
];

const ContentTypes = () => {
  return (
    <section id="artifacts" className="py-24 lg:py-32 relative">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      
      <div className="zen-container">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="zen-label mb-4 block">Content Architecture</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Intelligence Artifact Types
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Each format follows distinct structural rules. Never collapsed into generic templates.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type, index) => (
            <div 
              key={type.title}
              className="zen-card p-8 group hover:border-primary/30 transition-all duration-500 opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <type.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="zen-mono text-primary/70 text-xs">{type.tag}</span>
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {type.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {type.description}
              </p>

              {/* Hover Line */}
              <div className="mt-6 h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentTypes;
