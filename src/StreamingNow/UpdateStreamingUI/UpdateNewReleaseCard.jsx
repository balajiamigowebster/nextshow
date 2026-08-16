import { Film, Clapperboard, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { STREAMING_PLATFORMS } from "../../Components/OttPlatformComponent";

// ─────────────────────────────────────────
// MARQUEE SUB-COMPONENTS
// ─────────────────────────────────────────
const DirectorMarquee = ({ director, isHovered }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const check = () => {
      if (!containerRef.current || !contentRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const sw = contentRef.current.scrollWidth;
      if (sw > cw) {
        setShouldAnimate(true);
        setDistance(sw - cw);
      } else setShouldAnimate(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [director]);
  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={
          shouldAnimate && isHovered ? "nr-director-marquee" : "inline-flex"
        }
        style={{ "--distance": `${distance}px` }}
      >
        <span
          className="inline-flex items-center bg-[#031824] border border-[#0a3550]/40 text-zinc-300
          text-[8px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap"
        >
          {director}
        </span>
      </div>
    </div>
  );
};

const CastMarquee = ({ cast = [], isHovered }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const dist = contentWidth - containerWidth;
      if (dist > 0) {
        setShouldAnimate(true);
        setDistance(dist);
      } else {
        setShouldAnimate(false);
        setDistance(0);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [cast]);

  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={
          shouldAnimate && isHovered ? "cast-marquee-animate" : "inline-flex"
        }
        style={{
          "--marquee-distance": `-${distance}px`, // ✅ fixed
          "--marquee-duration": "16s", // ✅ fixed
        }}
      >
        {cast.map((actor) => (
          <span
            key={actor}
            className="shrink-0 bg-[#031824] border border-[#0a3550]/40 text-zinc-300 text-[8px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap mr-1"
          >
            {actor}
          </span>
        ))}
      </div>
    </div>
  );
};

const GenreMarquee = ({ genres = [], isHovered }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const check = () => {
      if (!containerRef.current || !contentRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const sw = contentRef.current.scrollWidth;
      if (sw > cw) {
        setShouldAnimate(true);
        setDistance(sw - cw);
      } else setShouldAnimate(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [genres]);
  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={
          shouldAnimate && isHovered ? "nr-genre-marquee" : "inline-flex"
        }
        style={{ "--distance": `${distance}px` }}
      >
        {genres.map((genre) => (
          <span
            key={genre}
            className="shrink-0 bg-[#031824] border border-[#0a3550]/40 text-zinc-300 text-[8px] sm:text-[9px]
              font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap mr-1"
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
    const check = () => {
      if (!containerRef.current || !contentRef.current) return;
      const cw = containerRef.current.offsetWidth;
      const sw = contentRef.current.scrollWidth;
      if (sw > cw) {
        setShouldAnimate(true);
        setDistance(sw - cw);
      } else setShouldAnimate(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [title]);
  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={shouldAnimate && isHovered ? "nr-title-marquee" : ""}
        style={{ "--distance": `${distance}px` }}
      >
        <h3
          className="text-zinc-50 text-[11px] sm:text-[12px] md:text-[13px]
          font-bold leading-tight whitespace-nowrap"
        >
          {title || "N/A"}
        </h3>
      </div>
    </div>
  );
};

const StreamingPlatformBadge = ({ movie }) => {
  const availableOnArray = Array.isArray(movie?.availableOn)
    ? movie.availableOn
    : typeof movie?.availableOn === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(movie.availableOn);
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return [];
          }
        })()
      : [];

  const ottIds =
    availableOnArray?.map((platform) => platform.id?.toLowerCase()) || [];

  const ottPlatforms = STREAMING_PLATFORMS.filter((platform) =>
    ottIds.includes(platform.id.toLowerCase()),
  );

  if (!ottPlatforms.length) return null;

  return (
    <div className="flex items-center">
      {ottPlatforms.map((platform, index) => (
        <img
          key={platform.id}
          src={platform.logo}
          alt={platform.name}
          title={platform.name}
          style={{
            zIndex: ottPlatforms.length - index,
          }}
          className={`
            relative
            h-5
            w-5
            md:h-6
            md:w-6
            rounded-full
            object-cover
            border
            border-zinc-900
            ring-1
            ring-zinc-700/60
            ${index !== 0 ? "-ml-2.5" : ""}
          `}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────
// THUMBNAIL HELPER
// ─────────────────────────────────────────
const getYouTubeThumbnail = (url) => {
  if (!url) return "https://via.placeholder.com/480x360?text=No+Trailer";
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : "https://via.placeholder.com/480x360?text=Invalid+URL";
};

// ─────────────────────────────────────────
// MAIN CARD
// Props: movie = { slug, title, genres, cast, director,
//   trailerUrl, bannerImage, ottReleaseDate, releaseDate,
//   averageRating, streamType, isStreamingReleased }
// ─────────────────────────────────────────
const UpdateNewReleaseCard = ({ movie = {}, title }) => {
  const genreList = Array.isArray(movie.genres)
    ? movie.genres
    : movie.genres?.split(",").map((g) => g.trim()) || [];

  const castList = Array.isArray(movie.cast)
    ? movie.cast
    : movie.cast?.split(",").map((c) => c.trim()) || [];

  const displayImage = movie.trailerUrl
    ? getYouTubeThumbnail(movie.trailerUrl)
    : movie.bannerImage || "https://via.placeholder.com/300x450?text=No+Poster";

  const releaseLabel = movie.ottReleaseDate;

  const [isHovered, setIsHovered] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);

  const touchTimer = useRef(null);

  const isAnimationActive = isHovered || isTouchActive;

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

  // NEW_RELEASE = released, UPCOMING = not yet released
  const isNewRelease =
    movie.streamType === "NEW_RELEASE" && movie.isStreamingReleased;
  const isUpcoming =
    movie.streamType === "UPCOMING" && !movie.isStreamingReleased;

  const showRating =
    movie.streamType === "NEW_RELEASE" || movie.streamType === "NEW";

  return (
    <Link
      to={`/movie/${movie.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      className="relative flex flex-col rounded-xl overflow-hidden
        border border-[#07304b] bg-gradient-to-b from-[#080d14] to-[#041c2c] cursor-pointer flex-shrink-0 select-none
        transition-all duration-500 ease-out
        shadow-[0_4px_25px_rgba(0,0,0,0.4),0_0_15px_rgba(7,48,75,0.2)]
        hover:border-[#0f5480]
        hover:ring-2 hover:ring-sky-500/20
        hover:shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_25px_rgba(14,165,233,0.35)]"
    >
      {/* ── Poster ── */}
      <div className="relative w-full h-36 sm:h-44 md:h-52 flex-shrink-0 overflow-hidden">
        <img
          src={displayImage}
          alt={movie.title}
          className="w-full h-full object-cover object-top transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d14] via-[#080d14]/40 to-transparent" />

        {/* Section label — top left */}
        {/* <span
          className="absolute top-0 w-full left-0 z-10
          bg-gradient-to-r from-zinc-700 to-zinc-900
          text-zinc-200 text-[10px] font-semibold
          uppercase tracking-[.06em] px-3 py-1.5
          rounded-tl-[5px] rounded-tr-[5px]
          shadow-[0_0_8px_rgba(63,63,70,0.5)]"
        >
          {title}
        </span> */}
        <div
          className="
    absolute
    top-0
    left-0
    right-0
    

    flex
    items-center
    justify-between

    px-3
    py-1.5

    bg-gradient-to-r
    from-[#052438]
    via-[#031d2f]
    to-[#021320]

    border-b
    border-[#0a3550]/40

    shadow-[0_2px_10px_rgba(0,0,0,0.35)]
  "
        >
          {isNewRelease && (
            <span
              className="
        new-release-badge
        relative
        overflow-hidden

        shrink-0

        inline-flex
        items-center
        justify-center

        px-2
        py-[3px]

        rounded-md

        text-[7px]
        md:text-[8px]

        uppercase
        tracking-[0.12em]
            font-semibold
        text-zinc-100
      "
            >
              <span className="shine" />
              NEW RELEASE
            </span>
          )}

          {isUpcoming && (
            <span
              className="
        new-release-badge
        relative
        overflow-hidden

        shrink-0

        inline-flex
        items-center
        justify-center

        px-2
        py-[3px]

        rounded-md

        text-[7px]
        md:text-[8px]

        uppercase
        tracking-[0.12em]

        text-zinc-100
      "
            >
              <span className="shine" />
              UPCOMING
            </span>
          )}
        </div>

        {/* Rating — top right */}
        {showRating && movie.averageRating && (
          <span
            className="absolute top-0 right-0 z-10
            flex items-center gap-1
            bg-gradient-to-l from-zinc-950/80 to-transparent
            text-zinc-100 text-[10px] font-bold
            pl-3 pr-3 py-1 rounded-l-full backdrop-blur-[2px]"
          >
            <svg
              className="w-[11px] h-[11px] fill-yellow-500"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="nr-rating-score text-[12px] md:text-[13px] whitespace-nowrap">
              {movie.averageRating}
            </span>
          </span>
        )}

        {/* Release date — bottom bar */}
        {releaseLabel && (
          <div
            className="
      absolute
      bottom-0
      left-0
      w-full
      flex
      gap-1
      items-center
      px-3
      py-1.5
      bg-gradient-to-r
      from-[#052438]
      via-[#031d2f]
      to-[#021320]
      border-t
      border-[#0a3550]/40
      z-10
    "
          >
            <span
              className="
        text-zinc-200
        text-[9px]
        font-bold
        uppercase
        tracking-[.08em]
      "
            >
              {releaseLabel}
            </span>

            <StreamingPlatformBadge movie={movie} />
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div
        className="flex flex-col bg-transparent border-t border-[#0a3550]/30
        px-2.5 pt-2 pb-2.5 sm:px-3 sm:pt-2.5 flex-shrink-0 min-h-0"
      >
        {/* Title + badge */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <TitleMarquee title={movie.title} isHovered={isAnimationActive} />
          </div>

          {/* {isNewRelease && (
            <span
              className="new-release-badge relative overflow-hidden shrink-0 
    inline-flex items-center gap-1
    px-2 py-[2px] rounded
    text-[7px] md:text-[8px]  uppercase tracking-[0.12em]
    text-blue-300"
            >
              <span className="shine" aria-hidden="true" />
              New
            </span>
          )} */}

          {/* {isUpcoming && (
            <span
              className="new-release-badge relative overflow-hidden shrink-0
    inline-flex items-center gap-1
    px-2 py-[3px] rounded-md
    text-[6px] md:text-[8px] uppercase tracking-[0.1em]
    text-zinc-400"
            >
              <span className="shine" aria-hidden="true" />
              Upcoming
            </span>
          )} */}
        </div>

        {/* Genres */}
        <div className="mb-2 overflow-hidden">
          <GenreMarquee genres={genreList} isHovered={isAnimationActive} />
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mb-1.5" />

        {/* Director & Cast */}
        <div className="flex flex-col gap-1 w-full">
          <div className="grid grid-cols-[20px_1fr] gap-1 items-center text-[10px]">
            <Clapperboard size={13} className="text-zinc-500 shrink-0" />
            <div className="overflow-hidden min-w-0">
              <DirectorMarquee
                director={movie.director || "TBA"}
                isHovered={isAnimationActive}
              />
            </div>
          </div>
          <div className="grid grid-cols-[20px_1fr] gap-1 items-center text-[10px]">
            <Users size={13} className="text-zinc-500 shrink-0" />
            <div className="overflow-hidden min-w-0">
              <CastMarquee cast={castList} isHovered={isAnimationActive} />
            </div>
          </div>
        </div>

        <style jsx="true">{`
          /* ── Marquee keyframes (nr- prefix) ── */
          @keyframes nrDirectorMarquee {
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
          .nr-director-marquee {
            display: inline-flex;
            width: max-content;
            animation: nrDirectorMarquee 8s ease-in-out infinite;
          }
          @keyframes nrCastMarquee {
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
          .nr-cast-marquee {
            display: inline-flex;
            width: max-content;
            animation: nrCastMarquee 35s ease-in-out infinite;
          }
          @keyframes nrGenreMarquee {
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
          .nr-genre-marquee {
            display: inline-flex;
            width: max-content;
            animation: nrGenreMarquee 15s ease-in-out infinite;
          }
          @keyframes nrTitleMarquee {
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
          .nr-title-marquee {
            display: inline-block;
            width: max-content;
            animation: nrTitleMarquee 10s ease-in-out infinite;
          }

          .new-release-badge {
            border: 1px solid rgba(161, 161, 170, 0.35);
            font-family: "Science Gothic", sans-serif;
            box-shadow:
              0 0 10px rgba(161, 161, 170, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
            font-weight: 200;
            letter-spacing: 0.12em;
          }

          .new-release-badge::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.13) 0%,
              transparent 100%
            );
            border-radius: 6px 6px 0 0;
            pointer-events: none;
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
            animation: goldShine 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            pointer-events: none;
          }
          @keyframes goldShine {
            0% {
              transform: translateX(-160%) skewX(-18deg);
            }
            100% {
              transform: translateX(320%) skewX(-18deg);
            }
          }

          /* ── Golden rating score ── */
          .nr-rating-score {
            background: linear-gradient(
              180deg,
              #fff7c2 0%,
              #ffd95a 25%,
              #facc15 55%,
              #d97706 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
            letter-spacing: 0.03em;
          }
        `}</style>
      </div>
    </Link>
  );
};

export default UpdateNewReleaseCard;
