import React, { useState, useEffect, useRef } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiVolumeOff,
  HiVolumeUp,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleRight, FaEye, FaPlay, FaPlus, FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import { ImSpinner9 } from "react-icons/im";

// Slick CSS imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TrendingNewsMobile, { MarqueeTags } from "./TrendingNewsMobile";

const getRelativeTime = (date) => {
  if (!date) return "";

  return moment(date).fromNow();
};

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/placeholder.jpg";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${IMAGE_BASE_URL}${imagePath}`;
};

const LanguageMarquee = ({ languages = [] }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;

      setShouldAnimate(
        contentRef.current.scrollWidth > containerRef.current.offsetWidth,
      );
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [languages]);

  return (
    <>
      <div ref={containerRef} className="overflow-hidden max-w-full">
        <div
          ref={contentRef}
          className="inline-block whitespace-nowrap"
          style={{
            animation: shouldAnimate ? "marquee 8s linear infinite" : "none",
          }}
        >
          {languages.map((lang, index) => (
            <React.Fragment key={lang}>
              <span>{lang}</span>

              {index !== languages.length - 1 && (
                <>
                  <span className="mx-2">•</span>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        @keyframes languageMarquee {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-35%);
          }
        }
      `}</style>
    </>
  );
};

export default function VideoDetailScreen({
  activeVideos,
  activeBlogs = [],
  trendingNews,
  trendingLoading,
  trendingError,
  trendingRefetch,
}) {
  // console.log("VideoDetails", trendingNews);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatchingFull, setIsWatchingFull] = useState(false);
  const [isBgMuted, setIsBgMuted] = useState(true); // Background video mute state
  const bgIframeRef = useRef(null); // Background loop iframe ref
  const fullIframeRef = useRef(null); // Full screen player iframe ref
  const [direction, setDirection] = useState(0); // 2. Direction track panna state
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const navigate = useNavigate();

  // Swipe gesture states
  const touchStartRef = useRef(null);

  // ✅ Extract and Merge Upcoming Trailers logic
  const upcomingTrailers = [
    ...(activeVideos?.theatrical?.upcoming || []),
    ...(activeVideos?.streaming?.upcoming || []),
  ];

  console.log("Video Details trailer", upcomingTrailers);

  const currentVideo = upcomingTrailers[currentIndex];

  const YT_ORIGIN = "https://www.youtube.com";

  // 1. Duration Logic (Empty-ah iruntha "TBA" + Dim style)
  const renderDuration = () => {
    const duration = currentVideo?.durationOrSeason;
    if (!duration || duration.trim() === "") {
      return <span className="text-white/40 italic">TBA</span>;
    }
    return <span>{duration}</span>;
  };

  // 2. Release Date Logic ("TBA" vantha "Coming Soon" + Dim style)
  const renderReleaseStatus = () => {
    const rDate =
      currentVideo?.theatreReleaseDate || currentVideo?.ottReleaseDate || "TBA";
    if (rDate === "TBA") {
      return (
        <span className="text-white/40 italic tracking-wider">coming soon</span>
      );
    }
    try {
      const year = new Date(rDate).getFullYear();
      return <span>{isNaN(year) ? "COMING SOON" : year}</span>;
    } catch (error) {
      return <span className="text-white/40 italic">coming soon</span>;
    }
  };

  // ✅ Function to send command to background loop iframe
  const sendBgCommand = (func) => {
    try {
      if (bgIframeRef.current?.contentWindow) {
        bgIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args: [] }),
          YT_ORIGIN,
        );
      }
    } catch (err) {
      console.warn("YT bg error:", err);
    }
  };

  // ✅ Function to send command to full player iframe
  const sendFullCommand = (func) => {
    try {
      if (fullIframeRef.current?.contentWindow) {
        fullIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args: [] }),
          YT_ORIGIN,
        );
      }
    } catch (err) {
      console.warn("YT full error:", err);
    }
  };

  // console.log("Current Video", upcomingTrailers);

  // ✅ Sync background volume state to the background iframe
  // useEffect(() => {
  //   if (!isWatchingFull) {
  //     const timer = setTimeout(() => {
  //       sendBgCommand(isBgMuted ? "mute" : "unMute");
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  //   return undefined;
  // }, [isBgMuted, currentIndex, isWatchingFull]);

  // ✅ Full video player
  const getFullVideoUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`;
  };

  // ✅ Extract YouTube ID
  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
    );
    return match && match[2].length === 11 ? match[2] : null;
  };

  // ✅ Background embed
  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&enablejsapi=1&playsinline=1&iv_load_policy=3`;
  };

  const handleWatchNow = () => {
    if (!currentVideo?.slug) return;
    navigate(`/movie/${currentVideo.slug}`);
  };
  const handleExitFullVideo = () => setIsWatchingFull(false);

  // ✅ Toggle background mute state
  const toggleVolume = () => {
    setIsBgMuted((prev) => {
      const next = !prev;
      if (!isWatchingFull) {
        sendBgCommand(next ? "mute" : "unMute");
      }
      return next;
    });
  };

  // 3. Slide variants logic
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0,
    }),
  };

  const paginate = (dir) => {
    setDirection(dir);
    setIsIframeLoaded(false);

    setCurrentIndex((prev) => {
      if (dir === 1 && prev < upcomingTrailers.length - 1) {
        return prev + 1;
      } else if (dir === -1 && prev > 0) {
        return prev - 1;
      }
      return prev; // boundary stop
    });
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const startX = touchStartRef.current;
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const distance = startX - endX;
    const minSwipeDistance = 50;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      paginate(1);
    } else if (isRightSwipe) {
      paginate(-1);
    }

    touchStartRef.current = null;
  };

  const handleBgIframeLoad = () => {
    setTimeout(() => {
      setIsIframeLoaded(true);
      sendBgCommand("playVideo");
      sendBgCommand(isBgMuted ? "mute" : "unMute");
    }, 800); // delay added
  };

  const handleFullIframeLoad = () => {
    if (fullIframeRef.current && fullIframeRef.current.contentWindow) {
      sendFullCommand("unMute");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[300px] md:h-[450px] text-white overflow-hidden mt-20 md:pt-[5px] ">
      {/* FULL VIDEO PLAYER OVERLAY */}
      {isWatchingFull && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <button
            onClick={handleExitFullVideo}
            className="absolute top-5 left-5 z-[110] bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-lg backdrop-blur-md transition"
          >
            ← Back
          </button>
          <iframe
            ref={fullIframeRef}
            key={`full-${currentVideo?.trailerUrl}`}
            src={getFullVideoUrl(currentVideo?.trailerUrl)}
            className="w-full h-[150%] -translate-y-[15%] object-cover scale-[1.4] opacity-80"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleFullIframeLoad}
          ></iframe>
        </div>
      )}

      {/* LEFT SIDE: MAIN PLAYER & MOVIE DETAILS */}
      <div className="w-full md:w-[65%] flex flex-col relative ">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[300px] md:h-full bg-black group overflow-hidden"
        >
          {/* ✅ YouTube Background Video */}
          {upcomingTrailers.length > 0 ? (
            <>
              {/* Backdrop image fallback */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-500"
                style={{ backgroundImage: `url(${getImageUrl(currentVideo?.backdropPath || currentVideo?.posterPath)})` }}
              />

              {!isWatchingFull && (
                <div className="absolute inset-0">
                  <iframe
                    ref={bgIframeRef}
                    key={`bg-${currentVideo?.trailerUrl}`}
                    src={getEmbedUrl(currentVideo?.trailerUrl)}
                    className="w-full h-[150%] -translate-y-[15%] object-cover scale-[1.4] pointer-events-none opacity-80"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              )}

              {/* Cinematic Overlays */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2c2e]/40 via-[#0a0d14]/40 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-transparent to-transparent pointer-events-none"></div>

              {/* ✅ VOLUME TOGGLE BUTTON */}
              <button
                onClick={toggleVolume}
                className="absolute right-6 bottom-12 md:bottom-20 lg:bottom-12 z-30 bg-black/40 hover:bg-white/20 p-3 rounded-full border border-white/10 transition-all active:scale-90"
                title={isBgMuted ? "Unmute background" : "Mute background"}
              >
                {isBgMuted ? (
                  <HiVolumeOff size={18} />
                ) : (
                  <HiVolumeUp size={18} className="text-orange-400" />
                )}
              </button>

              {/* Navigation Controls */}

              {upcomingTrailers.length > 1 && (
                <>
                  <button
                    onClick={() => paginate(-1)}
                    className={`absolute -left-2 top-1/2 md:left-1 -translate-y-1/2 z-30 p-2 rounded-full transition
        ${
          currentIndex === 0
            ? "bg-black/20 opacity-30 cursor-not-allowed"
            : "bg-black/40 hover:bg-white/10 cursor-pointer lg:opacity-0 group-hover:opacity-100"
        }
      `}
                  >
                    <HiChevronLeft className="text-lg md:text-2xl lg:text-3xl" />
                  </button>
                  {currentIndex < upcomingTrailers.length - 1 && (
                    <button
                      onClick={() => paginate(1)}
                      className="absolute -right-2 md:right-1 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-2 rounded-full hover:bg-white/10 cursor-pointer lg:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiChevronRight className="text-lg md:text-2xl lg:text-3xl" />
                    </button>
                  )}
                </>
              )}

              {/* ✅ MOVIE DETAILS SECTION (Image style implementation) */}
              <div className="absolute bottom-12 md:bottom-20 lg:bottom-12 right-6 left-auto z-20 max-w-[50%] md:max-w-[70%] md:left-12 md:right-auto space-y-2 md:space-y-4 text-right md:text-left flex flex-col items-end md:items-start">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-2 md:space-y-3 flex flex-col items-end md:items-start"
                  >
                    {/* Title / Logo Style */}
                    <div className="overflow-hidden max-w-full mb-1 md:mb-2">
                      <h1
                        className="text-lg md:text-3xl lg:text-4xl uppercase tracking-tighter drop-shadow-lg text-white whitespace-nowrap inline-block"
                        style={{
                          animation:
                            currentVideo?.title?.length > 20
                              ? "marquee 8s linear infinite"
                              : "none",
                        }}
                      >
                        {currentVideo?.title}
                      </h1>
                    </div>

                    {/* Metadata (IMDb, Year, Duration, Language) */}
                    <div className="flex flex-wrap items-center justify-end md:justify-start gap-2 md:gap-3 text-[9px] md:text-[13px] text-white/90">
                      <div className="flex items-center gap-1">
                        {renderReleaseStatus()}
                      </div>
                      <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-500 rounded-full"></span>
                      <div className="flex items-center">
                        {renderDuration()}
                      </div>
                      <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-500 rounded-full"></span>
                      <span className="border border-white/40 px-1.5 rounded text-[8px] md:text-[10px]">
                        {currentVideo?.certification || "U/A"}
                      </span>
                      <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-500 rounded-full"></span>
                      <div className="min-w-0">
                        <LanguageMarquee
                          languages={currentVideo?.language || []}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className="
                      hidden
                      lg:block
                      text-[12px]
                      md:text-[14px]
                      text-gray-300
                      leading-relaxed
                      max-w-xl
                      drop-shadow-md
                    "
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {currentVideo?.longDescription || "TBA"}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap items-center justify-end md:justify-start gap-1 text-[9px] md:text-[13px] text-white/80">
                      {currentVideo?.genres &&
                      currentVideo.genres.length > 0 ? (
                        currentVideo.genres.map((genre, idx) => (
                          <React.Fragment key={idx}>
                            <span
                              key={idx}
                              className="px-0.5 py-0.5 text-[10px] md:text-[12px] font-bold tracking-wider text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.9)] hover:drop-shadow-[0_0_15px_rgba(251,146,60,1)] transition-all duration-300 cursor-default"
                            >
                              {genre}
                            </span>
                            {idx < currentVideo.genres.length - 1 && (
                              <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-500 rounded-full"></span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <span>Action • Drama • Thriller</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end md:justify-start items-center gap-3 pt-2 md:pt-4">
                      <button
                        onClick={handleWatchNow}
                        className="bg-gradient-to-r from-orange-600 to-orange-300 hover:opacity-75 cursor-pointer text-white py-2 px-5 md:py-3 md:px-9 rounded-lg transition transform active:scale-95 shadow-xl flex items-center gap-2 text-xs md:text-base font-bold"
                      >
                        <FaPlay size={10} /> <span>WATCH NOW</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </> // ✅ EMPTY STATE ONLY LEFT SIDE
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[4px]">
              <div className="text-center group p-10">
                {/* Minimal Video Icon with Slash */}
                <div className="relative inline-flex mb-6">
                  <div className="p-5 bg-white/5 rounded-full   transition-all duration-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 group-hover:text-red-500 transition-colors duration-500"
                    >
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
                      <rect width="12" height="10" x="2" y="7" rx="2" />
                      <line
                        x1="2"
                        y1="2"
                        x2="22"
                        y2="22"
                        className="stroke-red-600 opacity-80"
                      />
                    </svg>
                  </div>

                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-red-600/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Clean Text Section */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-widest text-white uppercase italic">
                    Trailers Not Available
                  </h2>

                  <div className="flex justify-center items-center gap-3">
                    <div className="h-[1px] w-8 bg-gray-700" />
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                      Stay Tuned
                    </p>
                    <div className="h-[1px] w-8 bg-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: NEWS LIST */}
      <div className="w-full hidden md:flex md:w-[32%]   flex-col border-l mt-20 md:mt-0 border-zinc-800/50">
        <div className="p-5 flex flex-col h-full overflow-hidden">
          {/* ====================================================== */}
          {/* ✅ HEADER */}
          {/* ====================================================== */}

          <div className="flex items-center justify-between mb-5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-orange-500" />

              <h2 className="text-white text-[10px] lg:text-[12px] font-black uppercase tracking-widest">
                Trending News
              </h2>
            </div>

            <Link
              to="/news"
              className="text-[10px] flex items-center uppercase tracking-widest font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
            >
              View All
              <FaAngleRight size={14} />
            </Link>
          </div>

          {/* ====================================================== */}
          {/* ✅ SCROLL AREA */}
          {/* ====================================================== */}

          <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
            {/* ====================================================== */}
            {/* ✅ LOADING */}
            {/* ====================================================== */}

            {trendingLoading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <ImSpinner9 className="text-orange-500 text-3xl animate-spin" />
              </div>
            )}

            {/* ====================================================== */}
            {/* ✅ ERROR */}
            {/* ====================================================== */}

            {!trendingLoading && trendingError && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <p className="text-white/60 text-sm mb-4">
                  Failed to load trending news
                </p>

                <button
                  onClick={trendingRefetch}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ====================================================== */}
            {/* ✅ EMPTY */}
            {/* ====================================================== */}

            {!trendingLoading &&
              !trendingError &&
              trendingNews?.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                  <div className="text-4xl mb-4">📰</div>

                  <h3 className="text-white text-lg font-bold mb-2">
                    No Trending News
                  </h3>

                  <p className="text-white/35 text-sm leading-relaxed">
                    Trending news is not available right now.
                  </p>
                </div>
              )}

            {/* ====================================================== */}
            {/* ✅ TRENDING NEWS LIST */}
            {/* ====================================================== */}

            {!trendingLoading && !trendingError && trendingNews?.length > 0 && (
              <div className="space-y-4">
                {trendingNews?.map((news, index) => (
                  <Link
                    key={news?.id}
                    to={`/news/${news?.slug}`}
                    className="group flex gap-3 pb-4 transition-all"
                    style={{
                      borderBottom:
                        index !== trendingNews.length - 1
                          ? "0.5px solid rgba(255,255,255,0.08)"
                          : "none",
                    }}
                  >
                    {/* ====================================================== */}
                    {/* ✅ IMAGE */}
                    {/* ====================================================== */}

                    <div className="relative w-[64px] h-[46px] rounded-lg overflow-hidden shrink-0">
                      <img
                        src={getImageUrl(news?.newsImages?.[0])}
                        alt={news?.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* VIDEO ICON */}

                      {/* {news?.videoUrl?.length > 0 && (
                        <div
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <FaPlay size={9} className="text-white ml-[1px]" />
                        </div>
                      )} */}
                    </div>

                    {/* ====================================================== */}
                    {/* ✅ CONTENT */}
                    {/* ====================================================== */}

                    <div className="flex-1 min-w-0">
                      {/* CATEGORY */}

                      {/* <p className="text-[9px] uppercase tracking-[2px] text-orange-500 font-bold mb-1">
                        {news?.categories?.[0] || "News"}
                      </p> */}

                      {/* TITLE */}

                      <h3 className="text-[12px] leading-[1.45] text-white/80 font-semibold line-clamp-2 group-hover:text-white transition-all">
                        {news?.title}
                      </h3>

                      {/* META */}

                      <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-white/30">
                        <span>{news?.formattedDate}</span>

                        <div className="w-1 h-1 rounded-full bg-white/20" />

                        <span>{getRelativeTime(news?.publishedAt)}</span>

                        <div className="w-1 h-1 rounded-full bg-white/20" />

                        <span className="flex items-center gap-1">
                          <FaEye size={9} />
                          {news?.viewCount || 0}
                        </span>
                      </div>
                      {/* TAGS */}
                      {news?.tags?.length > 0 && (
                        <div className="overflow-hidden">
                          <MarqueeTags tags={news.tags} />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* MOBILE-ONLY: Trending News horizontal scroll grid */}
      <TrendingNewsMobile
        trendingNews={trendingNews}
        trendingLoading={trendingLoading}
        trendingError={trendingError}
        trendingRefetch={trendingRefetch}
      />
    </div>
  );
}
