import { z } from "zod";

export const collections = ["projects", "essays", "notes"] as const;

export type ContentCollection = (typeof collections)[number];

export const contentFrontmatterSchema = z
  .object({
    title: z.string().min(1, "title 不能为空"),
    summary: z.string().min(1, "summary 不能为空"),
    date: z.string().date("date 必须是 YYYY-MM-DD"),
    updated: z.string().date("updated 必须是 YYYY-MM-DD").optional(),
    category: z.string().min(1, "category 不能为空"),
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
  })
  .strict();

export type ContentFrontmatter = z.infer<typeof contentFrontmatterSchema>;

export type ContentDocument = ContentFrontmatter & {
  collection: ContentCollection;
  body: string;
};
