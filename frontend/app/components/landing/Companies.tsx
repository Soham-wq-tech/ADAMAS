"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

<<<<<<< HEAD

=======
>>>>>>> origin/main
const companies = [
  {
    name: "Google",
    description:
      "AI interview simulation inspired by Google's problem-solving focused engineering interviews.",
    topics: ["DSA", "Algorithms", "System Design"],
  },
<<<<<<< HEAD

=======
>>>>>>> origin/main
  {
    name: "Microsoft",
    description:
      "Practice Microsoft's technical interview style with coding and engineering fundamentals.",
    topics: ["DSA", "OOP", "Problem Solving"],
  },
<<<<<<< HEAD

=======
>>>>>>> origin/main
  {
    name: "Meta",
    description:
      "Experience fast-paced interviews focused on optimized coding solutions.",
    topics: ["DSA", "Optimization", "System Design"],
  },
<<<<<<< HEAD

=======
>>>>>>> origin/main
  {
    name: "Amazon",
    description:
      "Prepare with technical rounds inspired by Amazon's hiring process.",
    topics: ["DSA", "Leadership", "System Design"],
  },
<<<<<<< HEAD

  {
    name: "TCS",
    description:
      "Practice common patterns asked in service-based company interviews.",
    topics: ["Programming", "CS Fundamentals", "HR"],
  },

  {
    name: "IBM",
    description:
      "Explore interviews focused on software engineering and modern technologies.",
    topics: ["Programming", "Cloud", "Databases"],
  },
];


=======
  {
    name: "NVIDIA",
    description:
      "Experience specialized interviews focused on high-performance computing and optimized coding.",
    topics: ["DSA", "Optimization", "System Design"],
  },
  {
    name: "Apple",
    description:
      "Tackle rigorous engineering interview questions centered around deep product and system architecture.",
    topics: ["Coding", "Architecture", "Problem Solving"],
  },
  {
    name: "Atlassian",
    description:
      "Practice collaboration-driven engineering problem-solving and software design patterns.",
    topics: ["DSA", "System Design", "Collaboration"],
  },
];

>>>>>>> origin/main
const otherCompanies = [
  "Adobe",
  "Flipkart",
  "Accenture",
  "Infosys",
  "Oracle",
  "Samsung",
];

<<<<<<< HEAD

