import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

const Character = ({characterRef, position=[0,-15,2], movement}) => {
    const movementSpeed = 0.3;
    const rotateSpeed=0.05;

    useFrame(() => {
      // Move the character forward
      if (movement.forward) characterRef.current.translateY(movementSpeed);
      if (movement.backward) characterRef.current.translateY(-movementSpeed);
      if (movement.left) characterRef.current.rotation.z += rotateSpeed;
      if (movement.right) characterRef.current.rotation.z -= rotateSpeed;
    });
  
    return (
      <>
        <mesh ref={characterRef} position={position}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color={0xff0000} />
        </mesh>        
      </>
    );

   /*<mesh position={[position[0]-0.05, position[1]+0.15, position[2]+0.1]}>
              <sphereGeometry args={[0.03, 32, 32]} />
              <meshBasicMaterial color={0x000000} />
        </mesh>
        <mesh position={[position[0]+0.05, position[1]+0.15, position[2]+0.1]}>
            <sphereGeometry args={[0.03, 32, 32]} />
            <meshBasicMaterial color={0x000000} />
        </mesh>*/
}
export default Character;
  
  