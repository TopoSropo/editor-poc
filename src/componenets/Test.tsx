import { Canvas, useLoader } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Fragment, useRef, useState } from "react";
import { Dot } from "@/componenets/Dot";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { getRef, pota, type PositionObj } from "@/utils";
import type { Mesh } from "three";

export type Mode = "view" | "edit" | "create";
export type DotType = "line" | "ring" | "tooltip";

const modes: Mode[] = ["view", "create", "edit"];
export function Test() {
  const [mode, setMode] = useState<Mode>("view");
  const [dotType, setDotType] = useState<DotType>("line");
  const [lineDots, setLineDots] = useState<PositionObj[]>([]);
  const [rings, setRings] = useState<PositionObj[]>([]);
  const [tooltips, setTooltips] = useState<PositionObj[]>([]);
  const [pointerClick, setPointerClick] = useState<{ x: number; y: number }>();

  const gltf = useLoader(GLTFLoader, "/treeLogs.glb");

  const orbitRef = useRef<OrbitControlsImpl>(null);
  const xd = useRef<any>();

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
      x: point.x,
      y: point.y,
      z: point.z,
    };

    switch (dotType) {
      case "line":
        setLineDots((d) => [...d, position]);
        break;
      case "ring":
        setRings((d) => [...d, position]);
        break;
      case "tooltip":
        setTooltips((d) => [...d, position]);
    }
  };

  const handleDotTransformStart = () => {
    const orbit = getRef(orbitRef);
    orbit.enabled = false;
  };

  const handleDotTransformEnd = (dotRef: Mesh, id: number) => {
    const orbit = getRef(orbitRef);
    orbit.enabled = true;
    setLineDots((p) =>
      p.map((pos, idx) => (idx === id ? dotRef.position : pos))
    );
  };

  const handleDelete = (id: number) => {
    setLineDots((p) => p.filter((_, idx) => id !== idx));
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
          {lineDots.map((props, idx, arr) => (
            <Fragment key={idx}>
              <Dot
                onContextMenu={handleDelete}
                mode={mode}
                position={props}
                onTransformStart={handleDotTransformStart}
                onTransformEnd={handleDotTransformEnd}
                id={idx}
              />
              {idx < arr.length - 1 && (
                <Line
                  linewidth={10}
                  lineWidth={10}
                  color={"red"}
                  points={[
                    [props.x, props.y, props.z],
                    [arr[idx + 1].x, arr[idx + 1].y, arr[idx + 1].z],
                  ]}
                />
              )}
            </Fragment>
          ))}

          {rings.map((ring, idx) => {
            return (
              <mesh position={pota(ring)} key={idx}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color={0xffff00} />
              </mesh>
            );
          })}

          <OrbitControls ref={orbitRef} />
        </Canvas>

        <div style={{ display: "flex", gap: "12px", padding: "12px" }}>
          <button
            onClick={() =>
              setMode((p) => modes[(modes.indexOf(p) + 1) % modes.length])
            }
          >
            {modes[(modes.indexOf(mode) + 1) % modes.length]}
          </button>

          <button onClick={() => setDotType("line")}>line</button>
          <button onClick={() => setDotType("ring")}>ring</button>
          <button onClick={() => setDotType("tooltip")}>tooltip</button>
        </div>
        <div>dot type:{dotType}</div>
        <div>mode:{mode}</div>
        <div>dots: {lineDots.length}</div>
        <div>rings: {rings.length}</div>
        <span>
          to add line enter create mode, right click to remove line dot dot type
          rings add squares :shrug:
        </span>
      </main>
    </div>
  );
}
