"use client";

import { motion } from "framer-motion";

import { heroItem, easeOutSoft } from "@/lib/motion";
import { BlurImage } from "@/components/motion/blur-image";

export function HeroImage() {
  return (
    <motion.div
      custom={4}
      variants={heroItem}
      initial="hidden"
      animate="visible"
      className="flex justify-center"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: easeOutSoft }}
        className="relative aspect-[4/5] w-full max-w-md overflow-hidden [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]"
      >
        <BlurImage
          src="/images/profile/profile.jpeg"
          alt="Dimas Rizki"
          fill
          priority
          className="object-cover object-top"
        />
      </motion.div>
    </motion.div>
  );
}

