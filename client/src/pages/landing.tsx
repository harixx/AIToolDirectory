
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Search, Plus, Video, Image, Code, Check, Crown, Zap, Rocket, Brain, Sparkles, Users, TrendingUp, Shield, Target, ArrowRight, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { HeroVideoAnimation } from "@/components/hero-video-animation";
import { ResponsiveContainer } from "@/components/design-system/responsive-container";
import { SkipLinks } from "@/components/design-system/accessibility-skip-link";
import { useState, useEffect, useRef } from "react";

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: featuredTools, isLoading } = useQuery({
    queryKey: ["/api/tools/featured"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "fas fa-video":
        return <Video className="w-4 h-4" />;
      case "fas fa-image":
        return <Image className="w-4 h-4" />;
      case "fas fa-code":
        return <Code className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "green":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "blue":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="bg-black text-white overflow-hidden relative" ref={containerRef}>
      <SkipLinks />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Immersive Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          {/* Floating Title with Morphing Effect */}
          <div className="mb-8 relative">
            <h1 className="text-8xl md:text-9xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              AI
            </h1>
            <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Tool Universe
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Step into the future of AI discovery. Experience tools like never before.
            </p>
          </div>

          {/* Interactive Stats Sphere */}
          <div className="mb-12 relative">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { number: "500+", label: "AI Tools", icon: <Brain className="w-6 h-6" /> },
                { number: "25K+", label: "Users", icon: <Users className="w-6 h-6" /> },
                { number: "12K+", label: "Reviews", icon: <Star className="w-6 h-6" /> },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`
                    bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 
                    rounded-full p-8 transition-all duration-500 hover:scale-110 hover:rotate-12
                    ${hoveredCard === i ? 'shadow-2xl shadow-cyan-500/50' : ''}
                  `}>
                    <div className="text-cyan-400 mb-2 flex justify-center">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Floating CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Launch Discovery
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-lg px-8 py-4 rounded-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Join Universe
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* Hexagonal Categories Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Choose Your Domain
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Navigate through AI realms designed for every purpose
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((category: any, index: number) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer">
                    <div className="text-4xl mb-4">{getCategoryIcon(category.icon)}</div>
                    <h3 className="text-xl font-bold mb-2 text-white">{category.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{category.description || "Explore cutting-edge AI tools"}</p>
                    <div className="flex items-center text-cyan-400 text-sm">
                      <span>Explore Realm</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Tool Cards */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Featured Innovations
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover tools that are reshaping industries
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
                  <div className="w-full h-48 bg-white/10 rounded-xl mb-4" />
                  <div className="w-3/4 h-4 bg-white/10 rounded mb-2" />
                  <div className="w-1/2 h-4 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTools?.map((tool: any, index: number) => (
                <div 
                  key={tool.id}
                  className="group relative"
                  style={{
                    transform: `translateY(${Math.sin(scrollY * 0.01 + index) * 10}px)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Card className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                            {tool.featuredImage ? (
                              <img src={tool.featuredImage} alt={tool.name} className="w-12 h-12 rounded-xl object-cover" />
                            ) : (
                              <Zap className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white">{tool.name}</h3>
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="w-4 h-4 fill-current" />
                                ))}
                              </div>
                              <span className="text-sm text-gray-400 ml-2">
                                {tool.overallScore?.toFixed(1) || "4.5"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0">
                          {tool.category?.name || "AI Tool"}
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-4">{tool.shortDescription}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-white/30 text-white">
                            {tool.pricingModel}
                          </Badge>
                          <Badge variant="outline" className="border-white/30 text-white">
                            {tool.difficultyLevel}
                          </Badge>
                        </div>
                        <Link href={`/tools/${tool.slug}`}>
                          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0">
                            <Target className="w-4 h-4 mr-2" />
                            Explore
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Immersive CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Join the Revolution
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Be part of the AI evolution. Your tool could be the next breakthrough.
            </p>
          </div>

          {/* Morphing Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Free Discovery</h3>
                    <div className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      $0
                    </div>
                    <p className="text-gray-400">Enter the universe</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-cyan-400 mr-3" />
                      <span>Access to 25,000+ seekers</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-cyan-400 mr-3" />
                      <span>Basic tool showcase</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-cyan-400 mr-3" />
                      <span>Community reviews</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
                    Start Journey
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Premium Plan */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-purple-500/30 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Premium Spotlight</h3>
                    <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      $49
                    </div>
                    <p className="text-gray-400">Rule the universe</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-purple-400 mr-3" />
                      <span>Everything in Free +</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-purple-400 mr-3" />
                      <span>Verified status badge</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-purple-400 mr-3" />
                      <span>Featured placement</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-purple-400 mr-3" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Claim Spotlight
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Floating Elements */}
      <footer className="relative py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Tool Universe
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover, compare, and choose from the most innovative AI tools across the digital cosmos.
            </p>
          </div>
          <div className="flex justify-center space-x-6 text-gray-400">
            <span>© 2024 AI Tool Universe</span>
            <span>•</span>
            <span>Made with ❤️ for innovators</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
