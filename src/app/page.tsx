"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { Line, OrbitControls, TransformControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import type { Object3D } from "three";

type Position = {
  x: number;
  y: number;
  z: number;
};

type DotProps = {
  x: number;
  y: number;
  z: number;
  id: string | number;
  orbit: any;
  mode: Mode;
  updatePosition: SetStateAction<any>;
};

const Dot = ({ x, y, z, orbit, id, updatePosition, mode }: DotProps) => {
  const meshRef = useRef<Object3D>();
  const transform = useRef<any>(null);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (transform.current) {
      const controls = transform.current;
      controls.setMode("translate");
      const callback = (event: any) => {
        if (event.value === false) {
          updatePosition((p) =>
            p.map((dot, idx) => (idx === id ? meshRef.current?.position : dot))
          );
        }
        orbit.current.enabled = !event.value;
      };

      controls.addEventListener("dragging-changed", callback);

      return () => {
        controls.removeEventListener("dragging-changed", callback);
      };
    }
  });

  const handleMouseEnter = () => {
    // meshRef.current.material.set("#ff0000");
    meshRef.current.material.color = {
      isColor: true,
      r: 1,
      g: 0,
      b: 0,
    };
    // setHovered(true);
  };

  const handleMouseLeave = () => {
    meshRef.current.material.color = {
      isColor: true,
      r: 0,
      g: 1,
      b: 0,
    };
    // meshRef.current.material.set("#ffff00");
    // setHovered(false);
  };

  return mode === "edit" ? (
    <TransformControls ref={transform} object={meshRef}>
      <mesh
        ref={meshRef}
        position={[x, y, z]}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        onContextMenu={(e) => {
          updatePosition((p) => p.filter((_, idx) => idx !== id));
        }}
      >
        <sphereGeometry args={[0.3, 15, 15]} />
        <meshStandardMaterial color={hovered ? "red" : "hotpink"} />
      </mesh>
    </TransformControls>
  ) : (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      onPointerEnter={handleMouseEnter}
      onPointerLeave={handleMouseLeave}
      onContextMenu={(e) => {
        updatePosition((p) => p.filter((_, idx) => idx !== id));
      }}
    >
      <sphereGeometry args={[0.3, 15, 15]} />
      <meshStandardMaterial color={"lightgreen"} />
    </mesh>
  );
};

type Mode = "view" | "edit" | "create";

const modes: Mode[] = ["view", "create", "edit"];

export default function Home() {
  const [mode, setMode] = useState<Mode>("view");
  const [dots, setDots] = useState<any[]>([]);

  const [pointerClick, setPointerClick] = useState<{ x: number; y: number }>();

  const orbit = useRef(null);

  const gltf = useLoader(GLTFLoader, "/treeLogs.glb");

  const addDot = (event: any) => {
    event.stopPropagation();

    if (mode !== "create") return;

    if (!pointerClick) return;
    if (
      Math.abs(pointerClick?.x - event.clientX) +
        Math.abs(pointerClick.y - event.clientY) >
      20
    )
      return;

    const { point } = event.intersections[0];

    const position = {
      x: Number(point.x.toFixed(2)),
      y: Number(point.y.toFixed(2)),
      z: Number(point.z.toFixed(2)),
    };

    setDots((d) => [...d, position]);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <main
        style={{
          height: "800px",
          width: "1024px",
          border: "1px solid red",
          boxSizing: "content-box",
        }}
      >
        <Canvas>
          <ambientLight intensity={Math.PI / 2} />
          <mesh
            onPointerDown={(e) => {
              if (mode === "create") {
                setPointerClick({ x: e.clientX, y: e.clientY });
              }
            }}
            onPointerUp={addDot}
          >
            <primitive object={gltf.scene} />
          </mesh>
          {dots.map((props, idx, arr) =>
            idx === arr.length - 1 ? (
              <Fragment key={idx}>
                <Dot
                  mode={mode}
                  {...props}
                  orbit={orbit}
                  updatePosition={setDots}
                  id={idx}
                />
              </Fragment>
            ) : (
              <Fragment key={idx}>
                <Dot
                  {...props}
                  mode={mode}
                  orbit={orbit}
                  updatePosition={setDots}
                  id={idx}
                />
                <Line
                  linewidth={10}
                  lineWidth={10}
                  color={"red"}
                  points={[
                    [props.x, props.y, props.z],
                    [arr[idx + 1].x, arr[idx + 1].y, arr[idx + 1].z],
                  ]}
                />
              </Fragment>
            )
          )}

          <OrbitControls ref={orbit} />
        </Canvas>
        <button
          onClick={() =>
            setMode((p) => modes[(modes.indexOf(p) + 1) % modes.length])
          }
        >
          {mode}
        </button>
        <div>dots: {dots.length}</div>
      </main>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {dots.map((dot) => (
          <div
            key={dot.x + dot.y}
          >{`x: ${dot.x}, y: ${dot.y}, z:${dot.z}`}</div>
        ))}
      </div>
    </div>
  );
}
