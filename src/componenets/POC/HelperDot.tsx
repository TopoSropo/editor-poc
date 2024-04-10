import {
  sceneObjects,
  dotGeometry,
  helperMaterial,
} from "@/componenets/POC/scene";

export const HelperDot = () => {
  return (
    <mesh
      name={sceneObjects.helperDot}
      geometry={dotGeometry}
      material={helperMaterial}
    />
  );
};
