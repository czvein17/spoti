CREATE TYPE "public"."room_member_role" AS ENUM('dj', 'listener');--> statement-breakpoint
CREATE TYPE "public"."room_reaction_emoji" AS ENUM('heart', 'fire', 'cry');--> statement-breakpoint
CREATE TYPE "public"."room_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "room_members" (
	"id" text PRIMARY KEY NOT NULL,
	"room_id" text NOT NULL,
	"guest_session_id" varchar(64),
	"guest_name" varchar(24) NOT NULL,
	"role" "room_member_role" NOT NULL,
	"spot_id" varchar(40) NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "room_reactions" (
	"member_id" text NOT NULL,
	"emoji" "room_reaction_emoji" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "room_reactions_member_id_emoji_pk" PRIMARY KEY("member_id","emoji")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"status" "room_status" DEFAULT 'open' NOT NULL,
	"current_track_title" varchar(160) NOT NULL,
	"current_track_artist" varchar(160) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_reactions" ADD CONSTRAINT "room_reactions_member_id_room_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."room_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "room_members_room_spot_unique" ON "room_members" USING btree ("room_id","spot_id");--> statement-breakpoint
CREATE UNIQUE INDEX "room_members_room_guest_session_unique" ON "room_members" USING btree ("room_id","guest_session_id");