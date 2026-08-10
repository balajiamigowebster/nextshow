import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaTag } from "react-icons/fa";
import moment from "moment";

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

export const MarqueeTags = ({ tags = [] }) => {
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

const TrendingNewsMobile = ({
  trendingNews,
  trendingLoading,
  trendingError,
  trendingRefetch,
}) => {
  return (
    <div className="md:hidden relative   pt-5 overflow-hidden">
      {/* Header — same gradient bar + gradient text style as Streaming Now */}
      <div className="relative flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500" />
          <h2 className="text-[15px] font-black uppercase tracking-widest bg-gradient-to-r from-zinc-600 via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
            Trending News
          </h2>
        </div>

        <Link
          to="/news"
          className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Loading */}
      {trendingLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!trendingLoading && trendingError && (
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <p className="text-white/60 text-sm mb-3">
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

      {/* Empty */}
      {!trendingLoading && !trendingError && trendingNews?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <p className="text-white/35 text-sm">
            Trending news is not available right now.
          </p>
        </div>
      )}

      {/* 2-row horizontal-scroll grid — free smooth scroll, no snap, no scrollbar */}
      {!trendingLoading && !trendingError && trendingNews?.length > 0 && (
        <div className="grid grid-flow-col grid-rows-2 auto-cols-[260px] gap-3.5 overflow-x-auto no-scrollbar scroll-smooth px-4 pb-1">
          {trendingNews.map((news) => (
            <Link
              key={news?.id}
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
              {/* Left accent bar - zinc gradient */}
              <div className="absolute left-0 top-0 h-full w-[4px] bg-zinc-600" />

              {/* Thumbnail */}
              <div className="relative w-[85px] h-[85px] rounded-lg overflow-hidden shrink-0">
                <img
                  src={getImageUrl(news?.newsImages?.[0])}
                  alt={news?.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[11px] leading-[1.3] text-zinc-100 font-semibold line-clamp-2 group-hover:text-white transition-colors">
                  {news?.title}
                </h3>

                {/* Meta row - date/time scrolls if needed, eye+count always pinned & visible */}
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

                {/* Tags row - marquees automatically when content overflows */}
                {news?.tags?.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden">
                    <MarqueeTags tags={news.tags} />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
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

export default TrendingNewsMobile;
