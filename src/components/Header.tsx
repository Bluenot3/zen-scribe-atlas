import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="zen-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="font-serif font-bold text-primary-foreground text-lg">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-foreground tracking-tight text-lg">ZEN Weekly</span>
              <span className="zen-label text-[10px] hidden sm:block">Intelligence Artifacts</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#artifacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              Artifacts
            </a>
            <a href="#methodology" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              Methodology
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              About
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Button variant="zen-ghost" size="sm" className="hidden sm:inline-flex">
              Subscribe
            </Button>
            <Button variant="zen" size="sm">
              Access Briefings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
