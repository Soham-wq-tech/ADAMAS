"use client";

import { motion } from "framer-motion";
import { Building2, Bot, BarChart3 } from "lucide-react";


const steps = [
  {
    number: "01",
    title: "Choose Your Interview Room",
    description:
      "Select the company environment you want to practice. Each room has a different interview style, difficulty and questioning pattern.",
    icon: Building2,
  },

  {
    number: "02",
    title: "Face Your AI Interviewer",
    description:
      "Enter a realistic interview simulation where AI asks questions, follows up and adapts according to your answers.",
    icon: Bot,
  },

  {
    number: "03",
    title: "Analyze Your Performance",
    description:
      "Receive detailed feedback with strengths, weaknesses and improvement areas after every interview.",
    icon: BarChart3,
  },
];



export default function HowItWorks(){


return(

<section

id="how-it-works"

className="
relative
overflow-hidden
bg-black
px-6
py-28
"

>



{/* Background Effect */}

<motion.div

animate={{
x:[0,-30,0],
y:[0,20,0]
}}

transition={{
duration:10,
repeat:Infinity,
ease:"easeInOut"
}}

className="
absolute
right-0
top-40
h-[350px]
w-[350px]
rounded-full
bg-blue-500/10
blur-[120px]
"

/>



<div className="
relative
z-10
mx-auto
max-w-6xl
">



{/* Heading */}


<motion.div

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:0.8
}}

viewport={{
once:true
}}

className="
text-center
"

>


<p className="
text-sm
tracking-[0.3em]
text-cyan-400
">

HOW IT WORKS

</p>



<h2 className="
mt-4
text-4xl
font-bold
text-white
md:text-5xl
">

From Preparation To The Real Interview

</h2>


<p className="
mx-auto
mt-5
max-w-2xl
text-slate-400
">

Experience a complete AI-powered interview journey before entering the real one.

</p>


</motion.div>







{/* Steps */}


<div className="
relative
mt-20
grid
gap-8
md:grid-cols-3
">



{/* Connecting Line */}

<div className="
absolute
left-1/2
top-16
hidden
h-px
w-[60%]
-translate-x-1/2
bg-white/10
md:block
"/>





{steps.map((step,index)=>{


const Icon = step.icon;


return(


<motion.div


key={step.number}


initial={{
opacity:0,
y:60
}}


whileInView={{
opacity:1,
y:0
}}


transition={{
duration:0.7,
delay:index*0.15
}}


viewport={{
once:true
}}



className="
relative
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-8
backdrop-blur-xl
"



>



<div className="
flex
items-center
justify-between
">


<span className="
text-5xl
font-bold
text-white/10
">

{step.number}

</span>



<div className="
flex
h-14
w-14
items-center
justify-center
rounded-xl
bg-cyan-400/10
">

<Icon

size={28}

className="
text-cyan-400
"

/>


</div>



</div>





<h3 className="
mt-8
text-xl
font-semibold
text-white
">

{step.title}

</h3>




<p className="
mt-4
text-sm
leading-relaxed
text-slate-400
">

{step.description}

</p>



</motion.div>


)

})}



</div>



</div>



</section>


)

}