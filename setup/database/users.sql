CREATE TABLE "public"."users" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "username" text,
    "password" text,
    "email" text,
    PRIMARY KEY ("id")
);
