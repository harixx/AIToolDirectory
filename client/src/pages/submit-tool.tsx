import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Plus, 
  Minus, 
  Crown, 
  Check, 
  AlertCircle, 
  Video, 
  Image, 
  Link as LinkIcon,
  Star,
  Info
} from "lucide-react";

const baseToolSchema = z.object({
  name: z.string().min(1, "Tool name is required").max(200, "Name is too long"),
  shortDescription: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  longDescription: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  featuredImage: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  pricingModel: z.enum(["Free", "Freemium", "Paid", "Custom"]),
  difficultyLevel: z.enum(["Beginner", "Intermediate", "Expert"]),
  categoryId: z.string().min(1, "Please select a category"),
  keyFeatures: z.array(z.string()).min(1, "At least one key feature is required").max(6, "Maximum 6 features allowed"),
  targetAudience: z.array(z.string()).max(5, "Maximum 5 target audiences allowed"),
  integrations: z.array(z.string()).max(5, "Maximum 5 integrations allowed"),
  socialLinks: z.array(z.string()).max(5, "Maximum 5 social links allowed"),
  videos: z.array(z.string()).max(3, "Maximum 3 videos allowed"),
});

const premiumToolSchema = baseToolSchema.extend({
  extendedIntro: z.string().max(120, "Extended intro must be 120 words or less").optional(),
  heroSnapshots: z.array(z.string()).max(5, "Maximum 5 hero snapshots allowed"),
  industryVerticals: z.array(z.string()).max(5, "Maximum 5 industry verticals allowed"),
  uniqueSellingProps: z.array(z.string()).max(5, "Maximum 5 USPs allowed"),
  ceoIntro: z.string().optional(),
  ceoLinkedIn: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  pros: z.array(z.string()).max(10, "Maximum 10 pros allowed"),
  cons: z.array(z.string()).max(10, "Maximum 10 cons allowed"),
  suggestedAlternatives: z.array(z.string()).max(5, "Maximum 5 alternatives allowed"),
  embeddedVideoReviews: z.array(z.string()).max(3, "Maximum 3 video reviews allowed"),
  easeOfUseScore: z.number().min(1).max(10).optional(),
  featuresScore: z.number().min(1).max(10).optional(),
  supportScore: z.number().min(1).max(10).optional(),
  pricingScore: z.number().min(1).max(10).optional(),
  integrationScore: z.number().min(1).max(10).optional(),
});

