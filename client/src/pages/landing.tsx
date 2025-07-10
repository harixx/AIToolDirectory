import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Search, Plus, Video, Image, Code, Check, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { HeroVideoAnimation } from "@/components/hero-video-animation";
import { ResponsiveContainer } from "@/components/design-system/responsive-container";
import { SkipLinks } from "@/components/design-system/accessibility-skip-link";

export default function Landing() {
  const { data: featuredTools, isLoading } = useQuery({
    queryKey: ["/api/tools/featured"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

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
    <div className="bg-slate-50">
      <SkipLinks />
      
      {/* Hero Video Animation Section */}
      <section className="relative">
        <ResponsiveContainer maxWidth="full" padding="lg" className="py-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-glow">
              The Future of AI Discovery
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the Best AI Tools for your needs
            </p>
          </div>
          <HeroVideoAnimation 
            onCtaClick={() => window.location.href = '/tools'}
          />
        </ResponsiveContainer>
      </section>
      
      {/* Secondary Hero Section */}
      <section id="main-content" className="gradient-animated text-white py-20 relative overflow-hidden particle-bg">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 morph-shape animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full animate-pulse delay-1000 neon-blue"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-full animate-pulse delay-2000 neon-purple"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-40 right-10 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg animate-spin slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-hierarchy-1 mb-6 fade-in-up text-glow">
              Discover the Best
              <span className="text-yellow-300 animate-pulse neon-blue"> AI Tools</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
              Find, compare, and choose from thousands of AI tools across different categories. 
              Make informed decisions with our comprehensive reviews and ratings.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 fade-in-up stagger-3">
              <Link href="/tools">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 btn-3d emotional-shadow hover:shadow-xl transform transition-all duration-300">
                  <Search className="w-5 h-5 mr-2" />
                  Browse All Tools
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary glass-card transition-all duration-300">
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Your Tool
                </Button>
              </Link>
            </div>
            <div className="flex justify-center items-center space-x-8 text-blue-100">
              <div className="text-center group">
                <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300 counter-animate">500+</div>
                <div className="text-sm opacity-90">AI Tools</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300 counter-animate">12K+</div>
                <div className="text-sm opacity-90">Reviews</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300 counter-animate">25K+</div>
                <div className="text-sm opacity-90">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gradient-to-r from-slate-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools">
              <Button className="bg-primary text-white hover:bg-blue-700 btn-3d emotional-shadow neon-blue">
                All Categories
              </Button>
            </Link>
            {categories?.map((category: any, index: number) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Button variant="outline" className={`${getCategoryColor(category.color)} feedback-button hover-lift transition-all duration-300 fade-in-up stagger-${Math.min(index + 1, 6)} glass-card border-0`}>
                  {getCategoryIcon(category.icon)}
                  <span className="ml-2">{category.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-hierarchy-2 text-gray-900 mb-4">Featured AI Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover the most popular and highly-rated AI tools chosen by our community
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3" />
                    <div>
                      <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                      <div className="w-16 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-16 bg-gray-200 rounded mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="w-16 h-6 bg-gray-200 rounded-full" />
                      <div className="w-16 h-6 bg-gray-200 rounded-full" />
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools?.map((tool: any, index: number) => (
                <Card key={tool.id} className={`card-3d hover:shadow-lg transition-all duration-500 fade-in-up stagger-${Math.min(index + 1, 6)} glass-card border-0`}>
                  <CardContent className="p-6 card-inner">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          {tool.featuredImage ? (
                            <img src={tool.featuredImage} alt={tool.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{tool.name}</h3>
                          <div className="flex items-center">
                            <div className="flex text-yellow-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {tool.overallScore?.toFixed(1) || "4.5"} ({tool.views || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {tool.category?.name || "AI Tool"}
                        </Badge>
                        {tool.isVerified && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{tool.shortDescription}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{tool.pricingModel}</Badge>
                        <Badge variant="outline">{tool.difficultyLevel}</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/tools/${tool.slug}`} className="flex-1">
                        <Button className="w-full">View Details</Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Compare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/tools">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                View All Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tool Submission CTA */}
      <section className="py-20 gradient-animated particle-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow fade-in-up">Submit Your AI Tool</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto fade-in-up stagger-2 leading-relaxed">
            Get your AI tool discovered by thousands of users. Choose from our free or premium listing options.
          </p>
          <div className="flex flex-col lg:flex-row justify-center gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="flex-1 glass-card border-0 fade-in-up stagger-3 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Free Listing</h3>
                  <div className="text-6xl font-black text-green-600 mb-2 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>$0</div>
                  <p className="text-gray-700 font-medium">Perfect for getting started</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Basic tool listing</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Up to 6 key features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Basic description</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Website link</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Community reviews</span>
                  </li>
                </ul>
                <Link href="/api/login">
                  <Button variant="outline" className="w-full text-lg py-3">
                    Submit Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Paid Plan */}
            <Card className="flex-1 glass-card border-0 relative neon-purple fade-in-up stagger-4 shadow-2xl border-primary border-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg animate-pulse">
                Most Popular
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center justify-center text-gray-900">
                    <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                    Premium Listing
                  </h3>
                  <div className="text-6xl font-black text-primary mb-2 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>$49</div>
                  <p className="text-gray-700 font-medium">One-time payment for enhanced visibility</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">All free features +</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Verified badge</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Featured placement (7 days)</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Video embeds & screenshots</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">SEO optimization & Google indexing</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-lg">Priority support</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full text-lg py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Get Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-blue-100">
            <p className="text-lg">
              🚀 Join 25,000+ monthly visitors discovering new AI tools
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
