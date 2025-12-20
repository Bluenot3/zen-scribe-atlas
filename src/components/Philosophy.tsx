import { Layers, BarChart3, Building2, Clock, Globe } from "lucide-react";

const principles = [
  {
    icon: Layers,
    title: "Systems-First Thinking",
    description: "Explain how parts interact, not just what happened. Causal chains over isolated events."
  },
  {
    icon: BarChart3,
    title: "Numbers With Meaning",
    description: "Metrics must be contextualized, compared, and interpreted. No orphan statistics."
  },
  {
    icon: Building2,
    title: "Infrastructure Over Hype",
    description: "Every claim connects to compute, capital, labor, energy, policy, or incentives."
  },
  {
    icon: Clock,
    title: "Temporal Awareness",
    description: "Situate events in past → present → future trajectories. History as prologue."
  },
  {
    icon: Globe,
    title: "Global Lens",
    description: "U.S. focus where relevant, but always note global spillovers and second-order effects."
  }
];

const Philosophy = () => {
  return (
    <section id="methodology" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 right-0 w-1/2 h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-foreground"
              style={{
                left: `${i * 12.5}%`,
                top: 0,
                bottom: 0
              }}
            />
          ))}
        </div>
      </div>

      <div className="zen-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <div>
            <span className="zen-label mb-4 block">Editorial Philosophy</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
              Intelligence,{" "}
              <span className="zen-text-gradient">Not Commentary</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              ZEN Weekly content is dense, cinematic, data-driven, and structurally elegant. 
              We assume an intelligent reader who wants depth, not summaries. 
              Serious but readable. Urgent but not sensational.
            </p>
            
            {/* Quality Standards */}
            <div className="zen-card p-6 border-l-2 border-l-primary">
              <h4 className="font-serif font-semibold text-foreground mb-2">Output Standard</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every artifact passes through internal verification: no broken spacing, 
                no malformed lists, no density mismatches. Ready to publish on contact.
              </p>
            </div>
          </div>

          {/* Right Content - Principles */}
          <div className="space-y-6">
            {principles.map((principle, index) => (
              <div 
                key={principle.title}
                className="flex gap-5 group opacity-0 animate-slide-right"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <principle.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {principle.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
