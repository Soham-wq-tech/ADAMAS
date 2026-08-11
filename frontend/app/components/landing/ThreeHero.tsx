"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Text,
  Sphere,
  Line
} from "@react-three/drei";

import { useRef } from "react";
import * as THREE from "three";



function Laptop(){

const laptop = useRef<THREE.Group>(null);


useFrame((state)=>{

if(laptop.current){

laptop.current.rotation.y =
Math.sin(state.clock.elapsedTime * 0.5) * 0.15;


laptop.current.position.y =
Math.sin(state.clock.elapsedTime * 1.5)*0.05;

}

});



return (

<group ref={laptop} scale={0.75}>


{/* BASE */}

<mesh position={[0,-0.8,0]}>

<boxGeometry args={[3.4,0.15,2]}/>

<meshStandardMaterial
color="#64748b"
metalness={0.8}
/>

</mesh>



{/* KEYBOARD */}

<mesh position={[0,-0.68,0.2]}>

<boxGeometry args={[2.8,0.05,1.2]}/>

<meshStandardMaterial
color="#0f172a"
/>

</mesh>


{/* keyboard keys */}

{Array.from({length:12}).map((_,i)=>(

<mesh
key={i}
position={[
-1.2+(i%6)*0.45,
-0.62,
-0.1+Math.floor(i/6)*0.35
]}
>

<boxGeometry args={[0.25,0.04,0.18]}/>

<meshStandardMaterial
color="#94a3b8"
/>

</mesh>

))}



{/* SCREEN FRAME */}

<mesh
position={[0,0.6,-0.9]}
rotation={[0,0,0]}
>

<boxGeometry args={[3.3,2.1,0.12]}/>

<meshStandardMaterial

color="#1e293b"

metalness={0.7}

/>

</mesh>



{/* SCREEN */}

<mesh
position={[0,0.6,-0.98]}
>

<planeGeometry args={[2.9,1.7]}/>

<meshStandardMaterial

color="#020617"

emissive="#0891b2"

emissiveIntensity={0.5}

/>

</mesh>



{/* AI AVATAR */}

<Sphere
position={[0,0.75,-1.05]}
args={[0.25,32,32]}
>

<meshStandardMaterial

color="#22d3ee"

emissive="#22d3ee"

emissiveIntensity={2}

/>

</Sphere>



{/* Screen Text */}

<Text

position={[0,0.15,-1.08]}

fontSize={0.15}

color="white"

anchorX="center"

>

AI INTERVIEW

</Text>


<Text

position={[0,-0.1,-1.08]}

fontSize={0.09}

color="#67e8f9"

anchorX="center"

>

Explain your approach...

</Text>



</group>

)

}







function Hologram(){


return (

<>


{/* holographic rings */}

<Sphere

position={[0,0,0]}

scale={1.8}

>

<meshBasicMaterial

color="#22d3ee"

wireframe

transparent

opacity={0.15}

/>

</Sphere>


</>

)

}







function Particles(){

const points=[];


for(let i=0;i<18;i++){

points.push(

<mesh

key={i}

position={[

(Math.random()-0.5)*5,

(Math.random()-0.5)*3,

(Math.random()-0.5)*2

]}

>

<Sphere args={[0.03]}>

<meshStandardMaterial

color="#38bdf8"

emissive="#38bdf8"

/>

</Sphere>


</mesh>

)

}


return <>{points}</>

}








function NeuralNetwork(){


const nodes: [number, number, number][] = [
  [-1, 1, 0],
  [0, 1.5, 0],
  [1, 1, 0],
  [-1, 0, 0],
  [0, 0.5, 0],
  [1, 0, 0],
];


return (

<>

{nodes.map((n,i)=>(

<Sphere

key={i}

position={n}

args={[0.04]}

>

<meshStandardMaterial

color="#a5f3fc"

emissive="#22d3ee"

/>

</Sphere>


))}



<Line

points={nodes}

/>

</>

)

}







export default function ThreeHero(){


return (

<div className="h-[350px] w-full">


<Canvas

camera={{

position:[0,1,5],

fov:45

}}

>


<ambientLight intensity={1.5}/>


<directionalLight

position={[5,5,5]}

intensity={2}

/>



<Float

speed={2}

floatIntensity={0.5}

rotationIntensity={0.2}

>


<Laptop/>

</Float>



<Hologram/>


<Particles/>


<NeuralNetwork/>



</Canvas>


</div>


)

}