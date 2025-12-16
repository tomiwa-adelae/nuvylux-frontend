import {
  IconLayout,
  IconUserCheck,
  IconSchool,
  IconCalendar,
  IconBook,
  IconUsers,
  IconUserCog,
  IconShield,
  IconClipboardList,
  IconClock,
  IconCreditCard,
  IconChartHistogram,
  IconSettings,
  IconDownload,
  IconDeviceLaptop,
  IconDeviceImacUp,
  IconAlertCircle,
  IconFileDescription,
  IconMessage,
  IconServerBolt,
  IconUsersGroup,
  IconCurrencyDollar,
  IconChartInfographic,
  IconNotebook,
  IconTrendingUp,
  IconWallet,
  IconChalkboardTeacher,
  IconFileCertificate,
  IconFileText,
  IconHome,
  IconChartBarPopular,
  IconArticle,
  IconShoppingCart,
  IconInfoCircle,
  IconTrophy,
  IconNews,
  IconBrandCodecov,
  IconStackMiddle,
  IconBriefcase,
  IconShoppingBag,
  IconMail,
} from "@tabler/icons-react";
import { Award } from "lucide-react";

export const homeNavLinks = [
  { slug: "/", label: "Home", icon: IconHome },
  { slug: "/about", label: "About", icon: IconAlertCircle },
  { slug: "/services", label: "Services", icon: IconBriefcase },
  { slug: "/marketplace", label: "Marketplace", icon: IconShoppingBag },
  { slug: "/contact", label: "Contact", icon: IconMail },
];

export const homeNavLinksMobile = [
  { slug: "/", label: "Home", icon: IconHome },
  { slug: "/about", label: "About", icon: IconAlertCircle },
  {
    slug: "/ecosystem",
    label: "Ecosystem",
    icon: IconStackMiddle,
    comingSoon: true,
  },
  {
    slug: "/services",
    label: "Services",
    icon: IconBriefcase,
    comingSoon: true,
  },
  {
    slug: "/marketplace",
    label: "Marketplace",
    icon: IconShoppingBag,
    comingSoon: true,
  },
  { slug: "/community", label: "Community", icon: IconUsers, comingSoon: true },
  { slug: "/contact", label: "Contact", icon: IconMail },
];

export const teamMembers = [
  {
    name: "Hannah Diei",
    role: "CEO",
    photo: "/assets/images/ceo.jpg",
    url: "",
  },
  {
    name: "Ayo Odunayo",
    role: "CFO",
    photo: "/assets/images/cfo.jpg",
    url: "",
  },
  {
    name: "Adeyemi Ayomide",
    role: "CMO",
    photo: "/assets/images/cmo.jpg",
    url: "",
  },
  {
    name: "Adaeze Pearl Muoghalu",
    role: "CCO",
    photo: "/assets/images/cco.jpg",
    url: "",
  },
  {
    name: "Nkechi Adaosi Agugua",
    role: "PM",
    photo: "/assets/images/pm.jpg",
    url: "",
  },
  {
    name: "Esomovie Rita",
    role: "OM",
    photo: "/assets/images/om.jpg",
    url: "",
  },
  {
    name: "Tomiwa Adelae",
    role: "Head of Technology",
    photo: "/assets/images/tomiwa-adelae.jpeg",
    url: "https://tomiwaadelae.com.ng",
  },
];

export const contactFormSubjects = [
  { value: "Creator Inquiry", label: "Creator Inquiry / Verification" },
  { value: "Partnership", label: "Partnership / Investment" },
  { value: "Press", label: "Media / Press" },
  { value: "Support", label: "General Support / Feedback" },
  { value: "Other", label: "Other" },
];

export const testimonials = [
  {
    image: "/assets/images/auth-1.jpg",
    testimony:
      "NUVYLUX doesn’t just feel like a brand, it feels like a movement. Every detail is intentional, refined, and empowering.",
    name: "Tomiwa Adelae",
    portfolio: "Creative Director",
  },
  {
    image: "/assets/images/auth-2.jpg",
    testimony:
      "From design to experience, NUVYLUX represents a new level of elegance. It’s where innovation and beauty truly meet.",
    name: "Aisha Bello",
    portfolio: "Beauty Entrepreneur",
  },
  {
    image: "/assets/images/auth-3.jpg",
    testimony:
      "NUVYLUX made me feel seen as a creator. The platform blends culture, creativity, and technology in a way that feels global and modern.",
    name: "Daniel Okafor",
    portfolio: "Fashion Creative",
  },
];
