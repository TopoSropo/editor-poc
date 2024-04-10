import { type RefObject } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { type Mode, routeDotMaterial } from "@/app/poc/page";

import { useRef, useState } from "react";
import { useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { CylinderGeometry, Group, Mesh, type Vector3 } from "three";
import { dist } from "@/utils";
import { sceneObjects, dotGeometry } from "@/app/poc/page";
import { Route } from "@/componenets/POC/Route";

export type ModelProps = {
  mode: Mode;
  orbitRef: RefObject<OrbitControlsImpl>;
};

export const Model = ({ mode, orbitRef }: ModelProps) => {
  const model = useLoader(GLTFLoader, "/treeLogs.glb");
  const pointerRef = useRef({ x: 0, y: 0 });

  const { scene } = useThree();

  const [routePoints, setRoutePoints] = useState<Vector3[]>([]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (dist(pointerRef.current, { x: e.clientX, y: e.clientY }) > 15) return;

    const route = scene.getObjectByName(sceneObjects.route);

    if (!route) return;

    const dot = new Mesh(dotGeometry, routeDotMaterial);
    dot.position.copy(e.point);

    setRoutePoints((points) => [...points, e.point]);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const intersection = e.intersections.find(
      (el) => el.eventObject.name === sceneObjects.model
    );

    if (!intersection) return;

    const helperDot = scene.getObjectByName(sceneObjects.helperDot);
    if (!helperDot) return;

    helperDot.position.copy(intersection.point);

    const lastDot = scene.getObjectByName(sceneObjects.lastDot);
    if (!lastDot) return;

    const helperPivot = scene.getObjectByName(sceneObjects.helperPivot);
    if (!helperPivot || !(helperPivot instanceof Group)) return;

    const helperConnection = scene.getObjectByName(
      sceneObjects.helperConnection
    );

    if (
      !helperConnection ||
      !(helperConnection instanceof Mesh) ||
      !(helperConnection.geometry instanceof CylinderGeometry)
    )
      return;

    const connection = lastDot.position.clone().sub(helperDot.position);
    const distance = connection.length();
    const direction = connection.clone().normalize();
    const halfDistance = direction.clone().multiplyScalar(distance / 2);

    helperConnection.geometry.dispose();
    helperConnection.geometry = new CylinderGeometry(0.05, 0.05, distance);
    helperConnection.rotation.x = Math.PI / 2;

    helperPivot.position.copy(helperDot.position);
    helperPivot.position.add(halfDistance);
    helperPivot.lookAt(helperDot.position);
  };

  const handlePointerOut = () => {
    const helperDot = scene.getObjectByName(sceneObjects.helperDot);
    if (!helperDot) return;

    helperDot.visible = false;

    const helperConnection = scene.getObjectByName(
      sceneObjects.helperConnection
    );
    if (!helperConnection) return;
    helperConnection.visible = false;
  };

  const handlePointerEnter = () => {
    const helperDot = scene.getObjectByName(sceneObjects.helperDot);
    if (!helperDot) return;

    helperDot.visible = true;

    const helperConnection = scene.getObjectByName(
      sceneObjects.helperConnection
    );
    if (!helperConnection) return;
    helperConnection.visible = true;
  };

  const handleDotTranslate = (id: number, pos: Vector3) => {
    setRoutePoints((p) => p.map((dot, idx) => (id === idx ? pos : dot)));
  };

  return (
    <>
      <mesh
        name={sceneObjects.model}
        {...(mode === "create"
          ? {
              onPointerMove: handlePointerMove,
              onPointerLeave: handlePointerOut,
              onPointerEnter: handlePointerEnter,
              onPointerDown: handlePointerDown,
              onPointerUp: handlePointerUp,
            }
          : {})}
      >
        <primitive object={model.scene} />
      </mesh>
      <Route
        points={routePoints}
        mode={mode}
        orbitRef={orbitRef}
        onDotTranslate={handleDotTranslate}
      />
    </>
  );
};
