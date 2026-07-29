"use client";

import { motion } from "framer-motion";

import { Certificate } from "@/types/certificate";
import { CertificateCard } from "./certificate-card";
import { staggerContainer, staggerItem } from "@/lib/motion";

type CertificateGridProps = {
  certificates: Certificate[];
};

export function CertificateGrid({ certificates }: CertificateGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {certificates.map((certificate) => (
        <motion.div key={certificate.id} variants={staggerItem}>
          <CertificateCard certificate={certificate} />
        </motion.div>
      ))}
    </motion.div>
  );
}

