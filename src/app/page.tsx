"use client";

import { Test } from "@/componenets/Test";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicTest = dynamic(
  () => import("../componenets/Test").then((m) => m.Test),
  {
    ssr: false,
  }
);
export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Suspense fallback={null}>
        <DynamicTest />
      </Suspense>
    </div>
  );
}
