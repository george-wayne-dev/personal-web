import Link from "next/link";
import { contentUrl, getContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const sectionLabels = {
  projects: "精选作品",
  essays: "最新文章",
  notes: "最新笔记",
} as const;

export default function Home() {
  const content = getContent();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
      <header className="border-b border-black/10 pb-12">
        <p className="mb-5 font-mono text-sm tracking-widest text-[var(--mark)]">
          PERSONAL SITE
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--quiet)]">
          {siteConfig.description}
        </p>
        <nav
          className="mt-8 flex flex-wrap gap-x-5 gap-y-3"
          aria-label="主导航"
        >
          {siteConfig.navigation.map((item) => (
            <Link className="underline" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mt-14 grid gap-14">
        {Object.entries(sectionLabels).map(([collection, label]) => {
          const items = content
            .filter((item) => item.collection === collection)
            .slice(0, 3);

          return (
            <section key={collection} aria-labelledby={`${collection}-heading`}>
              <div className="mb-5 flex items-baseline justify-between gap-4">
                <h2
                  className="text-xl font-semibold"
                  id={`${collection}-heading`}
                >
                  {label}
                </h2>
                <Link className="text-sm underline" href={`/${collection}`}>
                  查看全部
                </Link>
              </div>
              {items.length > 0 ? (
                <ul className="divide-y divide-black/10 border-y border-black/10">
                  {items.map((item) => (
                    <li
                      className="py-5"
                      key={`${item.collection}-${item.slug}`}
                    >
                      <Link
                        className="block hover:opacity-70"
                        href={contentUrl(item)}
                      >
                        <p className="text-sm text-[var(--quiet)]">
                          {item.date}
                        </p>
                        <h3 className="mt-1 text-lg font-medium">
                          {item.title}
                        </h3>
                        <p className="mt-1 leading-7 text-[var(--quiet)]">
                          {item.summary}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-dashed border-black/15 bg-[var(--surface)] p-6 text-[var(--quiet)]">
                  暂无公开内容。将 Markdown 放入 content/{collection}/
                  后，开发预览会自动更新。
                </p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
