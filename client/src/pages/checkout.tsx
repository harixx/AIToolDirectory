import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import {
  Crown,
  Check,
  Shield,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing Stripe public key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : Promise.resolve(null);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for upgrading to Premium!",
      });
      navigate("/dashboard");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <PaymentElement />
      </div>
      
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/pricing")}
          className="flex-1"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600">
        <Shield className="w-4 h-4 inline mr-1" />
        Your payment is secure and encrypted
      </div>
    </form>
  );
};

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your purchase.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    // Check if user is already premium
    if (user?.isPremium) {
      toast({
        title: "Already Premium",
        description: "You already have a premium account.",
      });
      navigate("/dashboard");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: 49 // $49 for premium listing
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Authentication Required",
            description: "Please log in to complete your purchase.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 1500);
          return;
        }
        
        toast({
          title: "Payment Setup Failed",
          description: "Unable to set up payment. Please try again later.",
          variant: "destructive",
        });
        navigate("/pricing");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [isAuthenticated, user, navigate, toast]);

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

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mr-4" />
              <p className="text-lg">Setting up payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const premiumFeatures = [
    "Verified badge and enhanced credibility",
    "Featured placement for 7 days",
    "Enhanced listing with unlimited features",
    "Video embeds and hero snapshots",
    "SEO optimization and Google indexing", 
    "Do-follow links for better rankings",
    "Evaluation scores and detailed analytics",
    "Priority customer support",
    "Pros & cons listing",
    "CEO introduction section",
  ];

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get maximum visibility for your AI tool with our premium listing features
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Crown className="w-8 h-8 text-yellow-500 mr-3" />
                    <div>
                      <h3 className="font-semibold">Premium Listing</h3>
                      <p className="text-sm text-gray-600">One-time payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$49</div>
                    <div className="text-sm text-gray-600">USD</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-800">Special Benefits</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 3x more visibility than free listings</li>
                    <li>• Priority review within 24 hours</li>
                    <li>• Lifetime premium features</li>
                    <li>• Money-back guarantee (7 days)</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>$49.00 USD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
              <p className="text-sm text-gray-600">
                Complete your purchase to unlock premium features
              </p>
            </CardHeader>
            <CardContent>
              {/* User Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Account Information</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {user?.firstName || "User"} {user?.lastName || ""}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Current Plan:</strong> <Badge variant="secondary">Free</Badge></p>
                </div>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              256-bit SSL encryption
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              Secure payment by Stripe
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Money-back guarantee
            </div>
          </div>
        </div>

        {/* Support */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about premium features or need assistance with your payment?
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate("/pricing")}>
                  View Pricing Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
