"use client";
import { Suspense, useRef, useState } from "react";
import styles from "./page.module.scss";
import { Canvas } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import { MeshBasicMaterial, SphereGeometry } from "three";
import { HelperDot } from "@/componenets/POC/HelperDot";
import { HelperConnection } from "@/componenets/POC/HelperConnection";
import dynamic from "next/dynamic";

const Model = dynamic(() =>
  import("@/componenets/POC/Model").then((m) => m.Model)
);

export type Mode = "view" | "create" | "edit";

export type DotType = "route" | "ring" | "info";

export const sceneObjects = {
  model: "model",
  route: "route",
  helperDot: "helperDot",
  helperConnection: "helperConnection",
  helperPivot: "helperPivot",
  dot: "dot",
  lastDot: "helperDOt",
};

export const dotGeometry = new SphereGeometry(0.1, 15, 15);
export const helperMaterial = new MeshBasicMaterial({
  color: 0xff00ff,
  opacity: 0.5,
  transparent: true,
});

export const routeDotMaterial = new MeshBasicMaterial({
  color: 0x00ff00,
});

export default function Poc() {
  const [mode, setMode] = useState<Mode>("create");
  const [entityType, setEntityType] = useState<DotType>("route");

  return (
    <div className={styles.container}>
      <div className={styles.modes}>
        modes:
        {(["view", "create", "edit"] as const).map((x, idx) => (
          <button
            key={idx}
            onClick={() => setMode(x)}
            style={{ background: mode === x ? "green" : "initial" }}
            className={styles.modeButton}
          >
            {x}
          </button>
        ))}
      </div>
      <div className={styles.modes}>
        add:
        {(["route", "ring", "info"] as const).map((x, idx) => (
          <button
            key={idx}
            disabled={mode !== "create"}
            onClick={() => setEntityType(x)}
            style={{
              backgroundColor:
                entityType === x && mode === "create" ? "green" : "initial",
            }}
            className={styles.modeButton}
          >
            {x}
          </button>
        ))}
      </div>
      <Scene mode={mode} />
    </div>
  );
}

type SceneProps = {
  mode: Mode;
};

const Scene = ({ mode }: SceneProps) => {
  const orbitRef = useRef<OrbitControlsImpl>(null);

  return (
    <main
      style={{
        height: "800px",
        width: "1024px",
        border: "1px solid red",
        boxSizing: "content-box",
      }}
    >
      <Canvas camera={{ position: [8, 8, 8] }}>
        <Suspense fallback={null}>
          <Model mode={mode} orbitRef={orbitRef} />
        </Suspense>
        {mode === "create" && <HelperDot />}
        {mode === "create" && <HelperConnection />}

        <OrbitControls ref={orbitRef} />
      </Canvas>
    </main>
  );
};
