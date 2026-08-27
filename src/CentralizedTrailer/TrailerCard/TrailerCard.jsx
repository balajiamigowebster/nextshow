import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Eye,
  MessageCircle,
  Play,
  ThumbsUp,
  Clock,
  Clapperboard,
  Users,
} from "lucide-react";
import moment from "moment";
import TrailerLiveRelativeDate from "../../Components/TrailerLiveRelativeDate";

// ============== Marquee Sub Components ==============

const DirectorMarquee = ({ director, isHovered }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      if (contentWidth > containerWidth) {
        setShouldAnimate(true);
        setDistance(contentWidth - containerWidth);
      } else setShouldAnimate(false);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [director]);

  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={
          shouldAnimate && isHovered
            ? "trailer-director-marquee"
            : "inline-flex"
        }
        style={{ "--distance": `${distance}px` }}
      >
        <span
          className="inline-flex items-center bg-slate-950
              text-zinc-300 text-[8px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap"
        >
          {director}
        </span>
      </div>
    </div>
  );
};

const CastMarquee = ({
  cast = [],
  style = {},
  duration = 15, // seconds — total cycle time
  isHovered,
}) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!containerRef.current || !contentRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const sw = contentRef.current.scrollWidth;
      const dist = sw - cw;
      if (dist > 0) {
        setShouldAnimate(true);
        setDistance(dist);
      } else {
        setShouldAnimate(false);
        setDistance(0);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [cast]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden min-w-0 w-full"
      style={style}
    >
      <div
        ref={contentRef}
        className={
          shouldAnimate && isHovered ? "cast-marquee-animate" : "inline-flex"
        }
        style={{
          "--marquee-distance": `-${distance}px`,
          "--marquee-duration": `${duration}s`,
        }}
      >
        {cast.map((actor) => (
          <span
            key={actor}
            className="shrink-0 bg-slate-950
              text-zinc-300 text-[8px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap mr-1"
          >
            {actor}
          </span>
        ))}
      </div>
    </div>
  );
};

const GenreMarquee = ({ genres = [] }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      if (contentWidth > containerWidth) {
        setShouldAnimate(true);
        setDistance(contentWidth - containerWidth);
      } else setShouldAnimate(false);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [genres]);

  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={shouldAnimate ? "trailer-genre-marquee" : "inline-flex"}
        style={{ "--distance": `${distance}px` }}
      >
        {genres.map((genre) => (
          <span
            key={genre}
            className="shrink-0 bg-slate-950
              text-zinc-300 text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap mr-1"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
};

const TitleMarquee = ({ title, isHovered }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      if (contentWidth > containerWidth) {
        setShouldAnimate(true);
        setDistance(contentWidth - containerWidth);
      } else setShouldAnimate(false);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [title]);

  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={shouldAnimate && isHovered ? "trailer-title-marquee" : ""}
        style={{ "--distance": `${distance}px` }}
      >
        <h3 className="text-zinc-300 text-[11px] sm:text-[12px] md:text-[13px] font-bold leading-tight whitespace-nowrap">
          {title || "N/A"}
        </h3>
      </div>
    </div>
  );
};

// ============== YouTube URL → Embed URL Helper ==============
const getEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  let videoId = null;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) videoId = shortMatch[1];
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) videoId = watchMatch[1];
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : null;
};

