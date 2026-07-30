import { getPublicContent } from "@/lib/cms-storage";
import type { Metadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "System Status",
  robots: { index: false, follow: false },
};

export default async function SystemStatusPage() {
  let database = "connected";
  try {
    await getPublicContent();
  } catch {
    database = "unavailable";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f7f5f0",
      }}
    >
      <section
        style={{
          width: "min(520px, 100%)",
          padding: 32,
          background: "white",
          border: "1px solid #e8e3da",
          borderRadius: 22,
        }}
      >
        <Image
          src="/images/sunx-logo.png"
          alt="SunX"
          width={140}
          height={45}
          style={{ width: 140, height: "auto", marginBottom: 24 }}
        />
        <p style={{ color: "#c87800", fontWeight: 800 }}>System status</p>
        <h1 style={{ margin: "6px 0 10px" }}>
          {database === "connected" ? "Website services are healthy" : "Storage needs attention"}
        </h1>
        <p style={{ margin: 0, color: "#6f706d" }}>
          Database: <strong>{database}</strong>
        </p>
      </section>
    </main>
  );
}
