
export const marketingCopy = {
  // Homepage hero variations
  heroSections: [
    {
      name: "problem-agitate-solution",
      headline: "Stop Wasting Time on Wrong AI Tools",
      subheadline: "Join 25,000+ smart professionals who use our curated directory to find the perfect AI tool for their needs—without the guesswork, endless research, or expensive mistakes.",
      cta: "Find Your Perfect AI Tool Now"
    },
    {
      name: "benefit-focused",
      headline: "Discover AI Tools That Actually Work",
      subheadline: "Skip the trial-and-error. Get instant access to battle-tested AI tools that have helped thousands save 10+ hours per week and boost productivity by 40%.",
      cta: "Start Saving Time Today"
    },
    {
      name: "social-proof",
      headline: "The AI Directory 25,000+ Professionals Trust",
      subheadline: "From Fortune 500 companies to solo entrepreneurs—discover why thousands choose our platform to find their perfect AI tools.",
      cta: "Join the Community"
    }
  ],

  // Feature highlights with benefits
  featureHighlights: [
    {
      title: "Verified Reviews Save You Hours",
      description: "Stop reading fake reviews. Our verified user reviews help you make confident decisions in minutes, not hours.",
      icon: "shield-check"
    },
    {
      title: "Side-by-Side Comparisons",
      description: "Compare features, pricing, and user ratings instantly. No more switching between 20+ browser tabs.",
      icon: "compare"
    },
    {
      title: "Instant Notifications",
      description: "Be the first to know when new tools launch in your category. Never miss the next game-changing AI tool.",
      icon: "bell"
    }
  ],

  // Testimonials with social proof
  testimonials: [
    {
      name: "Sarah Chen",
      role: "AI Product Manager",
      company: "TechFlow",
      content: "Found the perfect AI tool for our team in 15 minutes. The detailed reviews and comparisons saved us weeks of research and $10k in failed trials.",
      rating: 5,
      results: "847 new signups in first month"
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder",
      company: "CodeAI",
      content: "Being featured in their directory brought us our first enterprise customers. The ROI was immediate and massive.",
      rating: 5,
      results: "300% increase in visibility"
    },
    {
      name: "Lisa Wang",
      role: "Marketing Director",
      company: "VisionAI",
      content: "The verification badge and premium listing features significantly boosted our credibility. Worth every penny.",
      rating: 5,
      results: "40% more qualified leads"
    }
  ],

  // Onboarding flow copy
  onboardingFlow: {
    welcome: {
      headline: "Welcome to Your AI Discovery Journey",
      description: "Let's find the perfect AI tools for your specific needs. This will take less than 2 minutes.",
      cta: "Get Started"
    },
    step1: {
      headline: "What's Your Primary Goal?",
      description: "Help us recommend the most relevant AI tools for your workflow.",
      options: [
        "Boost productivity and save time",
        "Automate repetitive tasks",
        "Generate content and creative assets",
        "Analyze data and gain insights",
        "Improve customer support",
        "Other"
      ]
    },
    step2: {
      headline: "What's Your Experience Level?",
      description: "We'll match you with tools that fit your technical expertise.",
      options: [
        "Beginner - I'm new to AI tools",
        "Intermediate - I've used a few AI tools",
        "Advanced - I'm experienced with AI"
      ]
    },
    completion: {
      headline: "Perfect! Here Are Your Personalized Recommendations",
      description: "Based on your preferences, we've curated the best AI tools for you.",
      cta: "Explore My Recommendations"
    }
  },

  // Email sequences
  emailSequences: {
    welcome: {
      subject: "Welcome! Your AI tool discovery starts here 🚀",
      preview: "3 personalized tool recommendations inside...",
      headline: "Welcome to the AI Directory Community!",
      body: "You've just joined 25,000+ professionals who are transforming their work with AI. Here are 3 tools our community loves most...",
      cta: "Explore Your Recommendations"
    },
    abandoned_comparison: {
      subject: "Forgot something? Your tool comparison is waiting",
      preview: "Compare these AI tools in 2 minutes...",
      headline: "Still Deciding Between These Tools?",
      body: "We noticed you were comparing some AI tools. Here's what other users chose and why...",
      cta: "Complete Your Comparison"
    },
    weekly_digest: {
      subject: "5 new AI tools that caught our attention this week",
      preview: "Including one that's getting 10x more signups...",
      headline: "This Week's AI Tool Discoveries",
      body: "Our community discovered some amazing new AI tools this week. Here are the standouts...",
      cta: "See All New Tools"
    }
  },

  // Pricing page copy
  pricingPage: {
    headline: "Get Found by Your Ideal Customers",
    subheadline: "Choose the plan that fits your goals. Join thousands of AI companies already growing with us.",
    freeFeatures: [
      "Reach 25,000+ monthly visitors",
      "Showcase your best features",
      "Build credibility with reviews",
      "Direct traffic to your site",
      "Join our AI community"
    ],
    premiumFeatures: [
      "Everything in Free +",
      "Verified badge builds trust",
      "Featured placement (30 days)",
      "Rich media showcases",
      "Google-optimized for search",
      "VIP support & optimization"
    ],
    guarantee: "30-Day Money-Back Guarantee",
    urgency: "Limited time: Only 23 premium spots left this month"
  },

  // Objection handling
  objectionHandling: {
    price: {
      objection: "Is it worth the investment?",
      response: "Our premium users see an average 300% increase in visibility and 40% more qualified leads. At $49 one-time, that's less than most companies spend on a single Google ad."
    },
    effectiveness: {
      objection: "Will this actually bring customers?",
      response: "Our directory gets 25,000+ monthly visitors actively searching for AI tools. In the past month alone, our listings generated over 15,000 clicks to partner websites."
    },
    competition: {
      objection: "There are other directories out there",
      response: "True, but none focus exclusively on AI tools with our level of verification and user engagement. We're the #1 destination for AI tool discovery."
    }
  },

  // Call-to-action variations
  ctaVariations: {
    primary: [
      "Find Your Perfect AI Tool Now",
      "Start Saving Time Today",
      "Get 10x More Customers Now",
      "Join 25,000+ Smart Professionals"
    ],
    secondary: [
      "Explore All Tools",
      "Compare Top Picks",
      "See Success Stories",
      "Start Free Trial"
    ],
    urgency: [
      "Limited Time - Get Featured Free",
      "Only 23 Spots Left This Month",
      "Join Before Price Increase",
      "Get Early Access Now"
    ]
  }
};

// Utility functions for dynamic copy
export const getDynamicCopy = (userContext: any) => {
  // Personalization logic based on user behavior, industry, etc.
  return {
    personalizedHeadline: `Find AI Tools Perfect for ${userContext.industry}`,
    personalizedSubheadline: `Join ${userContext.peerCount}+ ${userContext.industry} professionals who trust our directory`,
    personalizedCTA: `Discover ${userContext.industry} AI Tools`
  };
};
