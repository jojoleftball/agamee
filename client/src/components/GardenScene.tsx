import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useGardenGame } from '@/lib/stores/useGardenGame';
import MergeArea from './MergeArea';
import GardenHouse from './GardenHouse';
import GardenTerrain from './GardenTerrain';
import GardenProps from './GardenProps';

export default function GardenScene() {
  const { currentZone } = useGardenGame();

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 12, 18]} fov={50} />
          
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          
          <Environment preset="sunset" />
          
          <fog attach="fog" args={['#e0f7fa', 40, 80]} />
          
          <GardenTerrain />
          
          <GardenHouse position={[-15, 0, -10]} />
          
          <MergeArea position={[0, 0.1, 0]} zone={currentZone} />
          
          <GardenProps zone={currentZone} />
          
          <OrbitControls
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            maxDistance={30}
            minDistance={10}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
