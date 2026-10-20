import { z } from "zod";

export const collections = ["projects", "essays", "notes"] as const;

export type ContentCollection = (typeof collections)[number];

const evidenceItemSchema = z.object({
  label: z.string().min(1),
  text: z.string().min(1),
  state: z.string().min(1).optional(),
});

const evidenceViewSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1).optional(),
  items: z.array(evidenceItemSchema).min(1).max(4),
});

export const contentFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1, "title 不能为空"),
    summary: z.string().trim().min(1, "summary 不能为空"),
    date: z.string().date("date 必须是 YYYY-MM-DD"),
    updated: z.string().date("updated 必须是 YYYY-MM-DD").optional(),
    category: z.string().trim().min(1, "category 不能为空").default("未分类"),
    locale: z.literal("zh-CN").default("zh-CN"),
    tags: z.array(z.string().min(1)).min(1, "至少需要一个标签"),
    slug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "slug 必须使用小写英文、数字和连字符",
      )
      .optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().min(1).optional(),
    kind: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    code: z.string().min(1).optional(),
    status: z.string().min(1).optional(),
    readingMinutes: z.number().int().positive().optional(),
    role: z.string().min(1).optional(),
    stack: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    evidence: z.array(evidenceViewSchema).min(1).max(3).optional(),
  })
  .strict()
  .refine((data) => !data.updated || data.updated >= data.date, {
    message: "updated 不能早于 date",
    path: ["updated"],
  });

export type ContentFrontmatter = z.infer<typeof contentFrontmatterSchema>;

export type ContentDocument = ContentFrontmatter & {
  collection: ContentCollection;
  body: string;
};

export type ContentPreview = Omit<ContentDocument, "body">;
