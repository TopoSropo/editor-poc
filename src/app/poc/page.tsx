"use client";
import { useRef, useState } from "react";
import styles from "./page.module.scss";
import {
  Canvas,
  useLoader,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { MeshBasicMaterial, SphereGeometry } from "three";

type Mode = "view" | "create" | "edit";

type DotType = "route" | "ring" | "info";

const sceneObjects = {
  model: "model",
  route: "route",
  helperDot: "helperDot",
};

const dotGeometry = new SphereGeometry(0.1, 15, 15);
const helperDotMaterial = new MeshBasicMaterial({
  color: 0xff00ff,
  opacity: 0.5,
  transparent: true,
});

export default function Poc() {
  const [mode, setMode] = useState<Mode>("view");
  const [entityType, setEntityType] = useState<DotType>("ring");

  return (
    <div className={styles.container}>
      <div className={styles.modes}>
        modes:
        <button
          onClick={() => setMode("view")}
          style={{
            backgroundColor: mode === "view" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          view
        </button>
        <button
          onClick={() => setMode("create")}
          style={{
            backgroundColor: mode === "create" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          create
        </button>
        <button
          onClick={() => setMode("edit")}
          style={{
            backgroundColor: mode === "edit" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          edit
        </button>
      </div>
      <div className={styles.modes}>
        add:
        <button
          disabled={mode !== "create"}
          onClick={() => setEntityType("route")}
          style={{
            backgroundColor:
              entityType === "route" && mode === "create" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          route point
        </button>
        <button
          disabled={mode !== "create"}
          onClick={() => setEntityType("ring")}
          style={{
            backgroundColor:
              entityType === "ring" && mode === "create" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          ring
        </button>
        <button
          disabled={mode !== "create"}
          onClick={() => setEntityType("info")}
          style={{
            backgroundColor:
              entityType === "info" && mode === "create" ? "green" : "initial",
          }}
          className={styles.modeButton}
        >
          info
        </button>
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
        <Model mode={mode} />
        {mode === "create" && <HelperDot />}
        <OrbitControls ref={orbitRef} />
      </Canvas>
    </main>
  );
};

type ModelProps = {
  mode: Mode;
};

const Model = ({ mode }: ModelProps) => {
  const model = useLoader(GLTFLoader, "/treeLogs.glb");

  const { scene } = useThree();

  const handleMouseMove = (e: ThreeEvent<PointerEvent>) => {
    const intersection = e.intersections.find(
      (el) => el.eventObject.name === sceneObjects.model
    );

    if (!intersection) return;

    const helperDot = scene.getObjectByName(sceneObjects.helperDot);
    if (!helperDot) return;

    helperDot.position.copy(intersection.point);
  };

  const handleMouseOut = () => {
    const helperDot = scene.getObjectByName(sceneObjects.helperDot);
    if (!helperDot) return;

    helperDot.visible = false;
  };

  const handleMouseEnter = () => {
    const helperDot = scene.getObjectByName(sceneObjects.helperDot);
    if (!helperDot) return;

    helperDot.visible = true;
  };

  return (
    <mesh
      name={sceneObjects.model}
      {...(mode === "create"
        ? {
            onPointerMove: handleMouseMove,
            onPointerLeave: handleMouseOut,
            onPointerEnter: handleMouseEnter,
          }
        : {})}
    >
      <primitive object={model.scene} />
    </mesh>
  );
};

const HelperDot = () => {
  return (
    <mesh
      name={sceneObjects.helperDot}
      geometry={dotGeometry}
      material={helperDotMaterial}
    />
  );
};
