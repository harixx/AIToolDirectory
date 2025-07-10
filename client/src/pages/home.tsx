import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus, Heart, Settings, Star, Eye } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  
  const { data: userTools } = useQuery({
    queryKey: ["/api/user/tools"],
  });

  const { data: favorites } = useQuery({
    queryKey: ["/api/user/favorites"],
  });

  const { data: featuredTools } = useQuery({
    queryKey: ["/api/tools/featured"],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Welcome Section */}
      <section className="gradient-primary text-white py-12">
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
                <p className="text-blue-100 mt-2">
                  {user?.isPremium ? "Premium Member" : "Free Member"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userTools?.length || 0}</div>
                <div className="text-sm text-blue-100">Tools Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{favorites?.length || 0}</div>
                <div className="text-sm text-blue-100">Favorites</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Settings className="w-6 h-6 mb-2" />
                      Manage Tools
                    </Button>
                  </Link>
                  <Link href="/tools">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Eye className="w-6 h-6 mb-2" />
                      Browse Tools
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTools?.slice(0, 3).map((tool: any) => (
                    <div key={tool.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          <div className="w-6 h-6 bg-primary/20 rounded" />
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-sm text-gray-500">
                            Status: <Badge variant={tool.status === 'live' ? 'default' : 'secondary'}>
                              {tool.status}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <Link href={`/tools/${tool.slug}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {!userTools?.length && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No tools submitted yet</p>
                      <Link href="/submit-tool">
                        <Button className="mt-4">
                          Submit Your First Tool
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredTools?.slice(0, 4).map((tool: any) => (
                    <div key={tool.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-primary/10 rounded mr-3">
                          {tool.featuredImage ? (
                            <img src={tool.featuredImage} alt={tool.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{tool.name}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {tool.overallScore?.toFixed(1) || "4.5"}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tool.shortDescription}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{tool.pricingModel}</Badge>
                        <Link href={`/tools/${tool.slug}`}>
                          <Button size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Plan</span>
                    <Badge variant={user?.isPremium ? "default" : "secondary"}>
                      {user?.isPremium ? "Premium" : "Free"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tools Submitted</span>
                    <span className="font-medium">{userTools?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Favorites</span>
                    <span className="font-medium">{favorites?.length || 0}</span>
                  </div>
                  {!user?.isPremium && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-3">
                        Upgrade to Premium for enhanced features
                      </p>
                      <Link href="/pricing">
                        <Button className="w-full">
                          Upgrade Now
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Favorites */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {favorites?.slice(0, 5).map((favorite: any) => (
                    <div key={favorite.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm">{favorite.tool?.name || "Tool"}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  ))}
                  {!favorites?.length && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No favorites yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
