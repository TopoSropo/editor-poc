import { dotGeometry, helperMaterial, sceneObjects } from "@/app/poc/page";

export const HelperDot = () => {
  return (
    <mesh
      name={sceneObjects.helperDot}
      geometry={dotGeometry}
      material={helperMaterial}
    />
  );
};
