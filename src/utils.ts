import type { RefObject } from "react";

export type PositionObj = {
  x: number;
  y: number;
  z: number;
};

export type PositionVec = [x: number, y: number, z: number];

/**
 * posiiton object to array
 * @param obj {x, y, z}
 * @returns vec3 [x, y, z]
 */
export const pota = ({ x, y, z }: PositionObj): PositionVec => [x, y, z];

/**
 * posiiton array to object
 * @param vec3 [x, y, z]
 * @returns obj {x, y, z}
 */
export const pato = ([x, y, z]: PositionVec) => ({
  x,
  y,
  z,
});

export const getRef = <T extends React.RefObject<any>>(
  ref: T
): T extends React.RefObject<infer U> ? U : never => {
  if (!ref.current) throw new Error("ref is null");

  return ref.current;
};

export function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5;
}
