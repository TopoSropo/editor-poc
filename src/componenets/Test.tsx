import {
  Canvas,
  useLoader,
  type ThreeEvent,
  useThree,
} from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Fragment, useEffect, useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { getRef, pota, type PositionObj, type PositionVec } from "@/utils";
import {
  Mesh,
  SphereGeometry,
  type MeshStandardMaterial,
  MeshLambertMaterial,
  MeshBasicMaterial,
  Group,
  Line as TLine,
  BufferGeometry,
  LineBasicMaterial,
  CylinderGeometry,
} from "three";

export type Mode = "view" | "edit" | "create";
const modes: Mode[] = ["view", "create", "edit"];

const pointSphereGeometry = new SphereGeometry(0.1, 15, 15);
const helperPointMaterial = new MeshBasicMaterial({
  color: 0xff00ff,
  opacity: 0.5,
  transparent: true,
});

let pointerDownPosition = { x: 0, y: 0 };

export function Test() {
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
      <Canvas>
        <E />
        <OrbitControls ref={orbitRef} />
      </Canvas>
    </main>
  );
}

function Model() {
  const gltf = useLoader(GLTFLoader, "/treeLogs.glb");
  const { scene } = useThree();

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPosition = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // if (mode !== "create") return;

    if (
      Math.abs(pointerDownPosition.x - e.clientX) +
        Math.abs(pointerDownPosition.y - e.clientY) >
      10
    )
      return;

    const l = scene.getObjectByName("line");

    if (!l) return;

    const m = new Mesh();

    m.geometry = pointSphereGeometry;
    m.material = new MeshBasicMaterial({ color: 0x00ff00 });
    m.position.set(e.point.x, e.point.y, e.point.z);

    l.add(m);
  };

  return (
    <mesh
      name="model"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={(e) => {
        const i = e.intersections[0];
        const helperDot = scene.getObjectByName("helperDot");
        if (!helperDot) return;

        if (!i) return;
        helperDot.position.copy(i.point);

        const line = scene.getObjectByName("line");
        if (!line) return;

        const lastDot = line.children[line.children.length - 1];

        if (!lastDot) return;

        const connection = lastDot.position.clone().sub(i.point);
        const distance = connection.length();
        const direction = connection.clone().normalize();
        const halfDistance = direction.clone().multiplyScalar(distance / 2.0);

        const cc = scene.getObjectByName("cc");
        const piv = scene.getObjectByName("esa");

        if (cc && piv && cc instanceof Mesh) {
          cc.geometry.dispose();
          cc.geometry = new CylinderGeometry(0.05, 0.05, distance);

          piv.position.copy(i.point);
          piv.position.add(halfDistance);
          piv.lookAt(lastDot.position);

          return;
        }

        const cylinder = new Mesh(
          new CylinderGeometry(0.05, 0.05, distance),
          new MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.5,
          })
        );
        cylinder.name = "cc";

        const pivot = new Group();

        pivot.name = "esa";
        pivot.add(cylinder);

        pivot.position.copy(i.point);
        pivot.position.add(halfDistance);

        scene.add(pivot);
        pivot.lookAt(lastDot.position);
        cylinder.rotation.x = Math.PI / 2.0;
      }}
    >
      <primitive object={gltf.scene} />
    </mesh>
  );
}

export function E() {
  const [mode, setMode] = useState<Mode>("create");
  const [routePoints, setRoutePoints] = useState<PositionObj[]>([]);

  return (
    <>
      <Model />
      <group name="line" />
      <Foo />
      <mesh
        name="helperDot"
        geometry={pointSphereGeometry}
        material={helperPointMaterial}
      />
    </>
  );
}

const Foo = () => {
  const { scene } = useThree();
  const [f, sF] = useState([]);

  useEffect(() => {
    const line = Object.values(scene.children).find(
      ({ name }) => name === "line"
    );

    const f = (a: any) => {
      const x = a.child;
      if (!line) return;

      const connectionMaterial = new LineBasicMaterial({ color: 0xff0000 });
      connectionMaterial.linewidth = 10;

      for (let i = 0; i < line.children.length; ++i) {
        let s = line.children[i];
        let e = line.children[i + 1];

        if (!e) return;

        const connection = e.position.clone().sub(s.position);
        const distance = connection.length();
        const direction = connection.clone().normalize();
        const cylinder = new Mesh(
          new CylinderGeometry(0.05, 0.05, distance),
          new MeshBasicMaterial({ color: 0xff0000 })
        );

        const pivot = new Group();
        pivot.add(cylinder);

        const halfDistance = direction.clone().multiplyScalar(distance / 2.0);

        pivot.position.copy(s.position);
        pivot.position.add(halfDistance);

        scene.add(pivot);
        pivot.lookAt(e.position);
        cylinder.rotation.x = Math.PI / 2.0;
      }
    };

    if (!line) return;

    line.addEventListener("childadded", f);

    return () => {
      line.removeEventListener("childadded", f);
    };
  }, [scene]);

  return null;
};
