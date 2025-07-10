import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  Heart,
  Star,
  ExternalLink,
  Check,
  Eye,
  Calendar,
  Globe,
  BarChart3,
  Share2,
  ChevronLeft,
  Video,
  Image as ImageIcon,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

export default function ToolDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    experience: "",
    dislikes: "",
    improvements: "",
  });

  const { data: tool, isLoading, isError } = useQuery({
    queryKey: ["/api/tools", slug],
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ["/api/tools", tool?.id, "reviews"],
    enabled: !!tool?.id,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (action: "add" | "remove") => {
      if (action === "add") {
        return apiRequest("POST", "/api/user/favorites", { toolId: tool.id });
      } else {
        return apiRequest("DELETE", `/api/user/favorites/${tool.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/favorites"] });
      toast({
        title: "Favorites updated",
        description: "Tool has been added to your favorites.",
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
          window.location.href = "/api/login";
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

  const reviewMutation = useMutation({
    mutationFn: async (reviewData: typeof reviewForm) => {
      return apiRequest("POST", `/api/tools/${tool.id}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools", tool.id, "reviews"] });
      setReviewForm({
        rating: 5,
        experience: "",
        dislikes: "",
        improvements: "",
      });
      toast({
        title: "Review submitted",
        description: "Your review has been submitted and is pending approval.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a review.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-64 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded" />
              </div>
              <div className="h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !tool) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
                <p className="text-lg">Tool not found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add tools to your favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }
    favoriteMutation.mutate("add");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
      return;
    }
    reviewMutation.mutate(reviewForm);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tool.name,
        text: tool.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Tool link has been copied to your clipboard.",
      });
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link href="/tools">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Tools
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                {tool.featuredImage ? (
                  <img
                    src={tool.featuredImage}
                    alt={tool.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/20 rounded-lg" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                  {tool.isVerified && (
                    <Check className="w-6 h-6 text-green-500" title="Verified" />
                  )}
                  {tool.isFeatured && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-500 mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(tool.overallScore || 4.5) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">
                      {tool.overallScore?.toFixed(1) || "4.5"}
                    </span>
                    <span className="text-gray-600 ml-2">
                      ({reviews?.length || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {tool.views || 0} views
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg mb-6">{tool.shortDescription}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="outline" className={getPricingColor(tool.pricingModel)}>
                    {tool.pricingModel}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColor(tool.difficultyLevel)}>
                    {tool.difficultyLevel}
                  </Badge>
                  {tool.category && (
                    <Badge variant="secondary">{tool.category.name}</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {tool.website && (
                    <Button asChild>
                      <a href={tool.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleFavorite}>
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Favorites
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Link href={`/compare?tools=${tool.id}`}>
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Compare
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {tool.longDescription || tool.shortDescription}
                    </p>
                  </CardContent>
                </Card>

                {tool.isPremiumListing && tool.extendedIntro && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Extended Introduction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{tool.extendedIntro}</p>
                    </CardContent>
                  </Card>
                )}

                {tool.targetAudience && tool.targetAudience.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Target Audience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.targetAudience.map((audience: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {audience}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {tool.integrations && tool.integrations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Integrations & Compatibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {tool.integrations.map((integration: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="features" className="space-y-6">
                {tool.keyFeatures && tool.keyFeatures.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tool.keyFeatures.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {tool.isPremiumListing && tool.pros && tool.cons && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">Pros</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tool.pros.map((pro: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <ThumbsUp className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-700">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Cons</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tool.cons.map((con: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <ThumbsDown className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-700">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {tool.isPremiumListing && tool.uniqueSellingProps && tool.uniqueSellingProps.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Unique Selling Propositions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.uniqueSellingProps.map((usp: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                            <span className="text-gray-700">{usp}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                {/* Review Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Select
                          value={reviewForm.rating.toString()}
                          onValueChange={(value) =>
                            setReviewForm({ ...reviewForm, rating: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                {"★".repeat(rating)} {rating} Star{rating !== 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="experience">How was your experience with the tool?</Label>
                        <Textarea
                          id="experience"
                          value={reviewForm.experience}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, experience: e.target.value })
                          }
                          placeholder="Share your experience..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="dislikes">What didn't you like about the tool?</Label>
                        <Textarea
                          id="dislikes"
                          value={reviewForm.dislikes}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, dislikes: e.target.value })
                          }
                          placeholder="What could be improved..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="improvements">What should be improved or added?</Label>
                        <Textarea
                          id="improvements"
                          value={reviewForm.improvements}
                          onChange={(e) =>
                            setReviewForm({ ...reviewForm, improvements: e.target.value })
                          }
                          placeholder="Suggestions for improvement..."
                        />
                      </div>
                      
                      <Button type="submit" disabled={reviewMutation.isPending}>
                        {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Anonymous User</p>
                                <div className="flex items-center">
                                  <div className="flex text-yellow-500 mr-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= review.rating ? "fill-current" : ""
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {review.experience && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Experience:</p>
                              <p className="text-gray-600">{review.experience}</p>
                            </div>
                          )}
                          
                          {review.dislikes && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Dislikes:</p>
                              <p className="text-gray-600">{review.dislikes}</p>
                            </div>
                          )}
                          
                          {review.improvements && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Improvements:</p>
                              <p className="text-gray-600">{review.improvements}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No reviews yet. Be the first to review this tool!</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="media" className="space-y-6">
                {tool.videos && tool.videos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Videos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.videos.map((video: string, index: number) => (
                          <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <Video className="w-12 h-12 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {tool.heroSnapshots && tool.heroSnapshots.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Screenshots</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.heroSnapshots.map((snapshot: string, index: number) => (
                          <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Tool Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Tool Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="outline">{tool.category?.name || "General"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pricing</span>
                  <Badge variant="outline" className={getPricingColor(tool.pricingModel)}>
                    {tool.pricingModel}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Difficulty</span>
                  <Badge variant="outline" className={getDifficultyColor(tool.difficultyLevel)}>
                    {tool.difficultyLevel}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{tool.views || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Added</span>
                  <span className="font-medium">
                    {new Date(tool.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Scores */}
            {tool.isPremiumListing && (
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Ease of Use", score: tool.easeOfUseScore },
                    { label: "Features", score: tool.featuresScore },
                    { label: "Support", score: tool.supportScore },
                    { label: "Pricing", score: tool.pricingScore },
                    { label: "Integration", score: tool.integrationScore },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-sm font-bold">
                          {item.score?.toFixed(1) || "N/A"}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${((item.score || 0) / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {tool.socialLinks && tool.socialLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tool.socialLinks.map((link: string, index: number) => (
                      <Button key={index} variant="outline" className="w-full justify-start" asChild>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Social Profile
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggested Alternatives */}
            {tool.suggestedAlternatives && tool.suggestedAlternatives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Alternatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tool.suggestedAlternatives.map((alt: string, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{alt}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