export default function Companies() {

  return (

=======
export default function Companies() {
  return (
>>>>>>> origin/main
    <section
      id="companies"
      className="
      relative
      overflow-hidden
      bg-black
      px-6
      py-28
      "
    >
<<<<<<< HEAD


      {/* Background Glow */}

      <motion.div

        animate={{
          x:[0,30,0],
          y:[0,-20,0]
        }}

        transition={{
          duration:8,
          repeat:Infinity,
          ease:"easeInOut"
        }}

=======
      {/* Background Glow */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
>>>>>>> origin/main
        className="
        absolute
        left-1/2
        top-20
        h-[350px]
        w-[500px]
        -translate-x-1/2
        rounded-full
        bg-cyan-500/10
        blur-[120px]
        "
<<<<<<< HEAD

      />



=======
      />

>>>>>>> origin/main
      <div className="
      relative
      z-10
      mx-auto
      max-w-6xl
      ">
<<<<<<< HEAD



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


=======
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          viewport={{
            once: true,
          }}
          className="
          text-center
          "
        >
>>>>>>> origin/main
          <p className="
          text-sm
          tracking-[0.3em]
          text-cyan-400
          ">
            COMPANIES
          </p>

<<<<<<< HEAD


=======
>>>>>>> origin/main
          <h2 className="
          mt-4
          text-4xl
          font-bold
          text-white
          md:text-5xl
          ">
<<<<<<< HEAD

            Train For Real Company Interviews

          </h2>



=======
            Train For Real Company Interviews
          </h2>

>>>>>>> origin/main
          <p className="
          mx-auto
          mt-5
          max-w-2xl
          text-slate-400
          ">
<<<<<<< HEAD

            Our AI interviewer adapts to different company interview
            patterns, difficulty levels and evaluation styles.

          </p>


        </motion.div>





        {/* Company Cards */}


        <motion.div


          initial="hidden"

          whileInView="visible"

          viewport={{
            once:true,
            amount:0.2
          }}


          variants={{
            hidden:{},

            visible:{
              transition:{
                staggerChildren:0.15
              }
            }
          }}


=======
            Our AI interviewer adapts to different company interview
            patterns, difficulty levels and evaluation styles.
          </p>
        </motion.div>

        {/* Company Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
>>>>>>> origin/main
          className="
          mt-16
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-3
          "
<<<<<<< HEAD

        >



          {companies.map((company)=>(


            <motion.div


              key={company.name}


              variants={{
                hidden:{
                  opacity:0,
                  y:50
                },

                visible:{
                  opacity:1,
                  y:0,

                  transition:{
                    duration:0.7,
                    ease:[0.22,1,0.36,1]
                  }
                }
              }}


=======
        >
          {companies.map((company) => (
            <motion.div
              key={company.name}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 50,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
>>>>>>> origin/main
              className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
              backdrop-blur-xl
              "
<<<<<<< HEAD


            >



=======
            >
>>>>>>> origin/main
              <div className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-cyan-400/10
              ">
<<<<<<< HEAD

=======
>>>>>>> origin/main
                <Brain
                  size={24}
                  className="text-cyan-400"
                />
<<<<<<< HEAD

              </div>




=======
              </div>

>>>>>>> origin/main
              <h3 className="
              mt-6
              text-2xl
              font-semibold
              text-white
              ">
<<<<<<< HEAD

                {company.name}

              </h3>




=======
                {company.name}
              </h3>

>>>>>>> origin/main
              <p className="
              mt-3
              text-sm
              leading-relaxed
              text-slate-400
              ">
<<<<<<< HEAD

                {company.description}

              </p>




=======
                {company.description}
              </p>

>>>>>>> origin/main
              <div className="
              mt-5
              flex
              flex-wrap
              gap-2
              ">
<<<<<<< HEAD


                {company.topics.map((topic)=>(

                  <span

                    key={topic}

=======
                {company.topics.map((topic) => (
                  <span
                    key={topic}
>>>>>>> origin/main
                    className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-1
                    text-xs
                    text-slate-300
                    "
<<<<<<< HEAD

                  >

                    {topic}

                  </span>

                ))}


              </div>



            </motion.div>


          ))}


        </motion.div>







        {/* Other Companies */}



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



=======
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Other Companies */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          viewport={{
            once: true,
          }}
>>>>>>> origin/main
          className="
          mt-10
          rounded-2xl
          border
          border-white/10
          bg-white/[0.02]
          p-8
          text-center
          "
<<<<<<< HEAD


        >



=======
        >
>>>>>>> origin/main
          <h3 className="
          text-xl
          font-semibold
          text-white
          ">
<<<<<<< HEAD

            And Many More

          </h3>




=======
            And Many More
          </h3>

>>>>>>> origin/main
          <p className="
          mt-3
          text-slate-400
          ">
<<<<<<< HEAD

            More company-specific interview rooms will be added soon.

          </p>




=======
            More company-specific interview rooms will be added soon.
          </p>

>>>>>>> origin/main
          <div className="
          mt-5
          flex
          flex-wrap
          justify-center
          gap-3
          ">
<<<<<<< HEAD


            {otherCompanies.map((company)=>(

              <span

                key={company}

=======
            {otherCompanies.map((company) => (
              <span
                key={company}
>>>>>>> origin/main
                className="
                rounded-full
                bg-white/5
                px-4
                py-2
                text-sm
                text-slate-400
                "
<<<<<<< HEAD

              >

                {company}

              </span>

            ))}


          </div>



        </motion.div>




      </div>


    </section>

=======
              >
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
>>>>>>> origin/main
  );
}