import { helperMaterial, sceneObjects } from "@/app/poc/page";

export const HelperConnection = () => {
  return (
    <group name={sceneObjects.helperPivot}>
      <mesh material={helperMaterial} name={sceneObjects.helperConnection}>
        <cylinderGeometry args={[0, 0, 0]} />
      </mesh>
    </group>
  );
};
