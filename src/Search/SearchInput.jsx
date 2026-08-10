import React, { useMemo } from "react";
import { HiSearch, HiStar } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${IMAGE_BASE_URL}${imagePath}`;
};

const SearchInput = ({ keyword, setKeyword, open, setOpen, isMobile, onClose }) => {
  const navigate = useNavigate();

  // Retrieve cached home movies data
  const { data: homeMoviesData } = useQuery({
    queryKey: ["json-upload-movies"],
    enabled: false, // Reads only from cache
  });

  // Retrieve cached trending news/blogs
  const { data: trendingNewsResponse } = useQuery({
    queryKey: ["trending-news"],
    enabled: false, // Reads only from cache
  });

  // Build the list of all unique movies
  const allMovies = useMemo(() => {
    const movies = [];
    const seenIds = new Set();

    const addMovies = (list) => {
      if (Array.isArray(list)) {
        list.forEach((m) => {
          if (m && m.id && !seenIds.has(m.id)) {
            seenIds.add(m.id);
            movies.push(m);
          }
        });
      }
    };

    if (homeMoviesData) {
      addMovies(homeMoviesData.theatrical?.upcoming);
      addMovies(homeMoviesData.theatrical?.newRelease);
      addMovies(homeMoviesData.theatrical?.trending);
      addMovies(homeMoviesData.streaming?.upcoming);
      addMovies(homeMoviesData.streaming?.newRelease);
      addMovies(homeMoviesData.streaming?.trending);
    }
    return movies;
  }, [homeMoviesData]);

  // Build the list of all news items
  const allNews = useMemo(() => {
    return Array.isArray(trendingNewsResponse) ? trendingNewsResponse : [];
  }, [trendingNewsResponse]);

  // Filter movies and news based on keyword
  const searchResults = useMemo(() => {
    const query = keyword.toLowerCase().trim();
    if (!query) {
      return { movies: [], news: [] };
    }

    const filteredMovies = allMovies.filter((m) => {
      const titleMatch = m.title?.toLowerCase().includes(query);
      const directorMatch = m.director?.toLowerCase().includes(query);
      const castMatch = m.cast?.toLowerCase().includes(query);
      const genreMatch = m.genres?.some((g) => g?.toLowerCase().includes(query));
      return titleMatch || directorMatch || castMatch || genreMatch;
    });

    const filteredNews = allNews.filter((n) => {
      const titleMatch = n.title?.toLowerCase().includes(query);
      const descMatch = n.description?.toLowerCase().includes(query);
      return titleMatch || descMatch;
    });

    return { movies: filteredMovies, news: filteredNews };
  }, [keyword, allMovies, allNews]);

  // Popular searches to display when keyword is empty
  const popularSearches = useMemo(() => {
    return allMovies.slice(0, 4);
  }, [allMovies]);

  const handleItemClick = (path) => {
    navigate(path);
    setOpen(false);
    setKeyword("");
    if (onClose) onClose();
  };

  const hasResults = searchResults.movies.length > 0 || searchResults.news.length > 0;

  return (
    <div className={`relative flex-1 ${isMobile ? "w-full mx-0" : "max-w-[700px] mx-5"}`}>
      <form onSubmit={(e) => e.preventDefault()} className="relative w-full group flex items-center">
        <div
          className="
            relative
            w-full
            flex
            items-center
            bg-[#0f0f0f]/60
            border
            border-white/10
            rounded-full
            p-1.5
            transition-all
            duration-300
            focus-within:bg-black/70
            focus-within:border-orange-500/50
            focus-within:ring-4
            focus-within:ring-orange-500/10
            shadow-2xl
          "
        >
          {/* Search Icon */}
          <div className="pl-4 pr-2 text-white/40 focus-within:text-orange-500 transition-colors">
            <HiSearch className="text-xl" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={keyword}
            placeholder="Search movies, genres, cast..."
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onChange={(e) => {
              setKeyword(e.target.value);
              setOpen(true);
            }}
            className="
              flex-1
              bg-transparent
              border-none
              text-white
              text-sm
              py-2
              px-2
              focus:outline-none
              placeholder:text-white/30
            "
          />

          {/* Search Button */}
          <button
            type="submit"
            onClick={() => setOpen(true)}
            className="
              bg-orange-500
              hover:bg-orange-600
              cursor-pointer
              text-white
              px-6
              py-2.5
              rounded-full
              text-xs
              font-extrabold
              uppercase
              tracking-wider
              transition-all
              active:scale-95
              shadow-lg
              shadow-orange-500/20
            "
          >
            SEARCH
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute
              top-full
              mt-3
              left-0
              right-0
              rounded-3xl
              border
              border-white/10
              bg-[#121214]/98
              backdrop-blur-xl
              shadow-[0_20px_50px_rgba(0,0,0,0.8)]
              overflow-hidden
              z-[99999]
              ${isMobile ? "w-full" : ""}
            `}
          >
            <div className="p-6 max-h-[450px] overflow-y-auto custom-scrollbar">
              {!keyword.trim() ? (
                // Popular/Recent Searches
                <div>
                  <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-4">
                    Popular Searches
                  </h3>
                  {popularSearches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {popularSearches.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(`/movie/${item.slug}`)}
                          className="flex items-center gap-3 p-2 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-pointer group"
                        >
                          <img
                            src={getImageUrl(item.bannerImage || (item.galleryLinks && item.galleryLinks[0]))}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded-xl bg-zinc-800 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <h4 className="text-white text-sm font-bold truncate group-hover:text-orange-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-white/40 text-xs truncate mt-1">
                              {item.genres?.join(", ") || "Action"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm">No suggestions available.</p>
                  )}
                </div>
              ) : hasResults ? (
                // Filtered Search Results
                <div className="space-y-6">
                  {/* Movies list */}
                  {searchResults.movies.length > 0 && (
                    <div>
                      <h3 className="text-orange-400 text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        <span>Movies & Streaming</span>
                        <span className="bg-orange-500/10 text-orange-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                          {searchResults.movies.length}
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 gap-2.5">
                        {searchResults.movies.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(`/movie/${item.slug}`)}
                            className="flex items-center gap-4 p-2.5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                          >
                            <img
                              src={getImageUrl(item.bannerImage || (item.galleryLinks && item.galleryLinks[0]))}
                              alt={item.title}
                              className="w-10 h-14 object-cover rounded-xl bg-zinc-800 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-sm font-bold truncate group-hover:text-orange-400 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-white/50 text-[11px] truncate mt-0.5">
                                {item.genres?.join(" • ") || "Drama"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-white/40">
                                  {item.theatreReleaseDate || item.ottReleaseDate || "COMING SOON"}
                                </span>
                                {item.imdbRating > 0 && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-yellow-500 font-bold">
                                    <HiStar className="text-xs" />
                                    {item.imdbRating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News list */}
                  {searchResults.news.length > 0 && (
                    <div>
                      <h3 className="text-orange-400 text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        <span>Trending News</span>
                        <span className="bg-orange-500/10 text-orange-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                          {searchResults.news.length}
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 gap-2.5">
                        {searchResults.news.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(`/news/${item.slug}`)}
                            className="p-3 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                          >
                            <h4 className="text-white text-sm font-bold line-clamp-1 group-hover:text-orange-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-white/40 text-xs mt-1.5 flex items-center gap-2">
                              <span>News</span>
                              <span>•</span>
                              <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // No Results
                <div className="text-center py-8">
                  <p className="text-white/50 text-sm">
                    No results found for <span className="text-orange-400 font-bold">"{keyword}"</span>
                  </p>
                  <p className="text-zinc-500 text-xs mt-2">
                    Try searching for other movies, genres, or cast.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;
