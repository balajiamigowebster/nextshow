import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play } from "lucide-react";

// ─── Embed URL helper ───────────────────────────────────────────────────────
const getEmbedUrl = (url, videoId) => {
  if (videoId)
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  if (!url) return "";
  if (url.includes("/embed/"))
    return `${url}${url.includes("?") ? "&" : "?"}autoplay=1&rel=0`;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short)
    return `https://www.youtube.com/embed/${short[1]}?autoplay=1&rel=0`;
  const watch = url.match(/[?&]v=([^?&]+)/);
  if (watch)
    return `https://www.youtube.com/embed/${watch[1]}?autoplay=1&rel=0`;
  return "";
};

// ─── Filmstrip Item ──────────────────────────────────────────────────────────
const FilmstripItem = ({ trailer, isActive, onClick }) => (
  <button
    onClick={onClick}
    data-active={isActive ? "true" : "false"} // ✅ FIX 1: direct on button element
    className={`
      relative flex-shrink-0 w-20 md:w-24 aspect-video rounded-md overflow-hidden
      border-2 transition-all duration-300 outline-none
      ${
        isActive
          ? "border-orange-500 ring-2 ring-orange-500/40 scale-105"
          : "border-zinc-700 opacity-50 hover:opacity-75 hover:border-zinc-500"
      }
    `}
  >
    {trailer.thumbnail ? (
      <img
        src={trailer.thumbnail}
        alt={trailer.youtubeTitle || trailer.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
        <Play size={12} className="text-zinc-600" />
      </div>
    )}
    {isActive && <div className="absolute inset-0 bg-orange-500/10" />}
  </button>
);

// ─── Main Modal ──────────────────────────────────────────────────────────────
const TrailerPlayerModal = ({
  open,
  onClose,
  trailers = [],
  currentIndex = 0,
  setCurrentIndex,
}) => {
  const [playVideo, setPlayVideo] = useState(false);
  const filmstripRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const currentTrailer = useMemo(
    () => trailers?.[currentIndex] || null,
    [trailers, currentIndex],
  );

  useEffect(() => {
    setPlayVideo(false);
  }, [currentIndex]);

  // ✅ FIX 2: currentIndex change aana udane scroll — querySelector correct-a work aagum
  useEffect(() => {
    if (!filmstripRef.current) return;
    // Small timeout — DOM render complete aana pinbu scroll pannanum
    const timer = setTimeout(() => {
      const active = filmstripRef.current?.querySelector(
        "[data-active='true']",
      );
      if (active) {
        active.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (!open) return;
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < trailers.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) setCurrentIndex((p) => p - 1);
  }, [hasPrev, setCurrentIndex]);

  const goNext = useCallback(() => {
    if (hasNext) setCurrentIndex((p) => p + 1);
  }, [hasNext, setCurrentIndex]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, goPrev, goNext, onClose]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!open || !currentTrailer) return null;

  const {
    thumbnail,
    youtubeTitle,
    channelName,
    duration,
    youtubeUrl,
    videoId,
    viewCount,
    publishedAt,
    mediaType,
    trailerType,
  } = currentTrailer;

  const iframeUrl = getEmbedUrl(youtubeUrl, videoId);
  const formattedViews = Number(viewCount || 0).toLocaleString("en-IN");
  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
  const badgeLabel = trailerType || mediaType || "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/45 backdrop-blur-md p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex flex-col w-full max-w-5xl mx-auto px-3 md:px-6"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute -top-2 right-3 md:right-6 z-50 rounded-full bg-zinc-900/80 border border-zinc-700 p-2 text-white hover:bg-zinc-600 hover:border-zinc-500 transition-all duration-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Carousel Track */}
            <div className="relative flex items-center gap-2 md:gap-3 w-full">
              {/* Prev Peek */}
              <div className="hidden md:block w-[10%] flex-shrink-0">
                {hasPrev ? (
                  <button
                    onClick={goPrev}
                    className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-700 opacity-40 hover:opacity-65 transition-all duration-300 hover:scale-105 cursor-pointer"
                    aria-label="Previous trailer"
                  >
                    {trailers[currentIndex - 1]?.thumbnail ? (
                      <img
                        src={trailers[currentIndex - 1].thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800" />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                  </button>
                ) : (
                  <div className="w-full aspect-video" />
                )}
              </div>

              {/* Active Player */}
              <div className="flex-1 min-w-0">
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden  shadow-2xl">
                  {/* {badgeLabel && !playVideo && (
                    <span className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-zinc-200 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-zinc-600 pointer-events-none">
                      {badgeLabel}
                    </span>
                  )} */}
                  {duration && !playVideo && (
                    <span className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded pointer-events-none">
                      {duration}
                    </span>
                  )}
                  {!playVideo ? (
                    <>
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={youtubeTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <Play size={40} className="text-zinc-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <button
                        onClick={() => setPlayVideo(true)}
                        className="absolute inset-0 flex items-center justify-center group/playBtn"
                        aria-label="Play trailer"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="
        w-12 h-12
        md:w-14 md:h-14
        rounded-full
        bg-white/15
        backdrop-blur-md
        border
        border-white/25
        flex
        items-center
        justify-center
        shadow-[0_0_24px_rgba(0,0,0,0.6)]
        transition-all
        duration-300
        group-hover/playBtn:scale-110
        group-hover/playBtn:bg-white/25
        group-hover/playBtn:border-white/40
      "
                          >
                            <Play
                              size={22}
                              className="text-white fill-white ml-0.5"
                            />
                          </div>
                        </div>
                      </button>
                    </>
                  ) : (
                    <iframe
                      src={iframeUrl}
                      title={youtubeTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )}
                </div>

                {/* Title + Meta */}
                {/* <div className="mt-2.5 px-1 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] md:text-[15px] font-semibold leading-snug line-clamp-2">
                      {youtubeTitle || "Untitled"}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                      {channelName && (
                        <span className="text-zinc-500 text-[11px]">
                          {channelName}
                        </span>
                      )}
                      {formattedViews !== "0" && (
                        <span className="text-zinc-500 text-[11px]">
                          {formattedViews} views
                        </span>
                      )}
                      {publishedDate && (
                        <span className="text-zinc-500 text-[11px]">
                          {publishedDate}
                        </span>
                      )}
                    </div>
                  </div>
                  {trailers.length > 1 && (
                    <span className="flex-shrink-0 text-zinc-500 text-[11px] mt-0.5">
                      {currentIndex + 1} / {trailers.length}
                    </span>
                  )}
                </div> */}
              </div>

              {/* Next Peek */}
              <div className="hidden md:block w-[10%] flex-shrink-0">
                {hasNext ? (
                  <button
                    onClick={goNext}
                    className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-700 opacity-40 hover:opacity-65 transition-all duration-300 hover:scale-105 cursor-pointer"
                    aria-label="Next trailer"
                  >
                    {trailers[currentIndex + 1]?.thumbnail ? (
                      <img
                        src={trailers[currentIndex + 1].thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800" />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                  </button>
                ) : (
                  <div className="w-full aspect-video" />
                )}
              </div>
            </div>

            {/* ✅ FIX 3: filmstrip-scrollbar class correct-a ref div la apply pannrom */}
            {trailers.length > 1 && (
              <>
                <style>{`
                  .filmstrip-scrollbar::-webkit-scrollbar { display: none; }
                `}</style>
                <div
                  ref={filmstripRef}
                  className="filmstrip-scrollbar flex items-center gap-2 mt-3 overflow-x-auto pb-1 scroll-smooth"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {trailers.map((t, i) => (
                    <FilmstripItem
                      key={t.id || i}
                      trailer={t}
                      isActive={i === currentIndex}
                      onClick={() => setCurrentIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrailerPlayerModal;
