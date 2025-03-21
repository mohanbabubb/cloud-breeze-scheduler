
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { getTransitionClasses } from '@/utils/animations';
import { CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 mt-16">
        <div className="max-w-4xl w-full space-y-20 py-20">
          <Hero isLoaded={isLoaded} />
          <Features isLoaded={isLoaded} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function Hero({ isLoaded }: { isLoaded: boolean }) {
  return (
    <section className="text-center space-y-8">
      <div className={cn(
        "inline-block p-3 bg-secondary rounded-full mb-6 transition-all duration-500 transform",
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
      )}>
        <CalendarClock className="w-6 h-6" />
      </div>
      
      <h1 className={cn(
        "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-all duration-500 delay-100",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        Beautifully simple<br />calendar experience
      </h1>
      
      <p className={cn(
        "max-w-2xl mx-auto text-lg text-muted-foreground transition-all duration-500 delay-200",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        A minimal and intuitive calendar that helps you stay organized and focused.
        Designed with simplicity and elegance in mind.
      </p>
      
      <div className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transition-all duration-500 delay-300",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <Button asChild size="lg" className="px-8 py-6 text-base">
          <Link to="/calendar">
            Open Calendar
          </Link>
        </Button>
        
        <Button variant="outline" size="lg" asChild className="px-8 py-6 text-base">
          <a href="#features">
            Learn More
          </a>
        </Button>
      </div>
    </section>
  );
}

function Features({ isLoaded }: { isLoaded: boolean }) {
  const features = [
    {
      title: "Simple & Intuitive",
      description: "A clean interface that makes calendar management effortless and pleasant.",
      delay: 0
    },
    {
      title: "Beautiful Design",
      description: "Carefully crafted with attention to every detail and visual harmony.",
      delay: 100
    },
    {
      title: "Event Management",
      description: "Create, edit, and organize events with rich details and color coding.",
      delay: 200
    }
  ];
  
  return (
    <section id="features" className="py-10">
      <h2 className={cn(
        "text-3xl font-bold text-center mb-12 transition-all duration-500",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        Key Features
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div 
            key={i}
            className={cn(
              "bg-card border rounded-xl p-6 transition-all duration-500",
              isLoaded 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4",
              `delay-[${400 + feature.delay}ms]`
            )}
          >
            <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Calendar App. All rights reserved.
        </p>
        
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/calendar" className="text-muted-foreground hover:text-foreground transition-colors">
            Calendar
          </Link>
        </nav>
      </div>
    </footer>
  );
}
