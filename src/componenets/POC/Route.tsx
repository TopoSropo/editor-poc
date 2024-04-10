import { type RefObject } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { type Vector3 } from "three";
import { sceneObjects, type Mode } from "@/app/page";
import { RouteDot } from "@/componenets/POC/RouteDot";
import { Connection } from "@/componenets/POC/Connection";

type RouteProps = {
  points: Vector3[];
  mode: Mode;
  orbitRef: RefObject<OrbitControlsImpl>;
  onDotTranslate: (id: number, pos: Vector3) => void;
};

export const Route = ({
  points,
  mode,
  orbitRef,
  onDotTranslate,
}: RouteProps) => {
  return (
    <>
      <group name={sceneObjects.route}>
        {points.map((point, idx, arr) => (
          <RouteDot
            onTranslate={onDotTranslate}
            orbitRef={orbitRef}
            key={idx}
            id={idx}
            position={point}
            name={
              idx === arr.length - 1 ? sceneObjects.lastDot : sceneObjects.dot
            }
            mode={mode}
          />
        ))}
      </group>
      <group>
        {points.map((point, idx, arr) => {
          return idx === arr.length - 1 ? null : (
            <Connection key={idx} start={point} end={arr[idx + 1]} />
          );
        })}
      </group>
    </>
  );
};
