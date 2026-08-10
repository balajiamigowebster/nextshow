import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import StreamingReviewCard from "./StreamingReviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper core styles
import "swiper/css";

// ==========================================
// 1. CAROUSEL ROW SUB-COMPONENT (SWIPER)
// ==========================================
const CarouselRow = ({ title, movies, onSeeAll }) => {
  const [swiper, setSwiper] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check Swiper progress to toggle navigation arrows
  const updateArrowVisibility = (s) => {
    if (s) {
      setShowLeftArrow(!s.isBeginning);
      setShowRightArrow(!s.isEnd);
    }
  };

  useEffect(() => {
    if (swiper) {
      updateArrowVisibility(swiper);
    }
  }, [swiper, movies]);

  const handlePrev = () => {
    if (swiper) swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiper) swiper.slideNext();
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group mb-8  last:mb-0">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1.5 text-white hover:text-orange-400 transition-colors group/title focus:outline-none text-left"
        >
          {/* <div className="relative pl-12">
      
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <h3 className="origin-left -rotate-90 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-orange-400 whitespace-nowrap">
                {title}
              </h3>
            </div>
          </div> */}
          {/* <ChevronRight
            size={18}
            className="text-gray-500 group-hover/title:translate-x-1 group-hover/title:text-orange-400 transition-all duration-300"
          /> */}
        </button>

        {movies.length > 4 && (
          <button
            onClick={onSeeAll}
            className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
          >
            See All
          </button>
        )}
      </div>

      {/* Swiper Slider Wrapper */}
      <div className="relative overflow-hidden px-1  py-1">
        {/* LEFT */}
        {showLeftArrow && (
          <div
            className="
      absolute
      -left-6
      top-0
      bottom-0
      w-10
      md:w-14
      z-[8]
      rounded-tl-2xl
      pointer-events-none
      bg-gradient-to-r
      from-zinc-900
      via-zinc-950
      to-transparent
    "
          />
        )}

        {/* RIGHT */}
        {showRightArrow && (
          <div
            className="
      absolute
      -right-6
      top-0
      bottom-0
      w-10
      md:w-14
      z-[8]
      rounded-tr-2xl
      pointer-events-none
      bg-gradient-to-l
      from-zinc-900
      via-zinc-950
      to-transparent
    "
          />
        )}
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-black/75 hover:bg-black/95 text-white p-2 rounded-r-lg border-y border-r border-gray-800 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hidden md:flex items-center justify-center hover:scale-105"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-black/75 hover:bg-black/95 text-white p-2 rounded-l-lg border-y border-l border-gray-800 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hidden md:flex items-center justify-center hover:scale-105"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Swiper Component */}
        <Swiper
          onSwiper={setSwiper}
          onSlideChange={updateArrowVisibility}
          onProgress={updateArrowVisibility}
          grabCursor={true} // Allows dragging with mouse on desktop
          watchSlidesProgress={true}
          breakpoints={{
            0: {
              slidesPerView: 2.2, // 2 full cards + peek
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 4.2,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 4.2,
              spaceBetween: 16,
            },
          }}
          className="streaming-swiper !overflow-visible"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id || movie.slug}>
              <StreamingReviewCard review={movie} title={title} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const SectionTitle = ({ smallTitle = "", title = "", className = "" }) => {
  return (
    <div className={`ml-3 flex items-center gap-3 ${className}`}>
      {/* Left Accent */}
      <div
        className="
          w-1
          self-stretch
          rounded-full
          bg-gradient-to-b
          from-orange-500
          via-orange-200
          to-orange-500
        "
      />

      {/* Text */}
      <div className="flex flex-col">
        <span
          className="
            text-[9px]
            md:text-[11px]
            uppercase
            tracking-[0.35em]
            text-zinc-500
            font-semibold
          "
        >
          {smallTitle}
        </span>

        <h2
          className="
            text-[15px]
            md:text-[20px]
            font-black
            uppercase
            tracking-widest
            bg-gradient-to-r
            from-zinc-600
            via-zinc-300
            to-zinc-600
            bg-clip-text
            text-transparent
          "
        >
          {title}
        </h2>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN SECTION COMPONENT
// ==========================================
const MovieStreamingSection = ({ activeItems, streamingData }) => {
  const upcomingMovies = streamingData?.upcoming || [];
  const newReleases = streamingData?.newRelease || [];
  const trendingNow = streamingData?.trending || [];

  const [isOpen, setIsOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState({
    mainTitle: "Streaming Now",
    subTitle: "",
    data: [],
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const openDrawer = (title, data) => {
    setSidebarContent({ mainTitle: "Streaming Now", subTitle: title, data });
    setIsOpen(true);
  };

  const hasMovies =
    trendingNow.length > 0 ||
    newReleases.length > 0 ||
    upcomingMovies.length > 0;

  const EmptyState = ({ message }) => {
    const [cardCount, setCardCount] = useState(4);

    useEffect(() => {
      const updateCardCount = () => {
        if (window.innerWidth < 768) {
          setCardCount(2); // Mobile
        } else if (window.innerWidth < 1280) {
          setCardCount(3); // Tablet
        } else {
          setCardCount(4); // Desktop
        }
      };

      updateCardCount();

      window.addEventListener("resize", updateCardCount);

      return () => window.removeEventListener("resize", updateCardCount);
    }, []);

    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 px-2 md:gap-4">
          {Array.from({ length: cardCount }).map((_, index) => (
            <div
              key={index}
              className="
               rounded-2xl
               border
               border-zinc-800
               overflow-hidden
               bg-gradient-to-b
               from-zinc-900
               to-zinc-950
             "
            >
              {/* Thumbnail */}
              <div
                className="
                 h-36 sm:h-44 md:h-52
                 bg-zinc-800/40
                 border-b
                 border-zinc-800
                 flex
                 items-center
                 justify-center
               "
              >
                <span className="text-zinc-600 text-xs uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>

              {/* Content */}
              <div className="p-3 md:p-4">
                <div className="h-5 w-3/4 rounded bg-zinc-800 mb-3" />

                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-14 rounded bg-zinc-800" />
                  <div className="h-6 w-16 rounded bg-zinc-800" />
                </div>

                <div className="space-y-3">
                  <div className="h-4 rounded bg-zinc-800 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-6">
           <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.25em]">
             {message}
           </p>
         </div> */}
      </div>
    );
  };

  return (
    <div className="bg-[#0f0f0f] pt-5 pb-5 px-4 md:px-8">
      <div className="flex items-center justify-between  shrink-0">
        <SectionTitle smallTitle="Streaming" title="Trending" />
      </div>

      {hasMovies ? (
        <div className="space-y-8">
          {/* 1. Trending Now Carousel */}
          <CarouselRow
            title="Trending Now"
            movies={trendingNow}
            onSeeAll={() => openDrawer("Trending Now", trendingNow)}
          />
        </div>
      ) : (
        <EmptyState message="No new movies found" />
      )}

      {/* SIDEBAR / DRAWER COMPONENT (Standard 2-Column Grid Layout) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-[#0f0f0f] border-l border-gray-800 shadow-2xl z-[100] flex flex-col"
            >
              {/* Header */}
              <div className="py-4 px-6  mt-20   bg-[#121212]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {/* Gradient Bar */}
                    <div className="w-1 h-5 md:h-7 rounded-full bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500" />

                    {/* Heading */}
                    <h3 className="text-[15px] md:text-[20px] font-black uppercase tracking-widest bg-gradient-to-r from-zinc-600 via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
                      {sidebarContent.subTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6  custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 pb-20 md:pb-14">
                  {sidebarContent.data.map((movie) => (
                    <motion.div
                      key={movie.id || movie.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StreamingReviewCard
                        review={movie}
                        title="Trending Now"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Styled JSX (Custom Scrollbars) */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff7d3b;
        }
      `}</style>
    </div>
  );
};

export default MovieStreamingSection;
