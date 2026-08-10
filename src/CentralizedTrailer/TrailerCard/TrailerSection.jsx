import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import TrailerCard from "./TrailerCard";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper core styles
import "swiper/css";
import TrailerPlayerModal from "./TrailerPlayerModal";

// ==========================================
// DUMMY TRAILER DATA (5 items) - API varum varaikkum test ku
// ==========================================
const DUMMY_TRAILERS = [
  {
    id: 1,
    slug: "sample-movie-one",
    title: "Sample Movie One",
    trailerType: "Official Trailer",
    youtubeUrl: "https://youtu.be/6hO9J9sAeJg?si=EmBr75AzQZUm7_K2",
    director: "Director A",
    cast: ["Actor A", "Actor B", "Actor C"],
    genres: ["Action", "Drama"],
    isNew: true,
  },
  {
    id: 2,
    slug: "sample-movie-two",
    title: "Sample Movie Two",
    trailerType: "Teaser",
    youtubeUrl: "https://youtu.be/6hO9J9sAeJg?si=EmBr75AzQZUm7_K2",
    director: "Director B",
    cast: ["Actor D", "Actor E"],
    genres: ["Thriller", "Mystery"],
    isUpcoming: true,
  },
  {
    id: 3,
    slug: "sample-movie-three",
    title: "Sample Movie Three",
    trailerType: "Official Trailer",
    youtubeUrl: "https://youtu.be/6hO9J9sAeJg?si=EmBr75AzQZUm7_K2",
    director: "Director C",
    cast: ["Actor F", "Actor G", "Actor H"],
    genres: ["Comedy", "Family"],
    isNew: true,
  },
  {
    id: 4,
    slug: "sample-movie-four",
    title: "Sample Movie Four",
    trailerType: "First Look",
    youtubeUrl: "https://youtu.be/6hO9J9sAeJg?si=EmBr75AzQZUm7_K2",
    director: "Director D",
    cast: ["Actor I", "Actor J"],
    genres: ["Romance"],
    isUpcoming: true,
  },
  {
    id: 5,
    slug: "sample-movie-five",
    title: "Sample Movie Five",
    trailerType: "Official Trailer",
    youtubeUrl: "https://youtu.be/6hO9J9sAeJg?si=EmBr75AzQZUm7_K2",
    director: "Director E",
    cast: ["Actor K", "Actor L", "Actor M"],
    genres: ["Action", "Sci-Fi"],
    isNew: true,
  },
];

