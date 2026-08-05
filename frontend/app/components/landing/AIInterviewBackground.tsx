"use client";

import { motion } from "framer-motion";

export default function AIInterviewBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      {/* Main glow */}
      <div
        className="
        absolute
        left-1/2
        top-40
        h-[600px]
        w-[600px]
        -translate-x-1/2
        rounded-full
        bg-cyan-200/30
        blur-[120px]
        "
      />


      {/* Laptop */}
      <motion.div
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
        transition={{duration:1}}
        className="
        absolute
        left-1/2
        top-52
        -translate-x-1/2
        "
      >

        {/* Screen */}
        <div
          className="
          h-[230px]
          w-[380px]
          rounded-xl
          border
          border-slate-300
          bg-white/40
          shadow-2xl
          backdrop-blur-xl
          "
        >

          {/* AI Interview Window */}

          <div className="p-5">


            <div className="
            flex
            items-center
            gap-3
            "
            >

              {/* AI Avatar */}

              <div
              className="
              h-12
              w-12
              rounded-full
              bg-gradient-to-br
              from-cyan-400
              to-blue-500
              shadow-lg
              "
              />


              <div>

                <p className="text-sm font-semibold text-slate-700">
                  AI Interviewer
                </p>

                <p className="text-xs text-slate-500">
                  Technical Round
                </p>

              </div>

            </div>


            {/* Chat lines */}

            <div className="mt-8 space-y-3">

              <div className="
              h-3
              w-52
              rounded-full
              bg-slate-300/70
              "/>


              <div className="
              h-3
              w-72
              rounded-full
              bg-slate-200
              "/>


              <div className="
              h-3
              w-40
              rounded-full
              bg-cyan-300/50
              "/>


            </div>


          </div>


        </div>


        {/* Laptop base */}

        <div
        className="
        mx-auto
        h-5
        w-[450px]
        rounded-b-xl
        bg-slate-300/70
        "
        />


      </motion.div>



      {/* Floating AI circles */}


      <motion.div
      animate={{
        y:[0,-20,0]
      }}
      transition={{
        duration:4,
        repeat:Infinity
      }}
      className="
      absolute
      left-20
      top-48
      h-20
      w-20
      rounded-full
      bg-blue-200/40
      blur-sm
      "
      />


      <motion.div
      animate={{
        y:[0,25,0]
      }}
      transition={{
        duration:5,
        repeat:Infinity
      }}
      className="
      absolute
      right-32
      top-60
      h-28
      w-28
      rounded-full
      bg-cyan-200/40
      blur-sm
      "
      />


      {/* AI connection lines */}

      <div
      className="
      absolute
      right-20
      bottom-40
      h-32
      w-32
      rounded-full
      border
      border-cyan-200/50
      "
      />


    </div>
  );
}