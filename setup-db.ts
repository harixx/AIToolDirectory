import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function setupDatabase() {
  try {
    // Create the categories table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        color TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Create the users table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT,
        first_name TEXT,
        last_name TEXT,
        profile_image_url TEXT,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        is_premium INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Create the tools table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS tools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        short_description TEXT NOT NULL,
        long_description TEXT,
        website TEXT,
        featured_image TEXT,
        pricing_model TEXT NOT NULL,
        difficulty_level TEXT NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        key_features TEXT,
        target_audience TEXT,
        integrations TEXT,
        social_links TEXT,
        videos TEXT,
        hero_snapshots TEXT,
        extended_intro TEXT,
        industry_verticals TEXT,
        unique_selling_props TEXT,
        ceo_intro TEXT,
        ceo_linkedin TEXT,
        faqs TEXT,
        pros TEXT,
        cons TEXT,
        suggested_alternatives TEXT,
        embedded_video_reviews TEXT,
        pricing_tiers TEXT,
        ease_of_use_score REAL,
        features_score REAL,
        support_score REAL,
        pricing_score REAL,
        integration_score REAL,
        overall_score REAL,
        status TEXT DEFAULT 'pending',
        is_verified INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        is_premium_listing INTEGER DEFAULT 0,
        submitted_by TEXT REFERENCES users(id),
        views INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Create the reviews table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tool_id INTEGER REFERENCES tools(id),
        user_id TEXT REFERENCES users(id),
        rating INTEGER NOT NULL,
        experience TEXT,
        dislikes TEXT,
        improvements TEXT,
        is_approved INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Create the user_favorites table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        tool_id INTEGER REFERENCES tools(id),
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Create the tool_comparisons table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS tool_comparisons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT REFERENCES users(id),
        tool_ids TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Create the sessions table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire INTEGER NOT NULL
      )
    `);

    // Create index on sessions expire column
    await db.run(sql`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire)
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();