// ============== Scheduled Card Body ==============
// ============== Scheduled Card Body ==============
const ScheduledCardBody = ({ trailer, statusLabel, statusClass }) => {
  const releaseDate = trailer.scheduledReleaseAt
    ? moment(trailer.scheduledReleaseAt).format("DD MMM YYYY • hh:mm A")
    : null;
  const releaseDateMobile = trailer.scheduledReleaseAt
    ? moment(trailer.scheduledReleaseAt).format("DD MMM YY • hh:mm A")
    : null;

  return (
    <div
      className=" flex
    flex-col
    flex-1
    bg-gradient-to-b
    from-sky-950
    to-zinc-950
    border-t
    border-sky-900/40
    px-2.5
    pt-2
    pb-2.5
    gap-2"
    >
      {/* Coming Soon Banner */}
      <div className="flex items-center justify-between gap-2">
        {/* Coming Soon Badge */}
        <span className="scheduled-coming-soon-badge relative overflow-hidden shrink-0 inline-flex items-center px-1.5 py-[3px] rounded-md text-[7px] sm:text-[8px] font-bold uppercase tracking-wider sm:tracking-widest text-blue-200 leading-none whitespace-nowrap">
          <span className="shine" aria-hidden="true" />
          {statusLabel}
        </span>

        {/* Countdown */}
        <div className="flex items-center gap-0.5 shrink-0">
          <Clock size={8} className="text-zinc-500 flex-shrink-0" />
          <span className="text-[8px] sm:text-[9px] font-bold text-zinc-300 tabular-nums tracking-wide whitespace-nowrap">
            <TrailerLiveRelativeDate targetDate={trailer.scheduledReleaseAt} />
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-sky-900/40" />

      {/* Row 2: Release Date */}
      {releaseDateMobile && (
        <div className="flex items-center gap-1 text-zinc-500 min-w-0">
          <CalendarDays size={9} className="flex-shrink-0" />
          <span className="text-[8px] sm:text-[9px] tabular-nums truncate">
            {releaseDateMobile}
          </span>
        </div>
      )}

      {/* ✅ FIX 1: Equal height — filler rows to match PublishedCardBody height */}
      <div className="border-t border-sky-900/40" />

      {/* Dir row placeholder */}
      <div
        className="flex flex-col gap-1 w-full opacity-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="grid grid-cols-[20px_1fr] gap-1 items-start text-[10px]">
          <span className="text-zinc-600 font-semibold tracking-wider mt-0.5">
            Dir
          </span>
          <div className="h-[18px] rounded bg-zinc-800/40" />
        </div>
        <div className="grid grid-cols-[20px_1fr] gap-1 items-start text-[10px]">
          <span className="text-zinc-600 font-semibold tracking-wider mt-0.5">
            Cast
          </span>
          <div className="h-[18px] rounded bg-zinc-800/40" />
        </div>
      </div>

      <style jsx="true">{`
        .scheduled-coming-soon-badge {
          border: 1px solid rgba(56, 189, 248, 0.3);
          background: linear-gradient(
            180deg,
            rgba(12, 74, 110, 0.9) 0%,
            rgba(2, 6, 23, 0.95) 100%
          );
          box-shadow:
            0 0 10px rgba(56, 189, 248, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
        .scheduled-coming-soon-badge::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          border-radius: 6px 6px 0 0;
        }
        .scheduled-coming-soon-badge .shine {
          position: absolute;
          inset: 0;
          width: 45%;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 20%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.06) 80%,
            transparent 100%
          );
          animation: scheduledShine 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          pointer-events: none;
        }
        @keyframes scheduledShine {
          0% {
            transform: translateX(-180%) skewX(-18deg);
          }
          100% {
            transform: translateX(320%) skewX(-18deg);
          }
        }
      `}</style>
    </div>
  );
};

