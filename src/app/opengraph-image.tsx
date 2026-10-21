import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "个人文稿：作品与文章";
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
        <span>PERSONAL</span>
        <span>JOURNAL</span>
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
        <span style={{ fontSize: 82 }}>Work.</span>
        <span style={{ fontSize: 82 }}>Words.</span>
      </div>
    </div>,
    size,
  );
}
