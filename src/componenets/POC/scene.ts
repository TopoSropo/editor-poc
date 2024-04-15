import { BoxGeometry, MeshBasicMaterial, SphereGeometry } from "three";

export const sceneObjects = {
  model: "model",
  route: "route",
  helperDot: "helperDot",
  helperConnection: "helperConnection",
  helperPivot: "helperPivot",
  dot: "dot",
  ring: "ring",
  lastDot: "helperDOt",
};

export const dotGeometry = new SphereGeometry(0.1, 15, 15);
export const ringGeometry = new BoxGeometry(0.08, 0.08, 0.08);

export const helperMaterial = new MeshBasicMaterial({
  color: 0xff00ff,
  opacity: 0.5,
  transparent: true,
});

export const routeDotMaterial = new MeshBasicMaterial({
  color: 0x00ff00,
});

export const ringMaterial = new MeshBasicMaterial({
  color: 0xffff00,
});
