CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"color" varchar(20),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"tool_id" integer,
	"user_id" varchar,
	"rating" integer NOT NULL,
	"experience" text,
	"dislikes" text,
	"improvements" text,
	"is_approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tool_comparisons" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"tool_ids" integer[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"short_description" text NOT NULL,
	"long_description" text,
	"website" varchar(500),
	"featured_image" varchar(500),
	"pricing_model" varchar(50) NOT NULL,
	"difficulty_level" varchar(50) NOT NULL,
	"category_id" integer,
	"key_features" text[],
	"target_audience" text[],
	"integrations" text[],
	"social_links" text[],
	"videos" text[],
	"hero_snapshots" text[],
	"extended_intro" text,
	"industry_verticals" text[],
	"unique_selling_props" text[],
	"ceo_intro" text,
	"ceo_linkedin" varchar(500),
	"faqs" jsonb,
	"pros" text[],
	"cons" text[],
	"suggested_alternatives" text[],
	"embedded_video_reviews" text[],
	"pricing_tiers" jsonb,
	"ease_of_use_score" real,
	"features_score" real,
	"support_score" real,
	"pricing_score" real,
	"integration_score" real,
	"overall_score" real,
	"status" varchar(50) DEFAULT 'pending',
	"is_verified" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_premium_listing" boolean DEFAULT false,
	"submitted_by" varchar,
	"views" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"tool_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"is_premium" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_comparisons" ADD CONSTRAINT "tool_comparisons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");