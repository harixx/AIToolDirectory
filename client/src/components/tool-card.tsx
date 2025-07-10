import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Heart, Star, Check, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ToolCardProps {
  tool: {
    id: number;
    name: string;
    slug: string;
    shortDescription: string;
    pricingModel: string;
    difficultyLevel: string;
    overallScore?: number;
    views: number;
    isVerified: boolean;
    isFeatured: boolean;
    featuredImage?: string;
    category?: {
      name: string;
      color: string;
    };
  };
  showCompareButton?: boolean;
  onCompare?: (toolId: number) => void;
}

export default function ToolCard({ tool, showCompareButton = true, onCompare }: ToolCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: async (action: 'add' | 'remove') => {
      if (action === 'add') {
        return apiRequest('POST', '/api/user/favorites', { toolId: tool.id });
      } else {
        return apiRequest('DELETE', `/api/user/favorites/${tool.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/favorites'] });
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: `${tool.name} has been ${isFavorited ? 'removed from' : 'added to'} your favorites.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add tools to your favorites.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add tools to your favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
    
    favoriteMutation.mutate(isFavorited ? 'remove' : 'add');
  };

  const getCategoryColor = (color?: string) => {
    switch (color) {
      case "purple":
        return "innovation-color";
      case "green":
        return "growth-color";
      case "blue":
        return "trust-color";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
    <Card 
      className="hover-lift emotional-shadow group cursor-pointer transition-all duration-300 hover:border-primary/30 tech-highlight overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6 relative">
        {/* AI Pattern Background */}
        <div className="absolute inset-0 ai-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 emotional-border">
                {tool.featuredImage ? (
                  <img 
                    src={tool.featuredImage} 
                    alt={tool.name} 
                    className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors duration-300">
                  {tool.name}
                </h3>
                <div className="flex items-center">
                  <div className="flex text-yellow-500 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 transition-all duration-200 ${
                          star <= Math.floor(tool.overallScore || 4.5) 
                            ? 'fill-current scale-110' 
                            : 'group-hover:text-yellow-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {tool.overallScore?.toFixed(1) || "4.5"} ({tool.views || 0} views)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {tool.category && (
                <Badge 
                  variant="secondary" 
                  className={`${getCategoryColor(tool.category.color)} transition-all duration-300 hover:scale-105`}
                >
                  {tool.category.name}
                </Badge>
              )}
              {tool.isVerified && (
                <div className="relative">
                  <Check className="w-4 h-4 text-green-500 hover-glow" title="Verified Tool" />
                  {isHovered && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-90">
                      Verified
                    </div>
                  )}
                </div>
              )}
              {tool.isFeatured && (
                <Badge variant="outline" className="premium-color animate-pulse">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {tool.shortDescription}
          </p>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPricingColor(tool.pricingModel)}>
                {tool.pricingModel}
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(tool.difficultyLevel)}>
                {tool.difficultyLevel}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              disabled={favoriteMutation.isPending}
              className={`${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <div className="flex gap-2">
            <Link href={`/tools/${tool.slug}`} className="flex-1">
              <Button className="w-full">
                View Details
              </Button>
            </Link>
            {showCompareButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCompare?.(tool.id)}
                className="px-3"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
