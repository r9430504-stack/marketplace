import { ImageResponse } from "next/og";
import { getAllPhones } from "@/lib/phones";

// Branded share preview shown when the link is pasted into Telegram / WhatsApp /
// VK / Facebook etc. Generated at build time — self-contained, no external assets.
export const alt = "Galaxy Archive — the complete history of Samsung Galaxy phones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const total = getAllPhones().length;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #0a1440 0%, #1428a0 60%, #24337c 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#ffffff",
              color: "#1428a0",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            G
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>
            Galaxy Archive
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
            The complete history of Samsung Galaxy phones
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#cdd6ff", marginTop: 22 }}>
            {total} models · 2010–2025 · specs, comparisons & an AI picker
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#9fb0ff" }}>galaxyarchive.org</div>
          <div style={{ display: "flex", fontSize: 20, color: "#8090d0", letterSpacing: 2 }}>
            NOT THE OFFICIAL SAMSUNG SITE
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