// ============== Published Card Body ==============
const PublishedCardBody = ({ trailer, director, castList = [], isHovered }) => {
  console.log(trailer, director, castList);
  const formatNumber = (num = 0) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  const showDirector = trailer?.director?.trim() || "";
  const showCastList = trailer?.cast
    ? trailer.cast
        .spli(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const hasMovieMeta = showDirector.length > 0 || castList.length > 0;

  return (
    <div
      className=" flex
    flex-col
    flex-1
    bg-gradient-to-b
    from-sky-950
    to-zinc-950
    border-t
    border-sky-900/40
    px-2.5
    pt-2
    pb-2.5
    gap-2"
    >
      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Eye size={9} className="text-zinc-500" />
          <span className="text-[7px] md:text-[9px] font-semibold text-zinc-300 tabular-nums">
            {formatNumber(trailer.viewCount)}
          </span>
        </div>
        <div className="w-px h-3 bg-sky-900/40" />
        <div className="flex items-center gap-1">
          <ThumbsUp size={9} className="text-zinc-500" />
          <span className="text-[7px] md:text-[9px] font-semibold text-zinc-300 tabular-nums">
            {formatNumber(trailer.likeCount)}
          </span>
        </div>
        <div className="w-px h-3 bg-sky-900/40" />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-zinc-300">
            <CalendarDays size={9} className="flex-shrink-0 text-zinc-500" />
            <span className="text-[7px] md:text-[9px] tabular-nums">
              {moment(trailer.publishedAt).format("DD MMM YYYY")}
            </span>
          </div>
          {/* {trailer.scheduleStatus && (
          <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800/60 text-zinc-400">
            {trailer.scheduleStatus}
          </span>
        )} */}
        </div>
        {/* <div className="flex items-center gap-1">
          <MessageCircle size={10} className="text-zinc-500" />
          <span className="text-[9px] font-semibold text-zinc-300 tabular-nums">
            {formatNumber(trailer.commentCount)}
          </span>
        </div> */}
      </div>

      {/* Divider */}
      <div className="border-t border-sky-900/40" />

      <div className="h-[20px] overflow-hidden">
        <TitleMarquee
          title={trailer.title || trailer.youtubeTitle}
          isHovered={isHovered}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-sky-900/40" />

      {/* Dir & Cast */}
      {hasMovieMeta ? (
        <div className="flex flex-col gap-1 w-full">
          <div className="grid grid-cols-[20px_1fr] gap-1 items-center text-[10px]">
            <Clapperboard size={13} className="text-zinc-300 shrink-0" />

            <div className="overflow-hidden min-w-0">
              <DirectorMarquee director={director} isHovered={isHovered} />
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] gap-1 items-center text-[10px]">
            <Users size={13} className="text-zinc-300 shrink-0" />

            <div className="overflow-hidden min-w-0">
              <CastMarquee isHovered={isHovered} cast={castList} />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-[38px] overflow-hidden rounded-md border border-dashed border-sky-900/50 bg-slate-950 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

          <div className="relative z-10 flex flex-col items-center">
            {/* <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
              Metadata Coming Soon
            </span> */}

            <span className="mt-1 text-[7px] md:text-[10px]  text-zinc-500">
              Director & Cast will be updated soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== Main Trailer Card ==============
const TrailerCard = ({ trailer, title, onClick }) => {
  // console.log("Trailer", trailer);
  const genreList = Array.isArray(trailer.genres)
    ? trailer.genres
    : trailer.genres?.split(",").map((g) => g.trim()) || [];

  const isScheduled = trailer.scheduleStatus === "SCHEDULED";
  const isReady = trailer.scheduleStatus === "READY";
  const isPublished = trailer.scheduleStatus === "PUBLISHED";
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);

  const touchTimer = useRef(null);
  const isAnimationActive = isHovered || isTouchActive;

  // Scheduled/Ready → scheduledThumbnail & scheduledTitle use pannrom
  const thumbnailUrl =
    isScheduled || isReady
      ? trailer.scheduledThumbnail || trailer.thumbnail
      : trailer.thumbnail;

  const cleanYoutubeTitle = (title = "") => {
    if (!title) return "";
    return title.split("|")[0].trim();
  };

  const trailerTitle =
    isScheduled || isReady
      ? cleanYoutubeTitle(
          trailer.scheduledTitle || trailer.youtubeTitle || trailer.title,
        )
      : cleanYoutubeTitle(trailer.youtubeTitle || trailer.title);

  // Status badge config
  const statusLabel = isScheduled ? "Coming Soon" : isReady ? "Processing" : "";
  const statusClass = isScheduled
    ? "border-zinc-600 bg-zinc-800/60 text-zinc-400"
    : isReady
      ? "border-zinc-600 bg-zinc-800/60 text-zinc-500"
      : "";

  const handleTouchStart = () => {
    setIsTouchActive(true);

    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }

    touchTimer.current = setTimeout(() => {
      setIsTouchActive(false);
    }, 8000);
  };

  useEffect(() => {
    return () => {
      if (touchTimer.current) {
        clearTimeout(touchTimer.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      className="relative flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex-shrink-0 select-none transition-all duration-500 ease-out hover:border-zinc-500 hover:ring-2 hover:ring-zinc-500/20 hover:shadow-[0_0_20px_rgba(161,161,170,0.15)]"
    >
      {/* ── Thumbnail Area ── */}
      <div className="relative w-full h-36 sm:h-44 md:h-52 flex-shrink-0 overflow-hidden bg-black">
        <div
          className={`relative w-full h-full group/play ${isPublished ? "cursor-pointer" : "cursor-default"}`}
          onClick={isPublished ? onClick : undefined}
        >
          {/* Thumbnail */}
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={trailerTitle}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPublished ? "group-hover/play:scale-105 object-center" : "object-bottom"}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-600 text-xs uppercase tracking-widest">
                No Thumbnail
              </span>
            </div>
          )}

          {/* Overlay */}
          <div
            className={`absolute inset-0 transition-colors duration-300 ${isPublished ? "bg-black/20 group-hover/play:bg-black/40" : "bg-black/40"}`}
          />

          {/* Play Button — PUBLISHED only */}
          {isPublished && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_0_24px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-white/25 group-hover/play:border-white/40">
                <Play size={18} className="text-white fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Duration — PUBLISHED only */}
          {isPublished && trailer.duration && (
            <span className="absolute bottom-2 right-2 z-10 bg-black/70 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
              {trailer.duration}
            </span>
          )}

          {/* Scheduled — Coming Soon overlay text on thumbnail */}
          {/* {(isScheduled || isReady) && (
            <div className="absolute inset-0 flex items-end justify-start p-2.5">
              <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-zinc-700/50">
                {statusLabel}
              </span>
            </div>
          )} */}
        </div>

        {/* Media type badge — top right */}
        {(trailer.trailerType || trailer.mediaType) && (
          <span className="absolute top-0 right-0 z-10 bg-gradient-to-l from-zinc-950/80 to-transparent text-zinc-100 text-[9px] font-bold uppercase tracking-[.08em] pl-3 pr-3 py-1.5 rounded-l-full backdrop-blur-[2px] pointer-events-none">
            {trailer.trailerType || trailer.mediaType}
          </span>
        )}
      </div>

      {/* ── Card Body — conditionally render based on status ── */}
      {isScheduled || isReady ? (
        <ScheduledCardBody
          trailer={trailer}
          statusLabel={statusLabel}
          statusClass={statusClass}
        />
      ) : (
        <PublishedCardBody
          trailer={trailer}
          director={trailer.movie?.director}
          castList={
            trailer.movie?.cast
              ? trailer.movie.cast.split(",").map((item) => item.trim())
              : []
          }
          isHovered={isAnimationActive}
        />
      )}

      <style jsx="true">{`
        @keyframes trailerDirectorMarquee {
          0% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          70% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          100% {
            transform: translateX(0);
          }
        }
        .trailer-director-marquee {
          display: inline-flex;
          width: max-content;
          animation: trailerDirectorMarquee 8s ease-in-out infinite;
        }

        @keyframes trailerCastMarquee {
          0% {
            transform: translateX(0);
          }
          45% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          75% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          100% {
            transform: translateX(0);
          }
        }
        .trailer-cast-marquee {
          display: inline-flex;
          width: max-content;
          animation: trailerCastMarquee 35s ease-in-out infinite;
        }

        @keyframes trailerGenreMarquee {
          0% {
            transform: translateX(0);
          }
          45% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          75% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          100% {
            transform: translateX(0);
          }
        }
        .trailer-genre-marquee {
          display: inline-flex;
          width: max-content;
          animation: trailerGenreMarquee 15s ease-in-out infinite;
        }

        @keyframes trailerTitleMarquee {
          0% {
            transform: translateX(0);
          }
          45% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          75% {
            transform: translateX(calc(-1 * var(--distance)));
          }
          100% {
            transform: translateX(0);
          }
        }
        .trailer-title-marquee {
          display: inline-block;
          width: max-content;
          animation: trailerTitleMarquee 10s ease-in-out infinite;
        }

        .new-release-badge {
          border: 1px solid rgba(161, 161, 170, 0.35);
          font-family: "Science Gothic", sans-serif;
          box-shadow:
            0 0 10px rgba(161, 161, 170, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
          font-weight: 200;
          letter-spacing: 0.12em;
        }
        .new-release-badge .shine {
          position: absolute;
          inset: 0;
          width: 45%;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255, 255, 255, 0.06) 20%,
            rgba(255, 255, 255, 0.38) 50%,
            rgba(255, 255, 255, 0.06) 80%,
            transparent 100%
          );
          animation: trailerGoldShine 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          pointer-events: none;
        }
        @keyframes trailerGoldShine {
          0% {
            transform: translateX(-160%) skewX(-18deg);
          }
          100% {
            transform: translateX(320%) skewX(-18deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TrailerCard;
