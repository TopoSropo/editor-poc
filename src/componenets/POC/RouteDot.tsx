import { useEffect, useRef, type RefObject } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { TransformControls as TransformControlsImpl } from "three-stdlib";
import { TransformControls } from "@react-three/drei";
import { Mesh, type Vector3 } from "three";
import { dotGeometry, routeDotMaterial, type Mode } from "@/app/page";

type RouteDotProps = {
  name: string;
  position: Vector3;
  mode: Mode;
  orbitRef: RefObject<OrbitControlsImpl>;
  onTranslate: (id: number, pos: Vector3) => void;
  id: number;
};

export const RouteDot = ({
  name,
  position,
  mode,
  orbitRef,
  onTranslate,
  id,
}: RouteDotProps) => {
  const transformRef = useRef<TransformControlsImpl>(null);
  const dotRef = useRef(new Mesh());

  useEffect(() => {
    if (!transformRef.current) return;

    const controls = transformRef.current;

    const f = (e: any) => {
      const { value } = e;

      if (!orbitRef.current) return;

      orbitRef.current.enabled = !value;

      if (!value && dotRef.current) {
        onTranslate(id, dotRef.current.position);
      }
    };

    controls.addEventListener("dragging-changed", f);

    return () => {
      controls.removeEventListener("translate", f);
    };
  });

  const dot = (
    <mesh
      ref={dotRef}
      geometry={dotGeometry}
      material={routeDotMaterial}
      position={position}
      name={name}
    ></mesh>
  );

  return mode === "edit" ? (
    <TransformControls ref={transformRef} mode="translate" object={dotRef}>
      {dot}
    </TransformControls>
  ) : (
    dot
  );
};