export default function SubmitTool() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPremiumSubmission, setIsPremiumSubmission] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const schema = isPremiumSubmission || user?.isPremium ? premiumToolSchema : baseToolSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      website: "",
      featuredImage: "",
      pricingModel: "Free",
      difficultyLevel: "Beginner",
      categoryId: "",
      keyFeatures: [""],
      targetAudience: [],
      integrations: [],
      socialLinks: [],
      videos: [],
      ...(isPremiumSubmission || user?.isPremium ? {
        extendedIntro: "",
        heroSnapshots: [],
        industryVerticals: [],
        uniqueSellingProps: [],
        ceoIntro: "",
        ceoLinkedIn: "",
        pros: [],
        cons: [],
        suggestedAlternatives: [],
        embeddedVideoReviews: [],
        easeOfUseScore: 5,
        featuresScore: 5,
        supportScore: 5,
        pricingScore: 5,
        integrationScore: 5,
      } : {}),
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (toolData: z.infer<typeof schema>) => {
      return apiRequest("POST", "/api/tools", {
        ...toolData,
        categoryId: parseInt(toolData.categoryId),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/tools"] });
      toast({
        title: "Tool submitted successfully",
        description: "Your tool has been submitted for review. You'll be notified when it's approved.",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a tool.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }
      toast({
        title: "Submission failed",
        description: "Failed to submit tool. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a tool.",
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

  const addArrayField = (fieldName: string, currentArray: string[]) => {
    const maxLengths: { [key: string]: number } = {
      keyFeatures: 6,
      targetAudience: 5,
      integrations: 5,
      socialLinks: 5,
      videos: 3,
      heroSnapshots: 5,
      industryVerticals: 5,
      uniqueSellingProps: 5,
      pros: 10,
      cons: 10,
      suggestedAlternatives: 5,
      embeddedVideoReviews: 3,
    };

    if (currentArray.length < maxLengths[fieldName]) {
      form.setValue(fieldName as any, [...currentArray, ""]);
    }
  };

  const removeArrayField = (fieldName: string, currentArray: string[], index: number) => {
    const newArray = currentArray.filter((_, i) => i !== index);
    form.setValue(fieldName as any, newArray);
  };

  const updateArrayField = (fieldName: string, currentArray: string[], index: number, value: string) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    form.setValue(fieldName as any, newArray);
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    // Filter out empty strings from arrays
    const cleanData = {
      ...data,
      keyFeatures: data.keyFeatures.filter(Boolean),
      targetAudience: data.targetAudience.filter(Boolean),
      integrations: data.integrations.filter(Boolean),
      socialLinks: data.socialLinks.filter(Boolean),
      videos: data.videos.filter(Boolean),
      ...(isPremiumSubmission || user?.isPremium ? {
        heroSnapshots: (data as any).heroSnapshots.filter(Boolean),
        industryVerticals: (data as any).industryVerticals.filter(Boolean),
        uniqueSellingProps: (data as any).uniqueSellingProps.filter(Boolean),
        pros: (data as any).pros.filter(Boolean),
        cons: (data as any).cons.filter(Boolean),
        suggestedAlternatives: (data as any).suggestedAlternatives.filter(Boolean),
        embeddedVideoReviews: (data as any).embeddedVideoReviews.filter(Boolean),
      } : {}),
    };

    submitMutation.mutate(cleanData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit Your AI Tool</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your AI tool with our community. Choose between free and premium listing options.
          </p>
        </div>

        {/* Pricing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className={`cursor-pointer transition-all ${!isPremiumSubmission ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Free Listing</span>
                <Badge variant="secondary">$0</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Basic tool information
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Up to 6 key features
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Target audience & integrations
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Social links & videos
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${isPremiumSubmission ? 'ring-2 ring-primary' : ''} ${!user?.isPremium ? 'opacity-75' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                  Premium Listing
                </span>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">$49</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  All free features
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Enhanced descriptions & media
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Evaluation scores & analytics
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Verified badge & featured placement
                </li>
              </ul>
              {!user?.isPremium && (
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tool Information</CardTitle>
            <p className="text-sm text-gray-600">
              {isPremiumSubmission || user?.isPremium ? "Premium" : "Free"} listing - Fill out the form below
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tool Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tool name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your tool (10-500 characters)"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Long Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of your tool"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Categorization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Categorization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category: any) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricingModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing Model *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Free">Free</SelectItem>
                              <SelectItem value="Freemium">Freemium</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficultyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Key Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Key Features *</h3>
                    <Badge variant="outline">
                      {form.watch("keyFeatures").filter(Boolean).length}/6
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {form.watch("keyFeatures").map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Key feature ${index + 1}`}
                          value={feature}
                          onChange={(e) => updateArrayField("keyFeatures", form.watch("keyFeatures"), index, e.target.value)}
                        />
                        {form.watch("keyFeatures").length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayField("keyFeatures", form.watch("keyFeatures"), index)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {form.watch("keyFeatures").length < 6 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayField("keyFeatures", form.watch("keyFeatures"))}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Target Audience */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Target Audience</h3>
                    <Badge variant="outline">
                      {form.watch("targetAudience").filter(Boolean).length}/5
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {form.watch("targetAudience").map((audience, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Target audience ${index + 1}`}
                          value={audience}
                          onChange={(e) => updateArrayField("targetAudience", form.watch("targetAudience"), index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField("targetAudience", form.watch("targetAudience"), index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {form.watch("targetAudience").length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayField("targetAudience", form.watch("targetAudience"))}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Audience
                      </Button>
                    )}
                  </div>
                </div>

                {/* Premium Features */}
                {(isPremiumSubmission || user?.isPremium) && (
                  <>
                    <Separator />
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold">Premium Features</h3>
                      </div>

                      {/* Extended Introduction */}
                      <FormField
                        control={form.control}
                        name="extendedIntro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Extended Introduction (120 words max)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Extended introduction for premium listing"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Evaluation Scores */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Evaluation Scores (1-10)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: "easeOfUseScore", label: "Ease of Use" },
                            { name: "featuresScore", label: "Features" },
                            { name: "supportScore", label: "Support" },
                            { name: "pricingScore", label: "Pricing" },
                            { name: "integrationScore", label: "Integration" },
                          ].map((score) => (
                            <FormField
                              key={score.name}
                              control={form.control}
                              name={score.name as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{score.label}</FormLabel>
                                  <FormControl>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="1"
                                        max="10"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                      />
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                              star <= Math.floor((field.value || 0) / 2) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Pros and Cons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-green-600">Pros</h4>
                            <Badge variant="outline">
                              {form.watch("pros")?.filter(Boolean).length || 0}/10
                            </Badge>
                          </div>
                          {form.watch("pros")?.map((pro, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder={`Pro ${index + 1}`}
                                value={pro}
                                onChange={(e) => updateArrayField("pros", form.watch("pros") || [], index, e.target.value)}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayField("pros", form.watch("pros") || [], index)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          {(form.watch("pros")?.length || 0) < 10 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayField("pros", form.watch("pros") || [])}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Pro
                            </Button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-red-600">Cons</h4>
                            <Badge variant="outline">
                              {form.watch("cons")?.filter(Boolean).length || 0}/10
                            </Badge>
                          </div>
                          {form.watch("cons")?.map((con, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder={`Con ${index + 1}`}
                                value={con}
                                onChange={(e) => updateArrayField("cons", form.watch("cons") || [], index, e.target.value)}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayField("cons", form.watch("cons") || [], index)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          {(form.watch("cons")?.length || 0) < 10 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayField("cons", form.watch("cons") || [])}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Con
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="min-w-[200px]"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Tool"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
