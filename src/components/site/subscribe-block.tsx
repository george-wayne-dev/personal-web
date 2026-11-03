import Image from "next/image";
import type { SiteSubscribe } from "@/lib/site";

// Unconfigured channels show a placeholder only in development so their position
// can be reviewed; production renders configured channels and RSS only.
const showPlaceholders = process.env.NODE_ENV === "development";

export function SubscribeBlock({
  subscribe,
  rss,
  headingId,
  heading = "h2",
}: {
  subscribe: SiteSubscribe;
  rss?: string;
  headingId?: string;
  heading?: "h2" | "h3";
}) {
  const Heading = heading;
  const { email, wechat } = subscribe;

  return (
    <div className="landscape-subscribe">
      <div className="landscape-subscribe-copy">
        <Heading id={headingId}>订阅更新</Heading>
        <p>新的产品记录和复盘发布时，用你习惯的方式收到。</p>
      </div>
      <div className="landscape-subscribe-channels">
        {wechat.qrcode ? (
          <figure className="landscape-subscribe-wechat">
            <Image
              src={wechat.qrcode}
              alt="公众号二维码"
              width={112}
              height={112}
              unoptimized
            />
            <figcaption>
              微信扫码关注{wechat.name ? `「${wechat.name}」` : "公众号"}
            </figcaption>
          </figure>
        ) : showPlaceholders ? (
          <div className="landscape-subscribe-placeholder">
            <span>公众号二维码</span>
            <span>待配置</span>
            <code>subscribe.wechat</code>
          </div>
        ) : null}
        <div className="landscape-subscribe-links">
          {email ? (
            <a href={email} target="_blank" rel="noopener noreferrer">
              邮件订阅 <span aria-hidden="true">↗</span>
            </a>
          ) : showPlaceholders ? (
            <span className="landscape-subscribe-placeholder">
              邮件订阅链接待配置
              <code>subscribe.email</code>
            </span>
          ) : null}
          <a href={rss || "/rss.xml"}>
            RSS <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
