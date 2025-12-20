import { ArrowUpRight, Clock, Tag } from "lucide-react";

const artifacts = [
  {
    category: "GEOPOLITICS",
    title: "The Semiconductor Choke: How ASML Became the Most Important Company You've Never Heard Of",
    excerpt: "A systems-level analysis of lithography monopolies, Dutch foreign policy, and the compute war reshaping global power.",
    readTime: "24 min",
    date: "Dec 15, 2024",
    featured: true
  },
  {
    category: "ENERGY",
    title: "Grid Collapse Probability Models: Texas, California, and the Coming Infrastructure Stress",
    excerpt: "Quantifying failure modes across aging power infrastructure under climate extremes.",
    readTime: "18 min",
    date: "Dec 12, 2024",
    featured: false
  },
  {
    category: "AI SYSTEMS",
    title: "The Inference Cost Cliff: Why GPT-5 Economics May Break Current Business Models",
    excerpt: "Compute scaling laws, energy constraints, and the hidden costs behind frontier AI deployment.",
    readTime: "21 min",
    date: "Dec 08, 2024",
    featured: false
  },
  {
    category: "FINANCE",
    title: "Shadow Banking Redux: The $65T Derivatives Exposure Nobody Is Watching",
    excerpt: "Systemic risk mapping in opaque credit markets. Counterparty analysis and contagion vectors.",
    readTime: "32 min",
    date: "Dec 05, 2024",
    featured: false
  }
];

const FeaturedArtifacts = () => {
  const featuredArticle = artifacts[0];
  const otherArticles = artifacts.slice(1);

  return (
    <section className="py-24 lg:py-32 bg-secondary/30 relative">
      <div className="zen-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <span className="zen-label mb-4 block">Latest Intelligence</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground">
              Featured Artifacts
            </h2>
          </div>
          <a 
            href="#" 
            className="group flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View Archive
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Featured Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Main Featured */}
          <div className="zen-card p-0 overflow-hidden group cursor-pointer lg:row-span-2">
            <div className="h-64 lg:h-80 bg-gradient-to-br from-primary/20 via-secondary to-background relative overflow-hidden">
              {/* Abstract Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/30 rotate-45" />
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-primary/20 rotate-12" />
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-primary/10" />
              </div>
              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <span className="zen-mono text-xs bg-primary text-primary-foreground px-3 py-1.5">
                  {featuredArticle.category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                {featuredArticle.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {featuredArticle.readTime}
                </span>
                <span>{featuredArticle.date}</span>
              </div>
            </div>
          </div>

          {/* Secondary Articles */}
          <div className="flex flex-col gap-6">
            {otherArticles.map((article, index) => (
              <div 
                key={article.title}
                className="zen-card p-6 group cursor-pointer hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="zen-mono text-xs text-primary">{article.category}</span>
                      <span className="text-muted-foreground text-xs">{article.date}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtifacts;
