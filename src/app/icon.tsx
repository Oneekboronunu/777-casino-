import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "linear-gradient(135deg, #BA2649 0%, #381523 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFDE59",
          borderRadius: "8px",
          border: "2px solid #FFDE59",
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: "-1px",
          boxShadow: "0 0 10px rgba(255,222,89,0.5)",
        }}
      >
        777
      </div>
    ),
    {
      ...size,
    }
  );
}
