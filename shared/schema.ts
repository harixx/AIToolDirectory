import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - updated for email/password auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // For email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tools table
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  shortDescription: text("short_description").notNull(),
  longDescription: text("long_description"),
  website: varchar("website", { length: 500 }),
  featuredImage: varchar("featured_image", { length: 500 }),
  
  // Pricing and categorization
  pricingModel: varchar("pricing_model", { length: 50 }).notNull(), // Free, Freemium, Paid, Custom
  difficultyLevel: varchar("difficulty_level", { length: 50 }).notNull(), // Beginner, Intermediate, Expert
  categoryId: integer("category_id").references(() => categories.id),
  
  // Features and content
  keyFeatures: text("key_features").array(),
  targetAudience: text("target_audience").array(),
  integrations: text("integrations").array(),
  socialLinks: text("social_links").array(),
  videos: text("videos").array(),
  
  // Premium features
  heroSnapshots: text("hero_snapshots").array(),
  extendedIntro: text("extended_intro"),
  industryVerticals: text("industry_verticals").array(),
  uniqueSellingProps: text("unique_selling_props").array(),
  ceoIntro: text("ceo_intro"),
  ceoLinkedIn: varchar("ceo_linkedin", { length: 500 }),
  faqs: jsonb("faqs"), // Array of {question, answer} objects
  pros: text("pros").array(),
  cons: text("cons").array(),
  suggestedAlternatives: text("suggested_alternatives").array(),
  embeddedVideoReviews: text("embedded_video_reviews").array(),
  pricingTiers: jsonb("pricing_tiers"), // Structured pricing data
  
  // Evaluation scores
  easeOfUseScore: real("ease_of_use_score"),
  featuresScore: real("features_score"),
  supportScore: real("support_score"),
  pricingScore: real("pricing_score"),
  integrationScore: real("integration_score"),
  overallScore: real("overall_score"),
  
  // Status and metadata
  status: varchar("status", { length: 50 }).default("pending"), // pending, live, rejected
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  isPremiumListing: boolean("is_premium_listing").default(false),
  submittedBy: varchar("submitted_by").references(() => users.id),
  views: integer("views").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").references(() => tools.id),
  userId: varchar("user_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  experience: text("experience"),
  dislikes: text("dislikes"),
  improvements: text("improvements"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User favorites table
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  toolId: integer("tool_id").references(() => tools.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tool comparisons table
export const toolComparisons = pgTable("tool_comparisons", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  toolIds: integer("tool_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tools: many(tools),
  reviews: many(reviews),
  favorites: many(userFavorites),
  comparisons: many(toolComparisons),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tools: many(tools),
}));

export const toolsRelations = relations(tools, ({ one, many }) => ({
  category: one(categories, {
    fields: [tools.categoryId],
    references: [categories.id],
  }),
  submitter: one(users, {
    fields: [tools.submittedBy],
    references: [users.id],
  }),
  reviews: many(reviews),
  favorites: many(userFavorites),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  tool: one(tools, {
    fields: [reviews.toolId],
    references: [tools.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [userFavorites.toolId],
    references: [tools.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const upsertUserSchema = insertUserSchema.omit({ createdAt: true, updatedAt: true });

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const insertToolSchema = createInsertSchema(tools);
export const selectToolSchema = createSelectSchema(tools);

export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);

export const insertFavoriteSchema = createInsertSchema(userFavorites);
export const selectFavoriteSchema = createSelectSchema(userFavorites);

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = z.infer<typeof selectCategorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tool = z.infer<typeof selectToolSchema>;
export type InsertTool = z.infer<typeof insertToolSchema>;

export type Review = z.infer<typeof selectReviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type UserFavorite = z.infer<typeof selectFavoriteSchema>;
export type InsertUserFavorite = z.infer<typeof insertFavoriteSchema>;
