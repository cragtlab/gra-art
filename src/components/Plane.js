import { TextureLoader,MeshLambertMaterial } from 'three';
import { useLoader } from '@react-three/fiber';

const Plane = () => {
    const [floorMap, ceilingMap] = useLoader(TextureLoader, ['Floor.jpg', 'OfficeCeiling005_4K_Color.jpg']);
    
    return (
        <group>
            <mesh position={[0, 0, -10]}>
                <planeBufferGeometry attach="geometry" args={[80, 80]} /><meshStandardMaterial map={floorMap} /> 
            </mesh>
            <mesh rotation={[0,-3.14,3.14/2]} position={[0, 0, 10]} >
                <planeBufferGeometry attach="geometry" args={[80, 80]} /><meshStandardMaterial map={ceilingMap} /> 
            </mesh>
        </group>
    );
}

export default Plane;