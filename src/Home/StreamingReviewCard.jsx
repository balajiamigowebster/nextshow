import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { STREAMING_PLATFORMS } from "../Components/OttPlatformComponent";
import { Film, Clapperboard, Users } from "lucide-react";
import LiveRelativeDate from "../Components/LiveRelativeDate";

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
      } else {
        setShouldAnimate(false);
      }
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
          shouldAnimate && isHovered ? "director-marquee" : "inline-flex"
        }
        style={{
          "--distance": `${distance}px`,
        }}
      >
        <span
          className="
            inline-flex
            items-center
             bg-slate-950
              text-zinc-300
            text-[8px]
            font-semibold
            px-1.5
            py-0.5
            rounded-[4px]
            whitespace-nowrap
          "
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
            className="shrink-0  bg-slate-950
              text-zinc-300 text-[8px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap mr-1"
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
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;

      if (contentWidth > containerWidth) {
        setShouldAnimate(true);
        setDistance(contentWidth - containerWidth);
      } else {
        setShouldAnimate(false);
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [genres]);

  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={shouldAnimate && isHovered ? "genre-marquee" : "inline-flex"}
        style={{
          "--distance": `${distance}px`,
        }}
      >
        {genres.map((genre) => (
          <span
            key={genre}
            className="
              shrink-0
               bg-slate-950
              text-zinc-300
              text-[8px] sm:text-[9px]
              font-semibold
              px-1.5
              py-0.5
              rounded-[4px]
              whitespace-nowrap
              mr-1
            "
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
      } else {
        setShouldAnimate(false);
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [title]);

  return (
    <div ref={containerRef} className="overflow-hidden min-w-0 w-full">
      <div
        ref={contentRef}
        className={shouldAnimate && isHovered ? "title-marquee" : ""}
        style={{
          "--distance": `${distance}px`,
        }}
      >
        <h3
          className="
            text-zinc-50
            text-[11px] sm:text-[12px] md:text-[13px]
            font-bold
            leading-tight
            whitespace-nowrap
          "
        >
          {title || "N/A"}
        </h3>
      </div>
    </div>
  );
};

const MovieAvailabilityBadge = ({ movie, STREAMING_PLATFORMS }) => {
  const ottIds =
    movie?.availableOn?.map((platform) => platform.id?.toLowerCase()) || [];
  const ottPlatforms = STREAMING_PLATFORMS.filter((platform) =>
    ottIds.includes(platform.id.toLowerCase()),
  );
  const hasOtt = ottPlatforms.length > 0;
  // =========================
  // THEATRE LOGIC
  // =========================
  const showTheatre =
    movie?.releaseMode !== "DIRECT_STREAMING" && movie?.isTheatreReleased;
  // Nothing to show
  if (!showTheatre && !hasOtt) {
    return null;
  }
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Theatre */}
      {showTheatre && (
        <div
          className="
            flex items-center gap-1
            text-orange-400
            text-[8px]
            font-semibold
            uppercase
            whitespace-nowrap
          "
        >
          <Film className="text-slate-950" size={10} />
          <span>Theatre</span>
        </div>
      )}
      {/* Separator */}
      {showTheatre && hasOtt && <div className="w-px h-3 bg-zinc-500" />}
      {/* OTT Logos */}
      {ottPlatforms.map((platform, index) => (
        <img
          key={platform.id}
          src={platform.logo}
          alt={platform.name}
          title={platform.name}
          style={{ zIndex: ottPlatforms.length - index }}
          className={`
                relative
                h-4
                w-4
                md:h-5
                md:w-5
                rounded-full
                object-cover
                border
                border-zinc-900
                ring-1
                ring-zinc-700/60
                ${index !== 0 ? "-ml-3 md:-ml-3" : ""}
              `}
        />
      ))}
    </div>
  );
};

