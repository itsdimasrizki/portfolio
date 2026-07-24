"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";

import { HeroStats } from "./hero-stats";
import { heroItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function HeroImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      custom={4}
      variants={heroItem}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        perspective={1200}
        glareEnable
        glareMaxOpacity={0.08}
        glareColor="#ffffff"
        glarePosition="all"
        scale={1.02}
        transitionSpeed={1500}
        className="rounded-3xl"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image
            src="/images/profile/profile.jpeg"
            alt="Dimas Rizki"
            fill
            priority
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              loaded ? "scale-100 blur-0" : "scale-105 blur-lg"
            )}
          />
        </div>
      </Tilt>

      <HeroStats />
    </motion.div>
  );
}
