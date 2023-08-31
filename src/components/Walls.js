import { TextureLoader,MeshLambertMaterial } from 'three';
import { useLoader } from '@react-three/fiber';

const Walls=()=>{
  const [floorMap] = useLoader(TextureLoader, ['MetalNormalMap.png'])
  //const floorMap = new MeshLambertMaterial({color: 0xeeeeee});
  const [x,y]=[80,80]
    return (
        <group>
          
         <mesh rotation={[3.14/2,0,-3.14/2]} position={[0,y/2,20]} ><planeBufferGeometry attach="geometry" args={[x,y]} /><meshStandardMaterial map={floorMap} /></mesh>
          <mesh rotation={[3.14/2,0,0]} position={[0,-y/2,20]}><planeBufferGeometry attach="geometry" args={[x,y]} /><meshStandardMaterial map={floorMap} /></mesh>
          <mesh rotation={[0,-3.14/2,0]} position={[x/2,0,20]}><planeBufferGeometry attach="geometry" args={[x,y]} /><meshStandardMaterial map={floorMap} /></mesh>
          <mesh rotation={[0,3.14/2,0]} position={[-x/2,0,20]}><planeBufferGeometry attach="geometry" args={[x,y]} /><meshStandardMaterial map={floorMap} /></mesh>
    
    {/*
    <mesh rotation={[3.14/2,0,0]} position={[0,25,20]} material={floorMap}><planeBufferGeometry attach="geometry" args={[50,50,2]} /></mesh>
          <mesh rotation={[3.14/2,0,0]} position={[0,-25,20]} material={floorMap}><planeBufferGeometry attach="geometry" args={[50,50,2]} /></mesh>
          <mesh rotation={[0,-3.14/2,0]} position={[25,0,20]} material={floorMap}><planeBufferGeometry attach="geometry" args={[50,50,2]} /></mesh>
          <mesh rotation={[0,3.14/2,0]} position={[-25,0,20]} material={floorMap}><planeBufferGeometry attach="geometry" args={[50,50]} /></mesh>
        */}
        </group>
              
      //<group>
      //  <mesh material={wallMaterial} position={[0,0,-20]} geometry={[85,20,0.001]}></mesh>          // Front
      //  <mesh material={wallMaterial} position={[-20,Math.PI/2,0]} geometry={[80,20,0.001]}></mesh>  // Left Math.PI /2  = 90deg
      //  <mesh material={wallMaterial} position={[20,Math.PI/2,0]} geometry={[80,20,0.001]}></mesh>  // Right
      //  <mesh material={wallMaterial} position={[0,0,20]} geometry={[85,20,0.001]}></mesh>
      //</group>
    );
   
};    
export default Walls;