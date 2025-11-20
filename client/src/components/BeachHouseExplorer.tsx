import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useBeachHouseStore } from '@/lib/stores/useBeachHouseStore';
import { useMergeGame } from '@/lib/stores/useMergeGame';
import * as THREE from 'three';
import { Lock, CheckCircle, Hammer } from 'lucide-react';

interface BeachHouseExplorerProps {
  onAreaClick?: (areaId: string) => void;
}

export default function BeachHouseExplorer({ onAreaClick }: BeachHouseExplorerProps) {
  const { areas, initializeAreas, getProgress } = useBeachHouseStore();
  const { coins } = useMergeGame();
  const progress = getProgress();

  useEffect(() => {
    initializeAreas();
  }, [initializeAreas]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-300 to-sand-200">
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 25, 15],
          fov: 50
        }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <Environment preset="sunset" />
        
        {/* Ground/Beach */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#f4e4c1" roughness={0.8} />
        </mesh>

        {/* Main Beach House */}
        <BeachHouseBuilding position={[0, 0, -10]} />

        {/* Palm Trees */}
        <PalmTree position={[-12, 0, -5]} />
        <PalmTree position={[12, 0, -5]} />
        <PalmTree position={[-10, 0, 8]} />
        <PalmTree position={[10, 0, 10]} />

        {/* Beach House Areas */}
        {areas.map((area, index) => {
          const x = (index % 3) * 9 - 9;
          const z = Math.floor(index / 3) * 9;
          return (
            <AreaMarker
              key={area.id}
              area={area}
              position={[x, 0, z]}
              onAreaClick={onAreaClick}
            />
          );
        })}

        {/* Player Character */}
        <PlayerCharacter />

        <OrbitControls
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          enableZoom={true}
          minDistance={15}
          maxDistance={40}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Beach House</h3>
            <p className="text-xs text-gray-600">Progress: {progress}%</p>
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg border-2 border-gray-300"></div>
            <span className="text-gray-700 font-medium">Locked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg border-2 border-orange-300"></div>
            <span className="text-gray-700 font-medium">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg border-2 border-green-300"></div>
            <span className="text-gray-700 font-medium">Complete</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t-2 border-amber-200">
          <p className="text-xs text-gray-600 italic">Click areas to view tasks</p>
        </div>
      </div>
    </div>
  );
}

function AreaMarker({ area, position, onAreaClick }: { 
  area: any; 
  position: [number, number, number];
  onAreaClick?: (areaId: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      document.body.style.cursor = hovered ? 'pointer' : 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const getColor = () => {
    switch (area.state) {
      case 'locked':
        return '#9ca3af';
      case 'dirty':
        return '#f97316';
      case 'clean':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  const getEmissive = () => {
    return hovered ? 0.3 : 0;
  };

  return (
    <group position={position}>
      {/* Area Base */}
      <mesh
        ref={meshRef}
        position={[0, 0.5, 0]}
        castShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onAreaClick?.(area.id)}
      >
        <boxGeometry args={[6, 1, 6]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={getEmissive()}
        />
      </mesh>

      {/* Area Label (Text would need additional setup, using marker for now) */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Furniture/Decoration based on area */}
      {area.state !== 'locked' && <AreaFurniture areaId={area.id} />}
    </group>
  );
}

function AreaFurniture({ areaId }: { areaId: string }) {
  const { scene: chair } = useGLTF('/models/furniture_chair.glb');
  
  return (
    <primitive
      object={chair.clone()}
      scale={2.5}
      position={[1, 0.1, 1]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

function BeachHouseBuilding({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/beachhouse_main.glb');
  
  return (
    <primitive
      object={scene.clone()}
      scale={3}
      position={position}
      castShadow
      receiveShadow
    />
  );
}

function PalmTree({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/env_palmtree.glb');
  
  return (
    <primitive
      object={scene.clone()}
      scale={3}
      position={position}
      castShadow
    />
  );
}

function PlayerCharacter() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={[0, 0.1, 12]}>
      {/* Simple player representation */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.5, 1.5, 8, 16]} />
        <meshStandardMaterial color="#ff6b9d" />
      </mesh>
      
      {/* Player head */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>
      
      {/* Player shadow indicator */}
      <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

// Preload models
useGLTF.preload('/models/furniture_chair.glb');
useGLTF.preload('/models/beachhouse_main.glb');
useGLTF.preload('/models/env_palmtree.glb');
useGLTF.preload('/models/env_fence.glb');
