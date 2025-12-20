import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,hsl(38_50%_15%_/_0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(220_30%_10%_/_0.8),transparent_40%)]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Accent Lines */}
      <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-1/3 right-0 w-48 h-px bg-gradient-to-l from-transparent via-primary/30 to-transparent" />

      <div className="zen-container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 mb-8 opacity-0 animate-fade-up">
            <Zap className="w-3 h-3 text-primary" />
            <span className="zen-label">Intelligence Publication Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[0.9] tracking-tight mb-8 opacity-0 animate-fade-up delay-100">
            <span className="text-foreground">We don't react to</span>
            <br />
            <span className="text-foreground">the future.</span>
            <br />
            <span className="zen-text-gradient">We map it.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-up delay-200">
            Archival-grade intelligence artifacts designed to survive scrutiny, time, and scale. 
            Dense, cinematic, data-driven, and publication-perfect.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-up delay-300">
            <Button variant="zen" size="xl" className="w-full sm:w-auto group">
              Explore Artifacts
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="zen-outline" size="xl" className="w-full sm:w-auto">
              Read Methodology
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-0 animate-fade-up delay-400">
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-1">47</div>
              <div className="zen-label">Weekly Briefings</div>
            </div>
            <div className="text-center border-x border-border/50">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-1">12K+</div>
              <div className="zen-label">Intelligence Readers</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-1">98%</div>
              <div className="zen-label">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
