import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  X,
  Check,
  Minus,
  Star,
  ExternalLink,
  Heart,
  BarChart3,
  AlertCircle,
  Lightbulb,
  Video,
  Image as ImageIcon,
  Code,
  Grid3x3,
} from "lucide-react";
import { Link } from "wouter";

interface ComparisonTool {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  pricingModel: string;
  difficultyLevel: string;
  overallScore?: number;
  easeOfUseScore?: number;
  featuresScore?: number;
  supportScore?: number;
  pricingScore?: number;
  integrationScore?: number;
  keyFeatures: string[];
  website?: string;
  featuredImage?: string;
  isVerified: boolean;
  category?: {
    name: string;
    color: string;
  };
}

export default function Compare() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTools, setSelectedTools] = useState<ComparisonTool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ComparisonTool[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Parse URL parameters for initial tools
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const toolsParam = urlParams.get('tools');
    
    if (toolsParam) {
      const toolIds = toolsParam.split(',').map(id => parseInt(id)).filter(Boolean);
      if (toolIds.length > 0) {
        // Fetch initial tools
        apiRequest('POST', '/api/tools/compare', { toolIds })
          .then(response => response.json())
          .then(tools => {
            setSelectedTools(tools.slice(0, 3)); // Max 3 tools
          })
          .catch(error => {
            console.error('Error loading initial tools:', error);
          });
      }
    }
  }, [location]);

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('GET', `/api/tools?search=${encodeURIComponent(query)}&limit=10`);
      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data.tools || []);
      setIsSearching(false);
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: "Failed to search tools. Please try again.",
        variant: "destructive",
      });
      setIsSearching(false);
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      setIsSearching(true);
      searchMutation.mutate(query);
    } else {
      setSearchResults([]);
    }
  };

  const addToolToComparison = (tool: ComparisonTool) => {
    if (selectedTools.length >= 3) {
      toast({
        title: "Maximum tools reached",
        description: "You can compare up to 3 tools at once.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTools.find(t => t.id === tool.id)) {
      toast({
        title: "Tool already added",
        description: "This tool is already in your comparison.",
        variant: "destructive",
      });
      return;
    }

    const newSelectedTools = [...selectedTools, tool];
    setSelectedTools(newSelectedTools);
    setSearchQuery("");
    setSearchResults([]);
    
    // Update URL
    const toolIds = newSelectedTools.map(t => t.id).join(',');
    navigate(`/compare?tools=${toolIds}`);
  };

  const removeToolFromComparison = (toolId: number) => {
    const newSelectedTools = selectedTools.filter(tool => tool.id !== toolId);
    setSelectedTools(newSelectedTools);
    
    // Update URL
    if (newSelectedTools.length > 0) {
      const toolIds = newSelectedTools.map(t => t.id).join(',');
      navigate(`/compare?tools=${toolIds}`);
    } else {
      navigate('/compare');
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.toLowerCase().includes('video')) return <Video className="w-4 h-4" />;
    if (categoryName.toLowerCase().includes('image')) return <ImageIcon className="w-4 h-4" />;
    if (categoryName.toLowerCase().includes('code')) return <Code className="w-4 h-4" />;
    return <Grid3x3 className="w-4 h-4" />;
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing.toLowerCase()) {
      case "free":
        return "bg-green-100 text-green-700";
      case "freemium":
        return "bg-blue-100 text-blue-700";
      case "paid":
        return "bg-orange-100 text-orange-700";
      case "custom":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "expert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Compare AI Tools
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Make informed decisions by comparing up to 3 AI tools side-by-side across key features and pricing
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Tools to Compare</CardTitle>
            <p className="text-sm text-gray-600">
              Search and select up to 3 AI tools to compare side-by-side
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search for AI tools to compare..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                  {searchResults.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => addToolToComparison(tool)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded mr-3">
                          {tool.featuredImage ? (
                            <img src={tool.featuredImage} alt={tool.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-sm text-gray-500">{tool.category?.name}</p>
                        </div>
                      </div>
                      <Button size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected Tools Pills */}
            {selectedTools.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedTools.map((tool) => (
                  <div key={tool.id} className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                    <span className="text-sm font-medium mr-2">{tool.name}</span>
                    <button
                      onClick={() => removeToolFromComparison(tool.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedTools.length > 0 ? (
          <div className="space-y-6">
            {/* Tool Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedTools.map((tool) => (
                <Card key={tool.id} className="relative">
                  <button
                    onClick={() => removeToolFromComparison(tool.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <CardHeader className="pb-4">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        {tool.featuredImage ? (
                          <img src={tool.featuredImage} alt={tool.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-primary/20 rounded" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{tool.name}</h3>
                        <div className="flex items-center">
                          <div className="flex text-yellow-500 mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= Math.floor(tool.overallScore || 4.5) ? "fill-current" : ""}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {tool.overallScore?.toFixed(1) || "4.5"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {tool.category && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getCategoryIcon(tool.category.name)}
                          {tool.category.name}
                        </Badge>
                      )}
                      {tool.isVerified && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm">{tool.shortDescription}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Link href={`/tools/${tool.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {tool.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={tool.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add Tool Placeholder */}
              {selectedTools.length < 3 && (
                <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Add another tool to compare</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Use the search bar above to find tools
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Feature</th>
                        {selectedTools.map((tool) => (
                          <th key={tool.id} className="text-center py-3 px-4 font-semibold min-w-[200px]">
                            {tool.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Basic Information */}
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Pricing Model</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="py-3 px-4 text-center">
                            <Badge variant="outline" className={getPricingColor(tool.pricingModel)}>
                              {tool.pricingModel}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Difficulty Level</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="py-3 px-4 text-center">
                            <Badge variant="outline" className={getDifficultyColor(tool.difficultyLevel)}>
                              {tool.difficultyLevel}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Overall Rating</td>
                        {selectedTools.map((tool) => (
                          <td key={tool.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <div className="flex text-yellow-500 mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.floor(tool.overallScore || 4.5) ? "fill-current" : ""}`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">
                                {tool.overallScore?.toFixed(1) || "4.5"}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Evaluation Scores */}
                      {selectedTools.some(tool => tool.easeOfUseScore) && (
                        <>
                          <tr className="border-b bg-gray-50">
                            <td colSpan={selectedTools.length + 1} className="py-2 px-4 font-semibold text-sm text-gray-700">
                              EVALUATION SCORES (1-10)
                            </td>
                          </tr>
                          
                          {[
                            { key: 'easeOfUseScore', label: 'Ease of Use' },
                            { key: 'featuresScore', label: 'Features' },
                            { key: 'supportScore', label: 'Support' },
                            { key: 'pricingScore', label: 'Pricing' },
                            { key: 'integrationScore', label: 'Integration' },
                          ].map((score) => (
                            <tr key={score.key} className="border-b">
                              <td className="py-3 px-4 font-medium">{score.label}</td>
                              {selectedTools.map((tool) => (
                                <td key={tool.id} className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <span className="font-semibold mr-2">
                                      {tool[score.key as keyof ComparisonTool]?.toFixed(1) || "N/A"}
                                    </span>
                                    {tool[score.key as keyof ComparisonTool] && (
                                      <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-primary h-2 rounded-full"
                                          style={{ width: `${((tool[score.key as keyof ComparisonTool] as number) || 0) * 10}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </>
                      )}

                      {/* Key Features */}
                      <tr className="border-b bg-gray-50">
                        <td colSpan={selectedTools.length + 1} className="py-2 px-4 font-semibold text-sm text-gray-700">
                          KEY FEATURES
                        </td>
                      </tr>
                      
                      {/* Get all unique features across tools */}
                      {Array.from(new Set(selectedTools.flatMap(tool => tool.keyFeatures || []))).map((feature, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 font-medium">{feature}</td>
                          {selectedTools.map((tool) => (
                            <td key={tool.id} className="py-3 px-4 text-center">
                              {tool.keyFeatures?.includes(feature) ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <Minus className="w-5 h-5 text-gray-400 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setSelectedTools([]);
                  navigate('/compare');
                }}
                variant="outline"
              >
                Clear Comparison
              </Button>
              <Link href="/tools">
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Find More Tools
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Comparing AI Tools
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Use the search bar above to find and add AI tools to your comparison. 
                  You can compare up to 3 tools side-by-side.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4">
                    <Search className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">1. Search</h4>
                    <p className="text-sm text-gray-600">Find AI tools by name or category</p>
                  </div>
                  <div className="text-center p-4">
                    <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">2. Add</h4>
                    <p className="text-sm text-gray-600">Select up to 3 tools to compare</p>
                  </div>
                  <div className="text-center p-4">
                    <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">3. Compare</h4>
                    <p className="text-sm text-gray-600">View detailed side-by-side comparison</p>
                  </div>
                </div>
                <Link href="/tools" className="mt-6 inline-block">
                  <Button>
                    Browse All Tools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
