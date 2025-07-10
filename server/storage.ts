import {
  users,
  categories,
  tools,
  reviews,
  userFavorites,
  toolComparisons,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Tool,
  type InsertTool,
  type Review,
  type InsertReview,
  type UserFavorite,
  type InsertUserFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, ilike, inArray, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (updated for email auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<UpsertUser, 'id'> & { password: string }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Tool operations
  getTools(filters?: {
    category?: string;
    pricingModel?: string;
    difficultyLevel?: string;
    search?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ tools: Tool[]; total: number }>;
  getToolById(id: number): Promise<Tool | undefined>;
  getToolBySlug(slug: string): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateTool(id: number, tool: Partial<InsertTool>): Promise<Tool>;
  getToolsByUser(userId: string): Promise<Tool[]>;
  getFeaturedTools(): Promise<Tool[]>;
  incrementToolViews(id: number): Promise<void>;
  
  // Review operations
  getReviewsByTool(toolId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<Review>;
  
  // Favorite operations
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addToFavorites(userId: string, toolId: number): Promise<UserFavorite>;
  removeFromFavorites(userId: string, toolId: number): Promise<void>;
  
  // Comparison operations
  getToolsForComparison(toolIds: number[]): Promise<Tool[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'> & { password: string }): Promise<User> {
    const id = crypto.randomUUID();
    const [user] = await db
      .insert(users)
      .values({
        id,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        isPremium: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Tool operations
  async getTools(filters: {
    category?: string;
    pricingModel?: string;
    difficultyLevel?: string;
    search?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ tools: Tool[]; total: number }> {
    const {
      category,
      pricingModel,
      difficultyLevel,
      search,
      sortBy = "popularity",
      limit = 20,
      offset = 0,
    } = filters;

    let query = db.select().from(tools);
    let countQuery = db.select({ count: count() }).from(tools);

    const conditions: any[] = [eq(tools.status, "live")];

    if (category) {
      const categoryRecord = await this.getCategoryBySlug(category);
      if (categoryRecord) {
        conditions.push(eq(tools.categoryId, categoryRecord.id));
      }
    }

    if (pricingModel) {
      conditions.push(eq(tools.pricingModel, pricingModel));
    }

    if (difficultyLevel) {
      conditions.push(eq(tools.difficultyLevel, difficultyLevel));
    }

    if (search) {
      conditions.push(
        sql`${tools.name} ILIKE ${`%${search}%`} OR ${tools.shortDescription} ILIKE ${`%${search}%`}`
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    // Apply sorting
    switch (sortBy) {
      case "name":
        query = query.orderBy(asc(tools.name));
        break;
      case "rating":
        query = query.orderBy(desc(tools.overallScore));
        break;
      case "newest":
        query = query.orderBy(desc(tools.createdAt));
        break;
      case "popularity":
      default:
        query = query.orderBy(desc(tools.views), desc(tools.createdAt));
        break;
    }

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const [toolsResult, totalResult] = await Promise.all([
      query.execute(),
      countQuery.execute(),
    ]);

    return {
      tools: toolsResult,
      total: totalResult[0]?.count || 0,
    };
  }

  async getToolById(id: number): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool;
  }

  async getToolBySlug(slug: string): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.slug, slug));
    return tool;
  }

  async createTool(tool: InsertTool): Promise<Tool> {
    const [newTool] = await db.insert(tools).values(tool).returning();
    return newTool;
  }

  async updateTool(id: number, tool: Partial<InsertTool>): Promise<Tool> {
    const [updatedTool] = await db
      .update(tools)
      .set({ ...tool, updatedAt: new Date() })
      .where(eq(tools.id, id))
      .returning();
    return updatedTool;
  }

  async getToolsByUser(userId: string): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(eq(tools.submittedBy, userId))
      .orderBy(desc(tools.createdAt));
  }

  async getFeaturedTools(): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(and(eq(tools.status, "live"), eq(tools.isFeatured, true)))
      .orderBy(desc(tools.views))
      .limit(6);
  }

  async incrementToolViews(id: number): Promise<void> {
    await db
      .update(tools)
      .set({ views: sql`${tools.views} + 1` })
      .where(eq(tools.id, id));
  }

  // Review operations
  async getReviewsByTool(toolId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.toolId, toolId), eq(reviews.isApproved, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async approveReview(id: number): Promise<Review> {
    const [approvedReview] = await db
      .update(reviews)
      .set({ isApproved: true })
      .where(eq(reviews.id, id))
      .returning();
    return approvedReview;
  }

  // Favorite operations
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return await db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
  }

  async addToFavorites(userId: string, toolId: number): Promise<UserFavorite> {
    const [favorite] = await db
      .insert(userFavorites)
      .values({ userId, toolId })
      .returning();
    return favorite;
  }

  async removeFromFavorites(userId: string, toolId: number): Promise<void> {
    await db
      .delete(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.toolId, toolId)));
  }

  // Comparison operations
  async getToolsForComparison(toolIds: number[]): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(inArray(tools.id, toolIds))
      .orderBy(asc(tools.name));
  }
}

export const storage = new DatabaseStorage();
