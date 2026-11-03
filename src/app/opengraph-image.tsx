import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const alt = `${siteConfig.name}：一个人 + AI，从需求到上线做产品`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f4f6f3",
        color: "#17211e",
        padding: 70,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 220,
          borderRight: "2px solid #65716b",
          fontSize: 22,
          paddingTop: 16,
        }}
      >
        <span>ONE PERSON</span>
        <span>+ AI</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 65,
          gap: 24,
        }}
      >
        <span style={{ fontSize: 82 }}>From need,</span>
        <span style={{ fontSize: 82 }}>to launch.</span>
      </div>
    </div>,
    size,
  );
}
