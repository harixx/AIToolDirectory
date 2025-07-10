import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Heart,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Crown,
  ExternalLink,
  Calendar,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: userTools, isLoading: toolsLoading } = useQuery({
    queryKey: ["/api/user/tools"],
    enabled: isAuthenticated,
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/user/favorites"],
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1500);
    }
  }, [isAuthenticated, toast]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
              <p className="text-lg">Authentication required</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const toolStats = {
    total: userTools?.length || 0,
    live: userTools?.filter((tool: any) => tool.status === "live").length || 0,
    pending: userTools?.filter((tool: any) => tool.status === "pending").length || 0,
    rejected: userTools?.filter((tool: any) => tool.status === "rejected").length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-6">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.firstName || "User"}!
                </h1>
                <p className="text-blue-100 mt-2 flex items-center">
                  {user?.isPremium && <Crown className="w-4 h-4 mr-1" />}
                  {user?.isPremium ? "Premium Member" : "Free Member"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{toolStats.total}</div>
                <div className="text-sm text-blue-100">Tools Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{favorites?.length || 0}</div>
                <div className="text-sm text-blue-100">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{toolStats.live}</div>
                <div className="text-sm text-blue-100">Live Tools</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">My Tools</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Tools</p>
                      <p className="text-2xl font-bold">{toolStats.total}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Live Tools</p>
                      <p className="text-2xl font-bold text-green-600">{toolStats.live}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{toolStats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Favorites</p>
                      <p className="text-2xl font-bold text-red-600">{favorites?.length || 0}</p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/submit-tool">
                    <Button className="w-full h-20 flex-col">
                      <Plus className="w-6 h-6 mb-2" />
                      Submit New Tool
                    </Button>
                  </Link>
                  <Link href="/tools">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Eye className="w-6 h-6 mb-2" />
                      Browse Tools
                    </Button>
                  </Link>
                  {!user?.isPremium && (
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full h-20 flex-col">
                        <Crown className="w-6 h-6 mb-2" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {toolsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3" />
                          <div>
                            <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                            <div className="w-24 h-3 bg-gray-200 rounded" />
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : userTools?.length > 0 ? (
                  <div className="space-y-4">
                    {userTools.slice(0, 5).map((tool: any) => (
                      <div key={tool.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                            {tool.featuredImage ? (
                              <img src={tool.featuredImage} alt={tool.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-6 h-6 bg-primary/20 rounded" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              {getStatusIcon(tool.status)}
                              <span className="ml-1 capitalize">{tool.status}</span>
                              <span className="mx-2">•</span>
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(tool.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(tool.status)}>
                            {tool.status}
                          </Badge>
                          <Link href={`/tools/${tool.slug}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No tools submitted yet</p>
                    <Link href="/submit-tool">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Your First Tool
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Tools</h2>
              <Link href="/submit-tool">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Tool
                </Button>
              </Link>
            </div>

            {toolsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3" />
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                          <div className="w-24 h-3 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="w-full h-16 bg-gray-200 rounded mb-4" />
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-6 bg-gray-200 rounded" />
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded" />
                          <div className="w-8 h-8 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userTools?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userTools.map((tool: any) => (
                  <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          {tool.featuredImage ? (
                            <img src={tool.featuredImage} alt={tool.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{tool.name}</h3>
                          <p className="text-sm text-gray-500">{tool.category?.name || "General"}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(tool.status)}
                          <Badge variant="outline" className={getStatusColor(tool.status)}>
                            {tool.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {tool.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {tool.views || 0}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {tool.overallScore?.toFixed(1) || "N/A"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(tool.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/tools/${tool.slug}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" disabled>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tools submitted yet</h3>
                    <p className="text-gray-600 mb-4">
                      Submit your first AI tool to start building your profile
                    </p>
                    <Link href="/submit-tool">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Your First Tool
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Favorites</h2>
              <Link href="/tools">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Tools
                </Button>
              </Link>
            </div>

            {favoritesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3" />
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                          <div className="w-24 h-3 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="w-full h-16 bg-gray-200 rounded mb-4" />
                      <div className="w-full h-8 bg-gray-200 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : favorites?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite: any) => (
                  <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          {favorite.tool?.featuredImage ? (
                            <img src={favorite.tool.featuredImage} alt={favorite.tool.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{favorite.tool?.name || "Unknown Tool"}</h3>
                          <p className="text-sm text-gray-500">{favorite.tool?.category?.name || "General"}</p>
                        </div>
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      </div>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {favorite.tool?.shortDescription || "No description available"}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {favorite.tool?.overallScore?.toFixed(1) || "N/A"}
                          </div>
                          <Badge variant="outline">
                            {favorite.tool?.pricingModel || "Unknown"}
                          </Badge>
                        </div>
                      </div>
                      
                      <Link href={`/tools/${favorite.tool?.slug || "#"}`}>
                        <Button className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Tool
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start exploring AI tools and add your favorites here
                    </p>
                    <Link href="/tools">
                      <Button>
                        <Eye className="w-4 h-4 mr-2" />
                        Browse Tools
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Account Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-xl">
                          {user?.firstName?.[0] || user?.email?.[0] || "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user?.firstName || "User"} {user?.lastName || ""}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Account Type</span>
                    <Badge variant={user?.isPremium ? "default" : "secondary"}>
                      {user?.isPremium ? "Premium" : "Free"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Member Since</span>
                    <span className="text-sm text-gray-500">
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!user?.isPremium && (
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <Crown className="w-5 h-5 text-yellow-600 mr-2" />
                        <h4 className="font-medium text-yellow-800">Upgrade to Premium</h4>
                      </div>
                      <p className="text-sm text-yellow-700 mb-3">
                        Unlock enhanced features, verified badges, and priority support
                      </p>
                      <Link href="/pricing">
                        <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          Upgrade Now
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      Activity Log
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = "/api/logout"}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
