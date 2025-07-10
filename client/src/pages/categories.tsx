import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Image, Code, Grid3x3, ArrowRight, TrendingUp } from "lucide-react";

export default function Categories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "fas fa-video":
        return <Video className="w-8 h-8" />;
      case "fas fa-image":
        return <Image className="w-8 h-8" />;
      case "fas fa-code":
        return <Code className="w-8 h-8" />;
      default:
        return <Grid3x3 className="w-8 h-8" />;
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case "purple":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          gradient: "from-purple-500 to-purple-600",
        };
      case "green":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          gradient: "from-green-500 to-green-600",
        };
      case "blue":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          gradient: "from-blue-500 to-blue-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          gradient: "from-gray-500 to-gray-600",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4" />
                <div className="w-32 h-6 bg-gray-200 rounded mb-2" />
                <div className="w-full h-16 bg-gray-200 rounded mb-4" />
                <div className="w-20 h-5 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explore AI Tool Categories
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover AI tools organized by category to find exactly what you need for your projects
            </p>
            <div className="flex justify-center items-center space-x-8 text-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold">{categories?.length || 0}</div>
                <div className="text-sm">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">New Monthly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each category contains carefully curated AI tools with detailed reviews and comparisons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((category: any) => {
              const colors = getCategoryColor(category.color);
              return (
                <Card key={category.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className={`${colors.bg} ${colors.border} border-b`}>
                    <div className="flex items-center justify-between">
                      <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text}`}>
                        {getCategoryIcon(category.icon)}
                      </div>
                      <Badge variant="secondary" className="bg-white/80">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Grid3x3 className="w-4 h-4 mr-1" />
                        {/* Mock tool count - in real app this would come from API */}
                        {category.name === "AI Video Tools" && "45 tools"}
                        {category.name === "AI Image Tools" && "78 tools"}
                        {category.name === "AI Code Tools" && "62 tools"}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Explore
                      </div>
                    </div>
                    
                    <Link href={`/categories/${category.slug}`}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 transition-opacity`}
                      >
                        View {category.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* All Tools CTA */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
                <p className="text-gray-600 mb-6">
                  Browse all AI tools or use our advanced search to find specific solutions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/tools">
                    <Button size="lg">
                      Browse All Tools
                    </Button>
                  </Link>
                  <Link href="/tools?search=">
                    <Button variant="outline" size="lg">
                      Advanced Search
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
            <p className="text-gray-600">
              Join thousands of users discovering the perfect AI tools for their needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">AI Tools Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">12K+</div>
              <div className="text-gray-600">User Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Tools Added Monthly</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
