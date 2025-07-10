import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { insertToolSchema, insertReviewSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

// Initialize Stripe if keys are available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (now includes auth routes)
  setupAuth(app);

  // Initialize default categories
  await initializeDefaultCategories();

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/categories/:slug', async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Tool routes
  app.get('/api/tools', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        pricingModel: req.query.pricingModel as string,
        difficultyLevel: req.query.difficultyLevel as string,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        limit: parseInt(req.query.limit as string) || 20,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const result = await storage.getTools(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  app.get('/api/tools/featured', async (req, res) => {
    try {
      const tools = await storage.getFeaturedTools();
      res.json(tools);
    } catch (error) {
      console.error("Error fetching featured tools:", error);
      res.status(500).json({ message: "Failed to fetch featured tools" });
    }
  });

  app.get('/api/tools/:slug', async (req, res) => {
    try {
      const tool = await storage.getToolBySlug(req.params.slug);
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      
      // Increment view count
      await storage.incrementToolViews(tool.id);
      
      res.json(tool);
    } catch (error) {
      console.error("Error fetching tool:", error);
      res.status(500).json({ message: "Failed to fetch tool" });
    }
  });

  app.post('/api/tools', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Validate the tool data
      const toolData = insertToolSchema.parse({
        ...req.body,
        submittedBy: userId,
        status: "pending",
        isPremiumListing: user.isPremium || false,
        isVerified: user.isPremium || false,
      });

      const tool = await storage.createTool(toolData);
      res.json(tool);
    } catch (error) {
      console.error("Error creating tool:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tool data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tool" });
    }
  });

  app.get('/api/user/tools', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const tools = await storage.getToolsByUser(userId);
      res.json(tools);
    } catch (error) {
      console.error("Error fetching user tools:", error);
      res.status(500).json({ message: "Failed to fetch user tools" });
    }
  });

  // Review routes
  app.get('/api/tools/:toolId/reviews', async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const reviews = await storage.getReviewsByTool(toolId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/tools/:toolId/reviews', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const toolId = parseInt(req.params.toolId);

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        toolId,
        userId,
        isApproved: false, // Reviews need admin approval
      });

      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Favorite routes
  app.get('/api/user/favorites', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/user/favorites', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { toolId } = req.body;

      const favorite = await storage.addToFavorites(userId, toolId);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete('/api/user/favorites/:toolId', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const toolId = parseInt(req.params.toolId);

      await storage.removeFromFavorites(userId, toolId);
      res.json({ message: "Removed from favorites" });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  // Comparison routes
  app.post('/api/tools/compare', async (req, res) => {
    try {
      const { toolIds } = req.body;
      
      if (!Array.isArray(toolIds) || toolIds.length === 0 || toolIds.length > 3) {
        return res.status(400).json({ message: "Please provide 1-3 tool IDs for comparison" });
      }

      const tools = await storage.getToolsForComparison(toolIds);
      res.json(tools);
    } catch (error) {
      console.error("Error comparing tools:", error);
      res.status(500).json({ message: "Failed to compare tools" });
    }
  });

  // Stripe payment routes
  if (stripe) {
    app.post('/api/create-payment-intent', async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe!.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    });

    app.post('/api/get-or-create-subscription', requireAuth, async (req: any, res) => {
      try {
        const userId = req.user.id;
        let user = await storage.getUser(userId);

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        if (user.stripeSubscriptionId) {
          const subscription = await stripe!.subscriptions.retrieve(user.stripeSubscriptionId);
          const invoice = await stripe!.invoices.retrieve(subscription.latest_invoice as string);
          
          res.json({
            subscriptionId: subscription.id,
            clientSecret: (invoice.payment_intent as any)?.client_secret,
          });
          return;
        }

        if (!user.email) {
          return res.status(400).json({ message: "User email is required" });
        }

        const customer = await stripe!.customers.create({
          email: user.email,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        });

        const subscription = await stripe!.subscriptions.create({
          customer: customer.id,
          items: [{
            price: process.env.STRIPE_PRICE_ID || "price_1234567890", // Default price ID
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

        const invoice = subscription.latest_invoice as any;
        res.json({
          subscriptionId: subscription.id,
          clientSecret: invoice.payment_intent?.client_secret,
        });
      } catch (error: any) {
        console.error("Stripe subscription error:", error);
        res.status(400).json({ error: { message: error.message } });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize default categories
async function initializeDefaultCategories() {
  try {
    const existingCategories = await storage.getCategories();
    
    if (existingCategories.length === 0) {
      const defaultCategories = [
        {
          name: "AI Video Tools",
          slug: "ai-video-tools",
          description: "AI-powered video editing, generation, and processing tools",
          icon: "fas fa-video",
          color: "purple",
        },
        {
          name: "AI Image Tools",
          slug: "ai-image-tools",
          description: "AI image generation, editing, and enhancement tools",
          icon: "fas fa-image",
          color: "green",
        },
        {
          name: "AI Code Tools",
          slug: "ai-code-tools",
          description: "AI-powered coding assistants and development tools",
          icon: "fas fa-code",
          color: "blue",
        },
      ];

      for (const category of defaultCategories) {
        await storage.createCategory(category);
      }
      
      console.log("Default categories initialized");
    }
  } catch (error) {
    console.error("Error initializing default categories:", error);
  }
}
