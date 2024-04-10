import { dotGeometry, helperMaterial, sceneObjects } from "@/app/page";

export const HelperDot = () => {
  return (
    <mesh
      name={sceneObjects.helperDot}
      geometry={dotGeometry}
      material={helperMaterial}
    />
  );
};
