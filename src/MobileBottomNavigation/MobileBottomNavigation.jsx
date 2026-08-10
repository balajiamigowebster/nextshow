import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiUser, HiSearch } from "react-icons/hi";
import MobileNavItem from "./MobileNavItem";
import { SiHomeadvisor } from "react-icons/si";
import { CiStreamOn } from "react-icons/ci";
import { BiSolidCameraMovie } from "react-icons/bi";
import { PiNewspaperClipping } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Home", path: "/", icon: SiHomeadvisor },
  { label: "News", path: "/news", icon: PiNewspaperClipping },
  { label: "Search", path: "#search", icon: HiSearch, type: "search" },
  { label: "Stream", path: "/stream", icon: CiStreamOn },
  { label: "Movies", path: "/new", icon: BiSolidCameraMovie },
];

// SVG notch path generator — moves the curved dip to activeIndex position
const getNotchPath = (activeIndex, total = 5) => {
  const W = 390;
  const H = 80;
  const slotW = W / total;
  const cx = slotW * activeIndex + slotW / 2;
  const r = 28; // notch radius
  const depth = 28;
  return [
    `M0,0`,
    `L${cx - r - 18},0`,
    `Q${cx - r - 4},0 ${cx - r + 2},${depth * 0.32}`,
    `Q${cx - 6},${depth} ${cx},${depth}`,
    `Q${cx + 6},${depth} ${cx + r - 2},${depth * 0.32}`,
    `Q${cx + r + 4},0 ${cx + r + 18},0`,
    `L${W},0 L${W},${H} L0,${H} Z`,
  ].join(" ");
};

const MobileBottomNavigation = () => {
  const location = useLocation();
  // const [showNav, setShowNav] = useState(true);
  const { isAuthenticated, authChecked, currentUser } = useSelector(
    (state) => state.userAuth,
  );
  const lastScrollY = useRef(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
  //     if (currentScrollY < 80) {
  //       setShowNav(true);
  //     } else if (currentScrollY > lastScrollY.current) {
  //       setShowNav(false);
  //     } else {
  //       setShowNav(true);
  //     }
  //     lastScrollY.current = currentScrollY;
  //   };
  //   window.addEventListener("scroll", handleScroll, { passive: true });
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;
    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  const { openAuth } = useAuth();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const { isMobileSearchOpen } = useSearch();

  const activeIndex = isMobileSearchOpen
    ? navItems.findIndex((item) => item.type === "search")
    : navItems.findIndex((item) =>
        item.type === "profile"
          ? location.pathname.startsWith("/profile")
          : isActive(item.path),
      );

  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <motion.div
      // animate={{ y: showNav ? 0 : 100, opacity: showNav ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* SVG curved notch container */}
      <div className="relative w-full" style={{ height: 80 }}>
        {/* Animated SVG notch background */}
        <svg
          viewBox="0 0 390 80"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="navBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1c1f" />
              <stop offset="100%" stopColor="#0f0f12" />
            </linearGradient>
            {/* Blue glow filter for active float */}
            <filter id="blueGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animated notch path */}
          <motion.path
            animate={{ d: getNotchPath(safeIndex) }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            fill="url(#navBg)"
          />

          {/* Top border — left of notch */}
          <motion.line
            animate={{ x2: (390 / 5) * safeIndex + 390 / 5 / 2 - 46 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            x1="0"
            y1="0.5"
            y2="0.5"
            stroke="#3f3f46"
            strokeWidth="0.6"
          />
          {/* Top border — right of notch */}
          <motion.line
            animate={{ x1: (390 / 5) * safeIndex + 390 / 5 / 2 + 46 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            x2="390"
            y1="0.5"
            y2="0.5"
            stroke="#3f3f46"
            strokeWidth="0.6"
          />

          {/* Glass sheen */}
          <rect
            x="0"
            y="0"
            width="390"
            height="20"
            fill="url(#sheen)"
            opacity="0.04"
          />
        </svg>

        {/* Nav items row */}
        <div className="absolute inset-0 flex items-end justify-around pb-2.5 px-1">
          {navItems.map((item, i) => (
            <MobileNavItem
              key={item.path}
              {...item}
              active={activeIndex === i}
              isAuthenticated={isAuthenticated}
              openAuth={openAuth}
              authChecked={authChecked}
              currentUser={currentUser}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileBottomNavigation;
