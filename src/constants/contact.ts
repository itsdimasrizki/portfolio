import { Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";

import { ContactInfo, SocialLink } from "@/types/contact";

export const contactInfo: ContactInfo[] = [
  {
    id: "email",
    label: "Email",
    value: "dimasrizkia477@gmail.com",
    href: "mailto:dimasrizkia477@gmail.com",
    icon: Mail,
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
    href: "https://github.com/itsdimasrizki",
    icon: FaGithub,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dimas-rizki-ardiansyah-28580233b/",
    icon: FaLinkedinIn,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/drzkyyy__/",
    icon: FaInstagram,
  },
];
