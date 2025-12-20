import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast({
        title: "Welcome to ZEN Weekly",
        description: "You'll receive your first intelligence briefing shortly.",
      });
    }
  };

  return (
    <section className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(38_50%_12%_/_0.2),transparent_70%)]" />
      
      <div className="zen-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Label */}
          <span className="zen-label mb-4 block">Weekly Intelligence</span>
          
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Subscribe to the Briefing
          </h2>
          
          {/* Description */}
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Deep analysis delivered every Thursday. Systems thinking, data visualization, 
            and geopolitical context for decision-makers.
          </p>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 bg-secondary border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                required
              />
              <Button variant="zen" size="xl" type="submit" className="group">
                Subscribe
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 text-primary">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="font-medium">You're on the list</span>
            </div>
          )}

          {/* Privacy Note */}
          <p className="mt-6 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime. Your data stays encrypted.
          </p>

          {/* Decorative Elements */}
          <div className="mt-16 flex items-center justify-center gap-12 opacity-40">
            <div className="text-center">
              <div className="zen-mono text-xs mb-1">DELIVERY</div>
              <div className="text-sm text-foreground">Every Thursday</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="zen-mono text-xs mb-1">FORMAT</div>
              <div className="text-sm text-foreground">Long-form Analysis</div>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="text-center hidden sm:block">
              <div className="zen-mono text-xs mb-1">READERS</div>
              <div className="text-sm text-foreground">12,000+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
