"use client";
import { useEffect, useState } from "react";

export default function MaintenancePopup() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#333" }}>Under Development</h2>
        <p style={{ color: "#777" }}>
          This page is currently only functional on mobile devices. Please visit
          from your mobile.
        </p>
      </div>
    </div>
  );
}
