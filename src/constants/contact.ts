import { Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";

import { ContactInfo, SocialLink } from "@/types/contact";

export const contactInfo: ContactInfo[] = [
  {
    id: "email",
    label: "Email",
    value: "hello@dimasrizki.dev",
    href: "mailto:hello@dimasrizki.dev",
    icon: Mail,
  },
  {
    id: "phone",
    label: "Phone",
    value: "+62 812 3456 7890",
    href: "tel:+6281234567890",
    icon: Phone,
  },
  {
    id: "location",
    label: "Location",
    value: "Yogyakarta, Indonesia",
    href: "https://maps.google.com/?q=Yogyakarta,Indonesia",
    icon: MapPin,
  },
];

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com",
    icon: FaGithub,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
  },
  {
    id: "twitter",
    label: "X",
    href: "https://x.com",
    icon: FaXTwitter,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
];