// ==========================================
// 1. CAROUSEL ROW SUB-COMPONENT (SWIPER)
// ==========================================
const CarouselRow = ({ title, trailers, onSeeAll, onTrailerClick }) => {
  const [swiper, setSwiper] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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
  }, [swiper, trailers]);

  const handlePrev = () => {
    if (swiper) swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiper) swiper.slideNext();
  };

  if (!trailers || trailers.length === 0) return null;

  return (
    <div className="relative group mb-8 last:mb-0">
      {/* Row Header */}
      {/* <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1.5 text-white hover:text-orange-400 transition-colors group/title focus:outline-none text-left"
        ></button>

        {trailers.length > 4 && (
          <button
            onClick={onSeeAll}
            className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
          >
            See All
          </button>
        )}
      </div> */}

      {/* Swiper Slider Wrapper */}
      <div className="relative overflow-hidden ">
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
          grabCursor={true}
          watchSlidesProgress={true}
          breakpoints={{
            0: {
              slidesPerView: 2.2,
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
          className="trailer-swiper !overflow-visible"
        >
          {trailers.map((trailer, index) => (
            <SwiperSlide key={trailer.id || trailer.slug}>
              <TrailerCard
                trailer={trailer}
                title={title}
                onClick={() => onTrailerClick(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const TrailerLoading = () => {
  const [cardCount, setCardCount] = useState(4);

  useEffect(() => {
    const updateCardCount = () => {
      if (window.innerWidth < 768) {
        setCardCount(2);
      } else if (window.innerWidth < 1280) {
        setCardCount(3);
      } else {
        setCardCount(4);
      }
    };

    updateCardCount();

    window.addEventListener("resize", updateCardCount);

    return () => window.removeEventListener("resize", updateCardCount);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 px-2 md:gap-4">
      {Array.from({ length: cardCount }).map((_, index) => (
        <div
          key={index}
          className="
          rounded-2xl
          overflow-hidden
          border
          border-zinc-800
          bg-zinc-900
          animate-pulse
        "
        >
          {/* Thumbnail */}

          <div className="h-36 sm:h-44 md:h-52 bg-zinc-800" />

          {/* Body */}

          <div className="p-3 space-y-3">
            <div className="h-4 rounded bg-zinc-800 w-4/5" />

            <div className="flex gap-2">
              <div className="h-5 w-14 rounded bg-zinc-800" />
              <div className="h-5 w-16 rounded bg-zinc-800" />
            </div>

            <div className="border-t border-zinc-800 pt-2 space-y-2">
              <div className="flex gap-2">
                <div className="h-3 w-8 rounded bg-zinc-800" />
                <div className="h-3 flex-1 rounded bg-zinc-800" />
              </div>

              <div className="flex gap-2">
                <div className="h-3 w-8 rounded bg-zinc-800" />
                <div className="h-3 flex-1 rounded bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 2. MAIN SECTION COMPONENT
// ==========================================
const TrailerSection = ({ trailers = [], isLoading }) => {
  // const trailers = DUMMY_TRAILERS;

  console.log("Trailers", trailers);

  const [isOpen, setIsOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState({
    mainTitle: "Trailers",
    subTitle: "",
    data: [],
  });
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openPlayer = (index) => {
    setCurrentIndex(index);
    setIsPlayerOpen(true);
  };

  const formattedTrailers = trailers.map((item) => ({
    id: item.id,
    title: item.youtubeTitle?.split("|")?.shift()?.trim() || "",
    thumbnail: item.thumbnail,
    youtubeUrl: item.youtubeUrl,
    trailerType: item.mediaType,
    channelName: item.channelName,
    scheduleStatus: item.scheduleStatus,
    duration: item.duration,
    views: item.viewCount,
    publishedAt: item.publishedAt,
    viewCount: item.viewCount,
    commentCount: item.commentCount,
    likeCount: item.likeCount,
    isScheduled: item.isScheduled,
    isTrending: item.isTrending,
    lastSyncedAt: item.lastSyncedAt,
    mediaType: item.mediaType,
    scheduledReleaseAt: item.scheduledReleaseAt,
    scheduledThumbnail: item.scheduledThumbnail,
    scheduledTitle: item.scheduledTitle,
    scheduledYoutubeUrl: item.scheduledYoutubeUrl,
    movie: item.movie,
    isNew: false,
  }));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const openDrawer = (title, data) => {
    setSidebarContent({ mainTitle: "Trailers", subTitle: title, data });
    setIsOpen(true);
  };

  const hasTrailers = formattedTrailers.length > 0;

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
                  No Videos Found
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
    <div className="bg-[#0f0f0f] ">
      {/* {hasTrailers ? (
        <div className="space-y-8">
         
          <CarouselRow
            title="Latest Trailers"
            trailers={formattedTrailers}
            onSeeAll={() => openDrawer("Latest Trailers", formattedTrailers)}
          />
        </div>
      ) : (
        <EmptyState message="No trailers found" />
      )} */}

      {isLoading ? (
        <TrailerLoading />
      ) : hasTrailers ? (
        <div className="space-y-8">
          {/* Trailer Carousel */}
          <CarouselRow
            title="Latest Trailers"
            trailers={formattedTrailers}
            onSeeAll={() => openDrawer("Latest Trailers", formattedTrailers)}
            onTrailerClick={openPlayer}
          />
        </div>
      ) : (
        <EmptyState />
      )}

      {/* SIDEBAR / DRAWER */}
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
                    <div className="w-1 h-5 md:h-7 rounded-full bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500" />

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
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 pb-20 md:pb-14">
                  {sidebarContent.data.map((trailer) => (
                    <motion.div
                      key={trailer.id || trailer.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrailerCard trailer={trailer} title="Trailers" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <TrailerPlayerModal
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        trailers={formattedTrailers}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />

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

export default TrailerSection;
