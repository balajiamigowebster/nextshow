import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import UpdateUpcommingCard from "./UpdateUpcommingCard";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

// ==========================================
// 1. CAROUSEL ROW — mirrors MovieStreamingSection
// ==========================================
const CarouselRow = ({ title, movies, onSeeAll }) => {
  const [swiper, setSwiper] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = (s) => {
    if (s) {
      setShowLeftArrow(!s.isBeginning);
      setShowRightArrow(!s.isEnd);
    }
  };

  useEffect(() => {
    if (swiper) updateArrows(swiper);
  }, [swiper, movies]);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group mb-8 last:mb-0">
      {/* Row header */}
      {/* <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1.5 text-white hover:text-orange-400
            transition-colors group/title focus:outline-none text-left"
        />
        {movies.length > 4 && (
          <button
            onClick={onSeeAll}
            className="text-[10px] uppercase tracking-widest font-bold
              text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
          >
            See All
          </button>
        )}
      </div> */}

      {/* Swiper wrapper */}
      <div className="relative overflow-hidden px-1 py-1">
        {/* Left fade */}
        {showLeftArrow && (
          <div
            className="absolute -left-6 top-0 bottom-0 w-10 md:w-14 z-[8]
            rounded-tl-2xl pointer-events-none
            bg-gradient-to-r from-zinc-900 via-zinc-950 to-transparent"
          />
        )}
        {/* Right fade */}
        {showRightArrow && (
          <div
            className="absolute -right-6 top-0 bottom-0 w-10 md:w-14 z-[8]
            rounded-tr-2xl pointer-events-none
            bg-gradient-to-l from-zinc-900 via-zinc-950 to-transparent"
          />
        )}

        {/* Left arrow */}
        {showLeftArrow && (
          <button
            onClick={() => swiper?.slidePrev()}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10
              bg-black/75 hover:bg-black/95 text-white p-2
              rounded-r-lg border-y border-r border-gray-800 backdrop-blur-sm
              opacity-0 group-hover:opacity-100 transition-all duration-300
              shadow-lg hidden md:flex items-center justify-center hover:scale-105"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {/* Right arrow */}
        {showRightArrow && (
          <button
            onClick={() => swiper?.slideNext()}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10
              bg-black/75 hover:bg-black/95 text-white p-2
              rounded-l-lg border-y border-l border-gray-800 backdrop-blur-sm
              opacity-0 group-hover:opacity-100 transition-all duration-300
              shadow-lg hidden md:flex items-center justify-center hover:scale-105"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <Swiper
          onSwiper={setSwiper}
          onSlideChange={updateArrows}
          onProgress={updateArrows}
          grabCursor={true}
          watchSlidesProgress={true}
          breakpoints={{
            0: { slidesPerView: 2.2, spaceBetween: 10 },
            768: { slidesPerView: 4.2, spaceBetween: 12 },
            1024: { slidesPerView: 4.2, spaceBetween: 16 },
          }}
          className="upcoming-swiper !overflow-visible"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id || movie.slug}>
              <UpdateUpcommingCard movie={movie} title={title} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// ==========================================
// 2. EMPTY STATE — mirrors MovieStreamingSection
// ==========================================
const EmptyState = () => {
  const [cardCount, setCardCount] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setCardCount(2);
      else if (window.innerWidth < 1280) setCardCount(3);
      else setCardCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 px-1 md:gap-4">
      {Array.from({ length: cardCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-800 overflow-hidden
          bg-gradient-to-b from-zinc-900 to-zinc-950"
        >
          <div
            className="h-44 sm:h-44 md:h-52 bg-zinc-800/40 border-b border-zinc-800
            flex items-center justify-center"
          >
            <span className="text-zinc-600 text-xs uppercase tracking-widest">
              Coming Soon
            </span>
          </div>
          <div className="p-3 md:p-4">
            <div className="h-5 w-3/4 rounded bg-zinc-800 mb-3" />
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-14 rounded bg-zinc-800" />
              <div className="h-6 w-16 rounded bg-zinc-800" />
            </div>
            <div className="h-4 rounded bg-zinc-800 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 3. MAIN SECTION — mirrors MovieStreamingSection
// ==========================================
const UpdateStreamingUpcomming = ({ upcoming = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState({
    mainTitle: "Upcoming",
    subTitle: "",
    data: [],
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const openDrawer = (title, data) => {
    setSidebarContent({ mainTitle: "Upcoming", subTitle: title, data });
    setIsOpen(true);
  };

  return (
    <div className="px-1 relative ">
      {/* Section heading — same as MovieStreamingSection */}
      {/* <div className="flex items-center justify-between shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500" />
          <h2
            className="text-[15px] md:text-[20px] font-black uppercase tracking-widest
            bg-gradient-to-r from-zinc-600 via-zinc-300 to-zinc-600
            bg-clip-text text-transparent"
          >
            Upcoming
          </h2>
        </div>
      </div> */}

      {upcoming.length > 4 && (
        <button
          onClick={() => openDrawer("Upcoming Movies", upcoming)}
          className="
      absolute
      -top-7
      right-2
      md:right-4
      z-20
text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors
    "
        >
          See All
        </button>
      )}

      {upcoming.length > 0 ? (
        <div className="space-y-8">
          <CarouselRow
            title="Upcoming"
            movies={upcoming}
            onSeeAll={() => openDrawer("Upcoming Movies", upcoming)}
          />
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Drawer — same structure as MovieStreamingSection */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[450px]
                bg-[#0f0f0f] border-l border-gray-800 shadow-2xl z-[100] flex flex-col"
            >
              {/* Drawer header */}
              <div className="py-4 px-6 mt-20 bg-[#121212]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-5 md:h-7 rounded-full
                      bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500"
                    />
                    <h3
                      className="text-[15px] md:text-[20px] font-black uppercase tracking-widest
                      bg-gradient-to-r from-zinc-600 via-zinc-300 to-zinc-600
                      bg-clip-text text-transparent"
                    >
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

              {/* Drawer scrollable content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 pb-20 md:pb-14">
                  {sidebarContent.data.map((movie) => (
                    <motion.div
                      key={movie.id || movie.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <UpdateUpcommingCard movie={movie} title="Upcoming" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

export default UpdateStreamingUpcomming;
