import type { Vector3 } from "three";

type ConnectionProps = {
  start: Vector3;
  end: Vector3;
};

export const Connection = ({ start, end }: ConnectionProps) => {
  const connection = end.clone().sub(start);
  const distance = connection.length();
  const direction = connection.clone().normalize();
  const halfDistance = direction.clone().multiplyScalar(distance / 2.0);

  const pPos = start.clone().add(halfDistance);

  return (
    <group position={pPos} onUpdate={(self) => self.lookAt(end)}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, distance]} />
        <meshBasicMaterial color={0xff0000} />
      </mesh>
    </group>
  );
};
