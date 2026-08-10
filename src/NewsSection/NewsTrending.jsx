import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaEye, FaPlay, FaTag } from "react-icons/fa";
import moment from "moment";
import { ImSpinner9 } from "react-icons/im";

const TABS = ["All", "Movies", "Web Series", "OTT", "Box Office"];

const activeBlogs = [
  {
    id: 1,
    rank: 1,
    isTop: true,
    category: "Movies",
    title:
      "Thalapathy 69 — Official Title & Jaw-Dropping First Look Unveiled by Lyca Productions",
    newsDate: "2 hrs ago",
    views: "48.2K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=70",
  },
  {
    id: 2,
    rank: 2,
    isTop: true,
    category: "Web Series",
    title:
      "Avengers: Doomsday — Full Cast Locked, Official Trailer Drops Tomorrow",
    newsDate: "5 hrs ago",
    views: "210K",
    hasVideo: true,
    bannerImage:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=70",
  },
  {
    id: 3,
    rank: 3,
    isTop: true,
    category: "OTT",
    title:
      "Dune: Prophecy Season 2 — The Sisterhood's Darkest Chapter Begins Tonight",
    newsDate: "Yesterday",
    views: "95K",
    hasVideo: true,
    bannerImage:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=300&q=70",
  },
  {
    id: 4,
    rank: 4,
    isTop: false,
    category: "Web Series",
    title: "Suzhal Season 3 — Casting Begins with a Shocking New Showrunner",
    newsDate: "2 days ago",
    views: "62K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=70",
  },
  {
    id: 5,
    rank: 5,
    isTop: false,
    category: "Box Office",
    title:
      "Coolie Crosses ₹500 Cr Worldwide — Rajinikanth's Biggest Action Spectacle",
    newsDate: "3 days ago",
    views: "175K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=300&q=70",
  },
  {
    id: 6,
    rank: 6,
    isTop: false,
    category: "Movies",
    title:
      "Kamal Haasan's Indian 3 Gets a Surprise OTT Release Date Announcement",
    newsDate: "3 days ago",
    views: "41K",
    hasVideo: false,
    bannerImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=70",
  },
  {
    id: 7,
    rank: 7,
    isTop: false,
    catBg: "rgba(59,130,246,0.15)",
    title:
      "Mission Impossible 8 Final Trailer — Tom Cruise's Most Dangerous Stunt Yet",
    newsDate: "4 days ago",
    views: "88K",
    hasVideo: true,
    bannerImage:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&q=70",
  },
];

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${IMAGE_BASE_URL}${imagePath}`;
};

const getRelativeTime = (date) => {
  if (!date) return "";
  return moment(date).fromNow();
};

// ======================================================
// ✅ MARQUEE TAGS (used inside MobileNewsCard)
// ======================================================
const MarqueeTags = ({ tags = [] }) => {
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
  }, [tags]);

  return (
    <div ref={containerRef} className="overflow-hidden flex-1 min-w-0">
      <div
        ref={contentRef}
        className={shouldAnimate ? "marquee-tags" : "inline-flex"}
        style={{
          "--distance": `${distance}px`,
        }}
      >
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 mr-3 text-[8px] text-zinc-500 font-medium"
          >
            <FaTag className="text-zinc-600 text-[7px]" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ======================================================
// ✅ MOBILE CARD (only used on mobile)
// ======================================================
const MobileNewsCard = ({ news }) => {
  const hasVideo = news?.videoUrl?.length > 0;

  return (
    <Link
      to={`/news/${news?.slug}`}
      className="group relative flex gap-3 items-start
        rounded-xl overflow-hidden
        bg-zinc-900
        p-3
        transition-all duration-300 ease-out
        hover:border-zinc-500
        hover:ring-2 hover:ring-zinc-500/20
        hover:shadow-[0_0_16px_rgba(161,161,170,0.15)]"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 h-full w-[4px] bg-zinc-600" />

      {/* Thumbnail */}
      <div className="relative w-[85px] h-[85px] rounded-lg overflow-hidden shrink-0">
        <img
          src={getImageUrl(news?.newsImages?.[0])}
          alt={news?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-transparent" />

        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
            <FaPlay size={10} className="text-white ml-0.5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[11px] leading-[1.3] text-zinc-100 font-semibold line-clamp-2 group-hover:text-white transition-colors">
          {news?.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <div className="flex items-center gap-1 text-[8.5px] text-zinc-500 whitespace-nowrap overflow-x-auto no-scrollbar min-w-0">
            <span className="shrink-0">{news?.formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
            <span className="shrink-0">
              {getRelativeTime(news?.publishedAt)}
            </span>
          </div>

          <span className="flex items-center gap-1 text-[8.5px] text-zinc-400 shrink-0">
            <FaEye size={9} />
            <span>{news?.viewCount || 0}</span>
          </span>
        </div>

        {/* Tags row */}
        {news?.tags?.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden">
            <MarqueeTags tags={news.tags} />
          </div>
        )}
      </div>
    </Link>
  );
};

const NewsTrending = ({
  trendingNews = [],
  isLoading,
  isError,
  error,
  refetch,
}) => {
  const [activeTab, setActiveTab] = useState("All");

  const getRelativeTimeDesktop = (date) => {
    return moment(date).fromNow();
  };

  const filtered =
    activeTab === "All"
      ? activeBlogs
      : activeBlogs.filter((b) => b.category === activeTab);

  if (isLoading) {
    return (
      <div className="w-full h-auto md:h-[74vh] mt-5 md:mt-20 bg-[#0d1017] flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-800/50">
        <ImSpinner9 className="text-orange-500 text-4xl animate-spin" />
      </div>
    );
  }

  // ======================================================
  // ✅ ERROR UI
  // ======================================================

  if (isError) {
    return (
      <div className="w-full h-auto md:h-[74vh] mt-5 md:mt-20 bg-[#0d1017] flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-red-500/20 px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <span className="text-red-500 text-xl">!</span>
        </div>

        <h2 className="text-white text-lg mb-2">
          Failed to load trending news
        </h2>

        <button
          onClick={() => refetch()}
          className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-auto md:h-[74vh] mt-5 md:mt-20 bg-[#0d1017] flex flex-col border-t md:border-t-0 md:border-l border-gray-800/50">
      {/* ── HEADER ── */}
      <div className="px-5 py-3 border-b border-gray-800/50 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-gray-400 uppercase text-[11px] font-bold tracking-[1px]">
            Trending News
          </h3>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ✅ MOBILE: Horizontal scroll grid (md:hidden) */}
      {/* ====================================================== */}
      <div className="md:hidden">
        {!isLoading && !isError && trendingNews?.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[200px] px-6 text-center">
            <h3 className="text-white text-lg font-bold mb-2">
              No Trending News
            </h3>
            <p className="text-white/35 text-sm leading-relaxed max-w-[240px]">
              Trending stories are not available right now. Please check again
              later.
            </p>
          </div>
        )}

        {trendingNews?.length > 0 && (
          <div className="grid grid-flow-col grid-rows-2 auto-cols-[260px] gap-3.5 overflow-x-auto no-scrollbar scroll-smooth px-4 pb-1">
            {trendingNews.map((news) => (
              <MobileNewsCard key={news?.id} news={news} />
            ))}
          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* ✅ DESKTOP: Existing list (hidden on mobile) */}
      {/* ====================================================== */}
      <div className="hidden md:flex md:flex-col flex-1 overflow-y-auto no-scrollbar">
        {!isLoading && !isError && trendingNews?.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] px-6 text-center">
            <h3 className="text-white text-lg font-bold mb-2">
              No Trending News
            </h3>
            <p className="text-white/35 text-sm leading-relaxed max-w-[240px]">
              Trending stories are not available right now. Please check again
              later.
            </p>
          </div>
        )}
        {trendingNews?.map((news, index) => {
          const hasVideo = news?.videoUrl?.length > 0;

          return (
            <Link
              to={`/news/${news?.slug}`}
              key={news?.id}
              className="flex gap-3 px-5 py-3 cursor-pointer hover:bg-white/[0.05] border-b border-white/[0.04] last:border-b-0 group items-start transition-colors"
            >
              {/* Rank */}
              <span className="text-[11px] text-white/50 pt-0.5 min-w-[18px]">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] text-white/50 leading-snug mb-1 line-clamp-2 break-words overflow-hidden">
                  {news?.title}
                </h4>
                <div className="flex items-center pl-1 gap-2 text-[10px] text-white/30">
                  <span>{getRelativeTimeDesktop(news?.publishedAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="flex items-center gap-1">
                    <FaEye size={9} />
                    {news?.viewCount || 0}
                  </span>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative shrink-0 w-[64px] h-[46px] rounded-lg overflow-hidden border border-white/[0.07]">
                <img
                  src={getImageUrl(news?.newsImages?.[0])}
                  alt={news?.title}
                  className="w-full h-full object-cover transition-all duration-500 grayscale-[0.3] group-hover:scale-110 group-hover:grayscale-0"
                  loading="lazy"
                />
                {hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaPlay size={8} className="text-white ml-0.5" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx="true">{`
        @keyframes tagMarquee {
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

        .marquee-tags {
          display: inline-flex;
          width: max-content;
          animation: tagMarquee 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTrending;
