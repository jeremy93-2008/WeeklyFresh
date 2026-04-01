CREATE TABLE "favorites" (
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	CONSTRAINT "favorites_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"quantity" text,
	"unit" text,
	"name" text NOT NULL,
	"shipped" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instructions" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"step_order" integer NOT NULL,
	"text" text NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "plan_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"user_id" text,
	"email" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"title" text NOT NULL,
	"image" text,
	"url" text,
	"is_hellofresh" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utensils" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_plan_custom_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"name" text NOT NULL,
	"checked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_plan_ingredient_checks" (
	"plan_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"checked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "weekly_plan_ingredient_checks_plan_id_ingredient_id_pk" PRIMARY KEY("plan_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "weekly_plan_recipes" (
	"plan_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	"day_of_week" integer,
	CONSTRAINT "weekly_plan_recipes_plan_id_recipe_id_pk" PRIMARY KEY("plan_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "weekly_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"week_start" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructions" ADD CONSTRAINT "instructions_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_members" ADD CONSTRAINT "plan_members_plan_id_weekly_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."weekly_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utensils" ADD CONSTRAINT "utensils_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_plan_custom_items" ADD CONSTRAINT "weekly_plan_custom_items_plan_id_weekly_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."weekly_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_plan_ingredient_checks" ADD CONSTRAINT "weekly_plan_ingredient_checks_plan_id_weekly_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."weekly_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_plan_ingredient_checks" ADD CONSTRAINT "weekly_plan_ingredient_checks_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_plan_recipes" ADD CONSTRAINT "weekly_plan_recipes_plan_id_weekly_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."weekly_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_plan_recipes" ADD CONSTRAINT "weekly_plan_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "plan_members_plan_email_idx" ON "plan_members" USING btree ("plan_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "weekly_plans_user_week_idx" ON "weekly_plans" USING btree ("user_id","week_start");