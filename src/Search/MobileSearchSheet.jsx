import React, { useState, useMemo } from "react";
import { HiSearch, HiStar } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.jpg";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${IMAGE_BASE_URL}${imagePath}`;
};

const MobileSearchSheet = () => {
  const navigate = useNavigate();
  const { isMobileSearchOpen, setIsMobileSearchOpen } = useSearch();
  const [searchQuery, setSearchQuery] = useState("");

  // Retrieve cached home movies data
  const { data: homeMoviesData } = useQuery({
    queryKey: ["json-upload-movies"],
    enabled: false,
  });

  // Retrieve cached trending news/blogs
  const { data: trendingNewsResponse } = useQuery({
    queryKey: ["trending-news"],
    enabled: false,
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

  // Filter movies and news based on searchQuery
  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query.length < 2) {
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
  }, [searchQuery, allMovies, allNews]);

  const handleItemClick = (path) => {
    navigate(path);
    setIsMobileSearchOpen(false);
    setSearchQuery("");
  };

  const hasResults = searchResults.movies.length > 0 || searchResults.news.length > 0;

  return (
    <AnimatePresence>
      {isMobileSearchOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSearchOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-[99998]"
          />

          {/* Bottom Sheet sliding up */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 h-[85vh] bg-[#121214] border-t border-white/10 rounded-t-[30px] z-[99999] flex flex-col overflow-hidden"
          >
            {/* Grab handle for sheet indicator */}
            <div className="w-12 h-1 bg-white/15 rounded-full mx-auto my-3 shrink-0" />

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-4">
              <span className="text-white text-base font-extrabold tracking-widest uppercase">
                Search Movies
              </span>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-[13px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Search Input Bar (No SEARCH button on right on mobile view) */}
            <div className="px-6 py-2 shrink-0">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-3 focus-within:border-orange-500/50 transition-colors">
                <HiSearch className="text-xl text-white/40 mr-3" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, genres, cast..."
                  className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-white/30"
                />
                {searchQuery.length > 0 && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-orange-400 uppercase tracking-wide px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar pb-24">
              {searchQuery.trim().length < 2 ? (
                // Initial prompt matching screenshot exactly
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <HiSearch className="text-5xl text-zinc-700 mb-4" />
                  <p className="text-zinc-500 text-sm">
                    Type to start searching movies...
                  </p>
                </div>
              ) : hasResults ? (
                <div className="space-y-6">
                  {/* Movies Section Grid */}
                  {searchResults.movies.length > 0 && (
                    <div>
                      <h3 className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <span>Movies & Streaming</span>
                        <span className="bg-orange-500/10 text-orange-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {searchResults.movies.length}
                        </span>
                      </h3>
                      
                      {/* Grid cards matching app style */}
                      <div className="grid grid-cols-2 gap-4">
                        {searchResults.movies.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(`/movie/${item.slug}`)}
                            className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 cursor-pointer hover:bg-white/[0.04] transition-all group"
                          >
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900">
                              <img
                                src={getImageUrl(item.bannerImage || (item.galleryLinks && item.galleryLinks[0]))}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              {item.imdbRating > 0 && (
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[9px] text-yellow-500 font-bold">
                                  <HiStar />
                                  {item.imdbRating}
                                </div>
                              )}
                            </div>
                            <div className="mt-2.5 px-1 overflow-hidden">
                              <h4 className="text-white text-[13px] font-bold truncate group-hover:text-orange-400 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-zinc-500 text-[10.5px] truncate mt-0.5">
                                {item.genres?.join(", ") || "Drama"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News Section */}
                  {searchResults.news.length > 0 && (
                    <div>
                      <h3 className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <span>Trending News</span>
                        <span className="bg-orange-500/10 text-orange-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {searchResults.news.length}
                        </span>
                      </h3>
                      <div className="space-y-2.5">
                        {searchResults.news.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(`/news/${item.slug}`)}
                            className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all group"
                          >
                            <h4 className="text-white text-xs font-bold line-clamp-1 group-hover:text-orange-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-zinc-500 text-[10px] mt-1">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // No Results
                <div className="text-center py-16">
                  <p className="text-zinc-400 text-sm">
                    No movies found matching <span className="text-orange-400 font-bold">"{searchQuery}"</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchSheet;
