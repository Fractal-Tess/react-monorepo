import { z } from "zod";
import {
  defineCollection,
  TextField,
  EditorField,
  BoolField,
  SelectField,
  RelationField,
  RelationsField,
  NumberField,
} from "pocketbase-zod-schema/schema";

// ── Tags ──────────────────────────────────────────────────────

export const TagSchema = z.object({
  name: TextField({ min: 1, max: 50 }),
  slug: TextField({ min: 1, max: 50 }),
  color: TextField({ min: 0, max: 7 }),
});

export const TagCollection = defineCollection({
  collectionName: "tags",
  schema: TagSchema,
  permissions: {
    listRule: "",
    viewRule: "",
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
  },
  indexes: ["CREATE UNIQUE INDEX idx_tags_slug ON tags (slug)"],
});

// ── Posts ──────────────────────────────────────────────────────

export const PostSchema = z.object({
  title: TextField({ min: 1, max: 200 }),
  slug: TextField({ min: 1, max: 200 }),
  content: EditorField(),
  excerpt: TextField({ min: 0, max: 500 }),
  published: BoolField(),
  status: SelectField({ values: ["draft", "published", "archived"] }),
  views: NumberField({ min: 0, onlyInt: true }),

  // Relations
  author: RelationField({ collection: "users" }),
  tags: RelationsField({ collection: "tags", maxSelect: 10 }),
});

export const PostCollection = defineCollection({
  collectionName: "posts",
  schema: PostSchema,
  permissions: {
    listRule: "author = @request.auth.id",
    viewRule: "author = @request.auth.id",
    createRule: '@request.auth.id != ""',
    updateRule: "author = @request.auth.id",
    deleteRule: "author = @request.auth.id",
  },
  indexes: [
    "CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)",
    "CREATE INDEX idx_posts_status ON posts (status)",
  ],
});
