import Image from "next/image";
import Link from "next/link";
import type { ContentPreview } from "@/lib/content/schema";
import { contentUrl } from "@/lib/content/urls";
import { RidgeScene } from "@/components/site/ridge-scene";

export function ProjectCard({
  item,
  heading = "h3",
}: {
  item: ContentPreview;
  heading?: "h2" | "h3";
}) {
  const Heading = heading;
  return (
    <article className="landscape-project">
      <Link className="landscape-project-link" href={contentUrl(item)}>
        <div className="landscape-project-visual">
          {item.cover ? (
            <Image
              src={item.cover}
              alt=""
              width={720}
              height={440}
              sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <RidgeScene variant="card" seed={contentUrl(item)} />
          )}
          <span className="landscape-project-open" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="landscape-project-info">
          {item.category !== "未分类" ? (
            <span className="landscape-project-category">{item.category}</span>
          ) : null}
          <Heading>{item.title}</Heading>
          <p>{item.summary}</p>
        </div>
      </Link>
    </article>
  );
}
