import type { DotType } from "@/app/page";
import {
  sceneObjects,
  dotGeometry,
  helperMaterial,
  ringGeometry,
} from "@/componenets/POC/scene";

type HelperDotProps = {
  entity: DotType;
};

export const HelperDot = ({ entity }: HelperDotProps) => {
  return (
    <mesh
      name={sceneObjects.helperDot}
      geometry={entity === "ring" ? ringGeometry : dotGeometry}
      material={helperMaterial}
    />
  );
};
