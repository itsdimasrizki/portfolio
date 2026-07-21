"use client";

import Tilt from "react-parallax-tilt";
import { HeroStats } from "./hero-stats";
import Image from "next/image";

<Image
  src="/images/profile/profile.jpeg"
  alt="Your Name"
  fill
  priority
  className="object-cover"
/>

export function HeroImage() {
  return (
    <div className="space-y-6">
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
            alt="Your Name"
            fill
            priority
            className="object-cover"
        />
    </div>
      </Tilt>

      <HeroStats />
    </div>
  );
}