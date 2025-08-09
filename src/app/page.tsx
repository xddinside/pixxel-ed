"use client";

import { useRef } from "react";
import "./page.css";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import SplitText from "gsap/SplitText";
import { useEffect } from "react";

gsap.registerPlugin(useGSAP);

const Home= () =>{

useGSAP(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Select all headings
  document.querySelectorAll(".animated-heading").forEach((heading) => {
    const split = new SplitText(heading, {
      type: "words,chars",
      wordsClass: "word",
      charsClass: "letter"
    });

    gsap.fromTo(
      split.chars,
      {
        y: 50,
        opacity: 0,
        color:"rgba(255,255,255,0)",
        "-webkit-text-stroke": "2px white"
      },
      {
        y: 0,
        opacity: 1,
        color: "var(--foreground)",
        "-webkit-text-stroke": "2px transparent",
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: heading, // unique trigger per heading
          start: "top 50%",
          end: "top -80%",
          pin: true,
          scrub: 1
        }
      }
    );
  });
});

  const brandName = "PixxelEd";

  // Container animation — waits and triggers each child letter in sequence
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // delay between letters
      },
    },
  };

  // Each letter's animation
  const letterVariants = {
    hidden: { opacity: 0, y: 100, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="page">

      <div className="section">
        <motion.h1
          className="font-bold tracking-wider"
          style={{ perspective: "1000px" }} // for 3D rotation
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {brandName.split("").map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className={
                index >= brandName.length - 2 ? "text-blue-500 inline-block" : "inline-block"
              }
            >
              {letter}
            </motion.span>          
          ))}
        </motion.h1>

        <h3>“Connecting learners with mentors to unlock your true potential.”</h3>

        <div className="card-container">
          <div className="card">
            <div className="card-heading">Connect</div>
            <div className="card-content">Learning becomes easier when knowledge finds you.</div>
          </div>
          <div className="card">
            <div className="card-heading">Grow</div>
            <div className="card-content">Your potential expands with the right guidance.</div>
          </div>
          <div className="card">
            <div className="card-heading">Achieve</div>
            <div className="card-content">Every goal is reachable with the right mentor.</div>
          </div>
        </div>


      </div>

      <div className="animation-space-100"></div>

      <div className="section">
        <div className="animated-heading">FOR MENTORS</div>
        <div className="animation-space-130"></div>
        <h3>Inspire, guide, and shape future leaders.</h3>

          <div className="card-container">
          <div className="card">
            <div className="card-heading">Guide</div>
            <div className="card-content">Your experience can light the way for others.</div>
          </div>
          <div className="card">
            <div className="card-heading">Inspire </div>
            <div className="card-content">Motivate learners to aim higher and dream bigger.</div>
          </div>
          <div className="card">
            <div className="card-heading">Impact </div>
            <div className="card-content">Change lives through your wisdom and insight.</div>
          </div>
        </div>

      </div>

      <div className="animation-space-100 "></div>

      <div className="section">
        <div className="animated-heading">FOR STUDENTS</div>
        <div className="animation-space-130"></div>
        <h3>“Learn smarter, grow faster with expert mentorship.”</h3>

                  <div className="card-container">
          <div className="card">
            <div className="card-heading">Explore</div>
            <div className="card-content">Find the mentor who fits your learning journey.</div>
          </div>
          <div className="card">
            <div className="card-heading">Learn</div>
            <div className="card-content">Gain skills faster with personal guidance.</div>
          </div>
          <div className="card">
            <div className="card-heading">Excel</div>
            <div className="card-content">Turn knowledge into achievements you’re proud of.</div>
          </div>
        </div>

      </div>
      <div className="section"></div>

    </div>
  );

}

export default Home;
