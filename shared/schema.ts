import {
  sqliteTable,
  text,
  integer,
  real,
  blob,
  index,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - required for Replit Auth
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: integer("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - updated for email/password auth
export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").unique().notNull(),
  password: text("password"), // For email/password auth
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isPremium: integer("is_premium", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Categories table
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tools table
export const tools = sqliteTable("tools", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  longDescription: text("long_description"),
  website: text("website"),
  featuredImage: text("featured_image"),
  
  // Pricing and categorization
  pricingModel: text("pricing_model").notNull(), // Free, Freemium, Paid, Custom
  difficultyLevel: text("difficulty_level").notNull(), // Beginner, Intermediate, Expert
  categoryId: integer("category_id").references(() => categories.id),
  
  // Features and content - stored as JSON strings in SQLite
  keyFeatures: text("key_features"),
  targetAudience: text("target_audience"),
  integrations: text("integrations"),
  socialLinks: text("social_links"),
  videos: text("videos"),
  
  // Premium features
  heroSnapshots: text("hero_snapshots"),
  extendedIntro: text("extended_intro"),
  industryVerticals: text("industry_verticals"),
  uniqueSellingProps: text("unique_selling_props"),
  ceoIntro: text("ceo_intro"),
  ceoLinkedIn: text("ceo_linkedin"),
  faqs: text("faqs"), // JSON string of {question, answer} objects
  pros: text("pros"),
  cons: text("cons"),
  suggestedAlternatives: text("suggested_alternatives"),
  embeddedVideoReviews: text("embedded_video_reviews"),
  pricingTiers: text("pricing_tiers"), // JSON string of structured pricing data
  
  // Evaluation scores
  easeOfUseScore: real("ease_of_use_score"),
  featuresScore: real("features_score"),
  supportScore: real("support_score"),
  pricingScore: real("pricing_score"),
  integrationScore: real("integration_score"),
  overallScore: real("overall_score"),
  
  // Status and metadata
  status: text("status").default("pending"), // pending, live, rejected
  isVerified: integer("is_verified", { mode: 'boolean' }).default(false),
  isFeatured: integer("is_featured", { mode: 'boolean' }).default(false),
  isPremiumListing: integer("is_premium_listing", { mode: 'boolean' }).default(false),
  submittedBy: text("submitted_by").references(() => users.id),
  views: integer("views").default(0),
  
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  toolId: integer("tool_id").references(() => tools.id),
  userId: text("user_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  experience: text("experience"),
  dislikes: text("dislikes"),
  improvements: text("improvements"),
  isApproved: integer("is_approved", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// User favorites table
export const userFavorites = sqliteTable("user_favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
  toolId: integer("tool_id").references(() => tools.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Tool comparisons table
export const toolComparisons = sqliteTable("tool_comparisons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id),
  toolIds: text("tool_ids"), // JSON string of tool IDs
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
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
