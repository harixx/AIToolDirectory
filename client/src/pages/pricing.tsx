import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Check,
  Crown,
  Star,
  Zap,
  Shield,
  Headphones,
  TrendingUp,
  Users,
  Sparkles,
  Award,
  Clock,
  Search,
} from "lucide-react";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();

  const features = {
    free: [
      "Submit unlimited tools",
      "Basic tool listing",
      "Up to 6 key features",
      "Target audience & integrations",
      "Social links & videos",
      "Community reviews",
      "Basic search & filtering",
      "User dashboard",
    ],
    premium: [
      "All free features",
      "Enhanced listing fields",
      "Verified badge",
      "Featured placement (7 days)",
      "Extended descriptions",
      "Video embeds (up to 3)",
      "Hero snapshots (up to 5)",
      "SEO optimization",
      "Do-follow links",
      "Google indexing",
      "Evaluation scores",
      "Pros & cons listing",
      "CEO introduction",
      "Industry verticals",
      "Priority support",
      "Analytics dashboard",
    ],
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Product Manager",
      company: "TechFlow",
      content: "The premium listing helped us get 300% more visibility for our AI tool. Worth every penny!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder",
      company: "CodeAI",
      content: "Being featured in the directory brought us our first enterprise customers. Game changer!",
      rating: 5,
    },
    {
      name: "Lisa Wang",
      role: "Marketing Director",
      company: "VisionAI",
      content: "The verification badge and enhanced listing features significantly boosted our credibility.",
      rating: 5,
    },
  ];

  const handleGetStarted = (plan: string) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }

    if (plan === "premium") {
      window.location.href = "/checkout";
    } else {
      window.location.href = "/submit-tool";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Get your AI tool discovered by thousands of users. Start free or go premium for maximum visibility.
            </p>
            <div className="flex justify-center items-center space-x-8 text-blue-100">
              <div className="text-center">
                <div className="text-3xl font-bold">25K+</div>
                <div className="text-sm">Monthly Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Listed Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">12K+</div>
                <div className="text-sm">User Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Free Listing</CardTitle>
                <div className="text-4xl font-bold mb-2">$0</div>
                <p className="text-gray-600">Perfect for getting started</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {features.free.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleGetStarted("free")}
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative border-primary border-2 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                  Premium Listing
                </CardTitle>
                <div className="text-4xl font-bold mb-2">$49</div>
                <p className="text-gray-600">One-time payment for enhanced visibility</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {features.premium.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleGetStarted("premium")}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  size="lg"
                >
                  {user?.isPremium ? "Already Premium" : "Get Premium"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Premium?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium listings get significantly more visibility and engagement from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3x More Visibility</h3>
              <p className="text-gray-600">
                Premium listings appear at the top of search results and get featured placement
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Badge</h3>
              <p className="text-gray-600">
                Build trust with users through our verification system and enhanced credibility
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">SEO Optimized</h3>
              <p className="text-gray-600">
                Get indexed on Google with do-follow links and enhanced SEO features
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
            <p className="text-gray-600">See what's included in each plan</p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">Feature</th>
                      <th className="text-center py-4 px-6 font-semibold">Free</th>
                      <th className="text-center py-4 px-6 font-semibold">
                        <div className="flex items-center justify-center">
                          <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                          Premium
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Tool Submissions", free: "Unlimited", premium: "Unlimited" },
                      { feature: "Key Features", free: "Up to 6", premium: "Unlimited" },
                      { feature: "Media Uploads", free: "Basic", premium: "Enhanced + Videos" },
                      { feature: "Verified Badge", free: false, premium: true },
                      { feature: "Featured Placement", free: false, premium: "7 days" },
                      { feature: "SEO Optimization", free: false, premium: true },
                      { feature: "Google Indexing", free: false, premium: true },
                      { feature: "Do-Follow Links", free: false, premium: true },
                      { feature: "Evaluation Scores", free: false, premium: true },
                      { feature: "Priority Support", free: false, premium: true },
                    ].map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-6 font-medium">{row.feature}</td>
                        <td className="py-4 px-6 text-center">
                          {typeof row.free === 'boolean' ? (
                            row.free ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )
                          ) : (
                            <span className="text-gray-700">{row.free}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof row.premium === 'boolean' ? (
                            row.premium ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )
                          ) : (
                            <span className="text-gray-700">{row.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600">Hear from successful AI tool creators who upgraded to premium</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How long does the premium listing last?",
                answer: "Premium listings are permanent! You pay once and your enhanced listing stays active forever. The featured placement lasts for 7 days after approval."
              },
              {
                question: "What's the difference between free and premium listings?",
                answer: "Premium listings include verification badges, featured placement, enhanced SEO, more media options, evaluation scores, and priority support. Free listings include basic information and standard visibility."
              },
              {
                question: "How quickly will my tool be approved?",
                answer: "Premium listings are reviewed within 24 hours, while free listings may take up to 3-5 business days for approval."
              },
              {
                question: "Can I upgrade from free to premium later?",
                answer: "Yes! You can upgrade your existing free listing to premium at any time by purchasing the premium package."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 7-day money-back guarantee if you're not satisfied with your premium listing. Contact our support team for assistance."
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of AI tool creators who have successfully promoted their tools on our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => handleGetStarted("free")}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Start Free
            </Button>
            <Button
              onClick={() => handleGetStarted("premium")}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              <Crown className="w-5 h-5 mr-2" />
              Go Premium
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