const StreamingReviewCard = ({ review, title }) => {
  // console.log("StreamingCard", review);
  const isNewRelease =
    review.streamType === "NEW_RELEASE" && review.isStreamingReleased;

  const isUpcoming =
    review.streamType === "UPCOMING" && !review.isStreamingReleased;
  const getYouTubeThumbnail = (url) => {
    if (!url) return "https://via.placeholder.com/480x360?text=No+Trailer";
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
      : "https://via.placeholder.com/480x360?text=Invalid+URL";
  };

  const displayImage = review.trailerUrl
    ? getYouTubeThumbnail(review.trailerUrl)
    : review.bannerImage ||
      "https://via.placeholder.com/300x450?text=No+Poster";

  const genreList = Array.isArray(review.genres)
    ? review.genres
    : review.genres?.split(",").map((g) => g.trim()) || [];
  const [isHovered, setIsHovered] = useState(false);

  const touchTimer = useRef(null);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const isAnimationActive = isHovered || isTouchActive;

  const showRating =
    review.streamType === "NEW_RELEASE" || review.streamType === "NEW";
  // console.log("Average rating", review.averageRating);

  const shouldShowCountdown =
    review?.releaseMode === "DIRECT_STREAMING" &&
    review?.movieStatus === "WAITING" &&
    review?.streamType === "UPCOMING" &&
    review?.ottReleaseDate &&
    review?.ottReleaseDate !== "TBA";

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
    <Link
      to={`/movie/${review.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      className="
  relative
  flex
  flex-col
  rounded-xl
  overflow-hidden
  isolate

  border
  border-slate-800/80
  bg-zinc-950

  cursor-pointer
  flex-shrink-0
  select-none

  transition-all
  duration-500
  ease-out

  shadow-[0_18px_40px_-18px_rgba(2,6,23,0.70),0_0_10px_rgba(14,116,144,0.38),0_0_70px_rgba(15,23,42,0.10)]

  hover:-translate-y-1
  hover:border-slate-600

  hover:shadow-[0_22px_48px_-12px_rgba(2,6,23,1),0_0_22px_rgba(14,116,144,0.38),0_0_48px_rgba(15,23,42,0.75)]
"
    >
      {/* ── Poster ── */}
      {/* Mobile: h-36 (144px) | Tablet: h-44 (176px) | Desktop: h-52 (208px) */}
      <div className="relative w-full h-36 sm:h-44 md:h-52 flex-shrink-0 overflow-hidden">
        <img
          src={displayImage}
          alt={review.title}
          className="w-full h-full object-cover object-top
            transition-transform duration-500 "
          loading="lazy"
        />

        {/* Gradient fade bottom */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" /> */}

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
  from-slate-900/95
  via-slate-800/95
  to-slate-950/95

    border-b
    border-sky-500/30

    shadow-[0_2px_10px_rgba(0,0,0,0.35)]
  "
        >
          {/* Left Title */}

          {/* Right Badge */}

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

        {/* Rating badge - Fade out effect */}
        {showRating && review.averageRating && (
          <span
            className="absolute top-0  right-0 z-10
               flex items-center gap-1
               bg-gradient-to-l from-zinc-950/80 to-transparent
               text-zinc-100 text-[10px] font-bold
               pl-3 pr-3 py-1 rounded-l-full
               backdrop-blur-[2px]"
          >
            <FaStar className="text-yellow-500 text-[11px]" />

            <span
              className="
    rating-score
    text-[12px]
    md:text-[13px]
    whitespace-nowrap
  "
            >
              {" "}
              {review.averageRating}
            </span>
          </span>
        )}
        {review.ottReleaseDate && (
          <div
            className="
      absolute
      bottom-0
      left-0
      w-full
      flex
      items-center
      justify-between
      px-3
      py-1.5
      bg-gradient-to-r
      from-slate-900/95
  via-slate-600/95
  to-slate-950/95
      border-t
      border-sky-500/30
    "
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="
          text-zinc-200
          text-[9px]
          font-bold
          uppercase
          tracking-[.08em]
          whitespace-nowrap
        "
              >
                {review.ottReleaseDate}
              </span>
              {/* RIGHT SIDE */}
              <MovieAvailabilityBadge
                movie={review}
                STREAMING_PLATFORMS={STREAMING_PLATFORMS}
              />
            </div>

            {shouldShowCountdown && (
              <span
                className="
      theatre-badge
      relative
      overflow-hidden
      shrink-0
      inline-flex
      items-center
      justify-center
      px-2
      py-[3px]
      rounded
      text-[7px]
      md:text-[9px]
      
      tracking-[0.08em]
      text-zinc-300
      leading-none
      whitespace-nowrap
    "
              >
                <span className="shine" />
                <LiveRelativeDate targetDate={review.ottReleaseDate} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Details ── fixed height so all cards uniform */}
      {/* Mobile: compact | Desktop: slightly more padding */}
      <div
        className="flex flex-col bg-gradient-to-b from-sky-950 to-zinc-950 border-t border-sky-900/40
        px-2.5 pt-2 pb-2.5 sm:px-3 sm:pt-2.5 s
        flex-shrink-0 min-h-0"
      >
        {/* Title */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <TitleMarquee title={review.title} isHovered={isAnimationActive} />
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
          )}

          {isUpcoming && (
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

        {/* Genre pills — single line, no wrap, scroll hidden */}
        <div className="mb-2 overflow-hidden">
          <GenreMarquee genres={genreList} isHovered={isAnimationActive} />
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mb-1.5" />

        {/* Director & Cast Container */}
        <div className="flex flex-col gap-1 w-full">
          {/* Director */}
          <div className="grid grid-cols-[20px_1fr] gap-1 items-center text-[10px]">
            <Clapperboard size={13} className="text-zinc-300 shrink-0" />

            <div className="overflow-hidden min-w-0">
              <DirectorMarquee
                director={review.director || "TBA"}
                isHovered={isAnimationActive}
              />
            </div>
          </div>

          {/* Cast */}
          <div className="grid grid-cols-[20px_1fr] gap-1 items-center text-[10px]">
            <Users size={13} className="text-zinc-300 shrink-0" />

            <div className="overflow-hidden min-w-0">
              <CastMarquee
                cast={
                  Array.isArray(review.cast)
                    ? review.cast
                    : review.cast?.split(",").map((c) => c.trim()) || []
                }
                isHovered={isAnimationActive}
              />
            </div>
          </div>
        </div>
        <style jsx="true">{`
          @keyframes directorMarquee {
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

          .director-marquee {
            display: inline-flex;
            width: max-content;
            animation: directorMarquee 8s ease-in-out infinite;
          }
          @keyframes castMarquee {
            0% {
              transform: translateX(0);
            }

            25% {
              transform: translateX(0);
            }

            60% {
              transform: translateX(calc(-1 * var(--distance)));
            }

            70% {
              transform: translateX(calc(-1 * var(--distance)));
            }

            100% {
              transform: translateX(0);
            }
          }

          .cast-marquee {
            display: inline-flex;
            width: max-content;
            animation: castMarquee 14s ease-in-out infinite;
          }
          @keyframes genreMarquee {
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

          .genre-marquee {
            display: inline-flex;
            width: max-content;
            animation: genreMarquee 15s ease-in-out infinite;
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
          @keyframes titleMarquee {
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

          .title-marquee {
            display: inline-block;
            width: max-content;
            animation: titleMarquee 10s ease-in-out infinite;
          }
          .rating-score {
            font-family: "Quantico", sans-serif;

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

            text-shadow:
              0 0 8px rgba(250, 204, 21, 0.35),
              0 0 15px rgba(250, 204, 21, 0.15);

            letter-spacing: 0.03em;
            font-weight: 700;
          }
          .theatre-badge {
            border: 1px solid rgba(161, 161, 170, 0.25);

            background: linear-gradient(
              180deg,
              rgba(39, 39, 42, 0.9) 0%,
              rgba(24, 24, 27, 0.95) 100%
            );

            box-shadow:
              0 0 10px rgba(161, 161, 170, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);

            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          }

          .theatre-badge::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40%;
            border-radius: 6px 6px 0 0;
          }

          .theatre-badge .shine {
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

            animation: theatreShine 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;

            pointer-events: none;
          }

          @keyframes theatreShine {
            0% {
              transform: translateX(-180%) skewX(-18deg);
            }

            100% {
              transform: translateX(320%) skewX(-18deg);
            }
          }
        `}</style>
      </div>
    </Link>
  );
};

export default StreamingReviewCard;
