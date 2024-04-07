import { pota, type PositionObj } from "@/utils";
import { TransformControls } from "@react-three/drei";
import { TransformControls as TransformControlsImpl } from "three-stdlib";

import { useEffect, useRef } from "react";
import { Mesh, type MeshStandardMaterial, type SphereGeometry } from "three";
import type { Mode } from "@/componenets/Test";

type DotProps = {
  position: PositionObj;
  id: number;
  mode: Mode;
  onTransformStart: VoidFunction;
  onTransformEnd: (ref: Mesh, id: number) => void;
};

export const Dot = ({
  position,
  id,
  mode,
  onTransformStart,
  onTransformEnd,
}: DotProps) => {
  const meshRef = useRef(new Mesh<SphereGeometry, MeshStandardMaterial>());
  const transformRef = useRef<TransformControlsImpl>(null);

  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;

      const cb = (e: any) => {
        if (e.value) {
          onTransformStart();
        } else {
          onTransformEnd(meshRef.current, id);
        }
      };

      controls.addEventListener("dragging-changed", cb);

      return () => {
        controls.removeEventListener("dragging-changed", cb);
      };
    }
  });

  const handleMouseEnter = () => {
    if (!Array.isArray(meshRef.current.material))
      meshRef.current.material.color.setHex(0xff0000);
  };

  const handleMouseLeave = () => {
    meshRef.current.material.color.setHex(0x00ff00);
  };

  const dot = (
    <mesh
      ref={meshRef}
      position={pota(position)}
      onPointerEnter={handleMouseEnter}
      onPointerLeave={handleMouseLeave}
    >
      <sphereGeometry args={[0.1, 15, 15]} />
      <meshStandardMaterial color={0x00ff00} />
    </mesh>
  );

  return mode === "edit" ? (
    <TransformControls mode="translate" ref={transformRef} object={meshRef}>
      {dot}
    </TransformControls>
  ) : (
    dot
  );
};
