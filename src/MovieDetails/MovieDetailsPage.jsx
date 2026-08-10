import React, { useEffect, useState } from "react";
import MovieDetailsHeader from "./MovieDetailsHeader";
import MovieGallery from "./MovieGallery";
import TopCast from "./TopCast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Nprogress from "nprogress";
import { fetchMovieBySlug } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import LoadingComponents from "../Components/LoadingComponents";
import MovieTimelineUI from "./MovieTimelineUI";
import MovieDescriptionSection from "./MovieDescriptionSection";
import MovieTimeline from "./MovieTimelineUI";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../api";
import { useSnackbar } from "../../context/SnackbarContext";
import { useToggleWatchlist, useWatchlistStatus } from "../hooks/useWatchlist";
import ReviewsCarousel from "./Reviewscarousel";
import {
  useMovieAnalytics,
  useMovieDetailsAnalyticQuery,
  useMovieDetailsAvgRatingData,
} from "../hooks/useMovieDetailsAnalytics";
import { HiHome } from "react-icons/hi";
import { BiCameraMovie } from "react-icons/bi";
import { motion } from "framer-motion";

const MovieDetailsPage = () => {
  const { slug } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const dispatch = useDispatch();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { showSnackbar } = useSnackbar;
  const queryClient = useQueryClient();

  // Redux state-la irunthu details-ah edukirom
  const { currentMovie, isPublicLoading, isPublicError, message } = useSelector(
    (state) => state.centralizedMovies,
  );

  // console.log("CURRENT MOVIE", currentMovie);

  // ======================================================
  // ✅ WATCHLIST STATUS
  // ======================================================
  const {
    data: watchlistData,
    isLoading: watchlistLoading,
    isError: watchlistError,
    error: watchlistErrorMessage,
    refetch: refetchWatchlist,
  } = useWatchlistStatus({
    movieId: movieData?.id,
    enabled: !!movieData?.id,
  });

  // ======================================================
  // ✅ TOGGLE WATCHLIST
  // ======================================================
  const toggleWatchlistMutation = useToggleWatchlist({
    movieId: movieData?.id,
  });

  const isInWatchlist = watchlistData?.inWatchlist || false;
  // console.log("IsWatchList", isInWatchlist);

  // ======================================
  // MOVIE ANALYTICS
  // ======================================

  useMovieAnalytics(movieData?.id);
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isFetching: analyticsFetching,
  } = useMovieDetailsAnalyticQuery(movieData?.id);

  const movieDetailsMutation = useMutation({
    mutationFn: async (movieSlug) => {
      Nprogress.start();
      setIsPageLoading(true);
      const response = await api.get(
        `/admin/get-movie-admin-details-by-slug/${movieSlug}`,
      );
      console.log(response.data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setMovieData(data);
      Nprogress.done();
      setIsPageLoading(false);
    },
    onError: (error) => {
      console.error("Fetch Movie Error:", error);
      Nprogress.done();
      setIsPageLoading(false);
    },
  });

  useEffect(() => {
    if (slug && slug !== "undefined") {
      movieDetailsMutation.mutate(slug);
    }
  }, [slug]);

  useEffect(() => {
    const releaseDate =
      movieData?.theattheatreReleaseDate || movieData?.ottReleaseDate;

    let releaseYear = "";
    if (releaseDate) {
      releaseYear = releaseDate.match(/\d{4}/)?.[0] || "";
    }

    if (movieData?.title) {
      document.title = releaseYear
        ? `NextShow | ${movieData.title} (${releaseYear})`
        : `NextShow | ${movieData.title}`;
    }
  }, [movieData]);

  // ======================================================
  // ✅ CHECK MARK WATCHED STATUS
  // ======================================================

  // const {
  //   data: watchedData,
  //   isLoading: watchedLoading,
  //   isError: watchedError,
  // } = useQuery({
  //   queryKey: ["mark-watched", movieData?.id],
  //   queryFn: async ({ queryKey }) => {
  //     // ============================================
  //     // ✅ GET MOVIE ID FROM QUERY KEY
  //     // ============================================
  //     const [, movieId] = queryKey;
  //     console.log("MovieID", movieId);
  //     const response = await api.get(
  //       `/auth/user/check-mark-watched/${movieId}`,
  //     );
  //     console.log("Watched Data Movie", response.data);
  //     return response.data;
  //   },
  //   // ====================================================
  //   // ✅ ONLY RUN AFTER MOVIE DATA AVAILABLE
  //   // ====================================================
  //   enabled: !!movieData?.id,
  // });

  // ======================================================
  // ✅ PARALLEL USER ACTIVITY QUERIES
  // ======================================================

  const userActivityQueries = useQueries({
    queries: [
      // ==================================================
      // ✅ MARK WATCHED STATUS
      // ==================================================
      {
        queryKey: ["mark-watched", movieData?.id],
        queryFn: async ({ queryKey }) => {
          // ============================================
          // ✅ GET MOVIE ID FROM QUERY KEY
          // ============================================
          const [, movieId] = queryKey;
          // console.log("MovieID", movieId);
          const response = await api.get(
            `/auth/user/check-mark-watched/${movieId}`,
          );
          // console.log("Watched Data Movie", response.data);
          return response.data;
        },
        enabled: !!movieData?.id,
        refetchOnWindowFocus: false,
      },
      // ==================================================
      // ✅ USER MOVIE RATING
      // ==================================================
      {
        queryKey: ["user-movie-rating", movieData?.id],
        queryFn: async () => {
          const response = await api.get(
            `/auth/user/get-user-rating/${movieData.id}`,
          );
          return response.data;
        },
        enabled: !!movieData?.id,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const {
    averageRating,
    currentUserReview,
    isLoading: avgRatingLoading,
  } = useMovieDetailsAvgRatingData(movieData?.id);

  // ======================================================
  // ✅ WATCHED QUERY
  // ======================================================
  const watchedData = userActivityQueries[0]?.data;
  const watchedLoading = userActivityQueries[0]?.isLoading;
  const watchedError = userActivityQueries[0]?.isError;

  // ======================================================
  // ✅ USER RATING QUERY
  // ======================================================
  const userRatingData = userActivityQueries[1]?.data;
  const userRatingLoading = userActivityQueries[1]?.isLoading;
  const userRatingError = userActivityQueries[1]?.isError;

  const toggleMarkWatchedMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/user/toggle-mark-watched", {
        movieId: movieData?.id,
      });

      return response.data;
    },

    // ======================================================
    // ✅ OPTIMISTIC UPDATE
    // ======================================================

    onMutate: async () => {
      // ============================================
      // ✅ STOP OLD REQUESTS
      // ============================================

      await queryClient.cancelQueries({
        queryKey: ["mark-watched", movieData?.id],
      });

      // ============================================
      // ✅ GET OLD DATA
      // ============================================

      const previousWatchedData = queryClient.getQueryData([
        "mark-watched",
        movieData?.id,
      ]);

      // ============================================
      // ✅ INSTANT UI UPDATE
      // ============================================

      queryClient.setQueryData(
        ["mark-watched", movieData?.id],

        (oldData) => ({
          ...oldData,

          watched: !oldData?.watched,
        }),
      );

      // ============================================
      // ✅ RETURN CONTEXT
      // ============================================

      return {
        previousWatchedData,
      };
    },

    // ======================================================
    // ✅ SUCCESS
    // ======================================================

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mark-watched", movieData?.id],
      });
    },

    // ======================================================
    // ✅ ERROR ROLLBACK
    // ======================================================

    onError: (error, variables, context) => {
      console.log("TOGGLE MARK WATCHED ERROR", error);

      // ============================================
      // ✅ ROLLBACK
      // ============================================

      queryClient.setQueryData(
        ["mark-watched", movieData?.id],
        context.previousWatchedData,
      );
    },
  });

  // ======================================================
  // ✅ ADD MOVIE RATING
  // ======================================================
  const addMovieRatingMutation = useMutation({
    mutationFn: async (ratingData) => {
      const response = await api.post(
        "/auth/user/add-update-rating",
        ratingData,
      );
      return response.data;
    },
    // ======================================================
    // ✅ OPTIMISTIC UPDATE
    // ======================================================
    onMutate: async (ratingData) => {
      // ============================================
      // ✅ CANCEL OLD REQUEST
      // ============================================
      await queryClient.cancelQueries({
        queryKey: ["user-movie-rating", movieData?.id],
      });

      // ============================================
      // ✅ OLD DATA
      // ============================================
      const previousRatingData = queryClient.getQueryData([
        "user-movie-rating",
        movieData?.id,
      ]);
      // ============================================
      // ✅ INSTANT UI UPDATE
      // ============================================
      queryClient.setQueryData(
        ["user-movie-rating", movieData?.id],

        () => ({
          success: true,

          rated: true,

          data: {
            rating: ratingData.rating,
            review: ratingData.review,
          },
        }),
      );
      return {
        previousRatingData,
      };
    },
    // ======================================================
    // ✅ SUCCESS
    // ======================================================
    onSuccess: async () => {
      await Promise.all([
        // ============================================
        // ✅ REFRESH CURRENT USER REVIEW
        // ============================================
        queryClient.invalidateQueries({
          queryKey: ["user-movie-rating", movieData?.id],
        }),

        // ============================================
        // ✅ REFRESH ALL MOVIE REVIEWS
        // ============================================
        queryClient.invalidateQueries({
          queryKey: ["movie-reviews", movieData?.id],
        }),
      ]);
    },
    // ======================================================
    // ✅ ERROR ROLLBACK
    // ======================================================
    onError: (error, variables, context) => {
      console.log("ADD MOVIE RATING ERROR", error);

      // ============================================
      // ✅ ROLLBACK
      // ============================================

      queryClient.setQueryData(
        ["user-movie-rating", movieData?.id],
        context.previousRatingData,
      );
    },
  });

  // Loading Screen
  if (isPageLoading) {
    return <LoadingComponents />;
  }

  // Error vantha handle panna
  if (movieDetailsMutation.isError) {
    return (
      <div
        className="
        min-h-[calc(100vh-140px)]
        md:min-h-[calc(100vh-120px)]
        mt-20
        flex
        items-center
        justify-center

        overflow-hidden

        px-4
        md:px-6

        bg-[#0b0b0f]
      "
      >
        <div className="relative w-full max-w-md md:max-w-xl">
          {/* Background Glow */}
          <div
            className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2

            w-[180px]
            h-[180px]

            md:w-[300px]
            md:h-[300px]

            bg-orange-500/5

            blur-[90px]
            md:blur-[140px]

            rounded-full
          "
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
            }}
            className="
            relative
            overflow-hidden

            rounded-[24px]
            md:rounded-[32px]

            border
            border-white/5

            bg-gradient-to-br
            from-white/[0.03]
            via-white/[0.015]
            to-transparent

            backdrop-blur-2xl

            p-5
            sm:p-6
            md:p-10

            text-center

            shadow-[0_20px_80px_rgba(0,0,0,0.35)]
          "
          >
            {/* Ambient Glow */}
            <div
              className="
              absolute
              inset-0

              bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_50%)]

              pointer-events-none
            "
            />

            {/* Icon */}
            <div className="relative flex justify-center mb-4 md:mb-6">
              <div
                className="
                w-14
                h-14

                md:w-20
                md:h-20

                rounded-full

                bg-orange-500/10

                border
                border-orange-500/20

                backdrop-blur-xl

                flex
                items-center
                justify-center
              "
              >
                <BiCameraMovie
                  className="
                  text-orange-400
                  text-[28px]
                  md:text-[42px]
                "
                />
              </div>
            </div>

            {/* Title */}
            <h2
              className="
              text-white

              text-[30px]
              sm:text-[36px]
              md:text-5xl

              font-bold

              mb-3
            "
            >
              Movie Not Found
            </h2>

            {/* Description */}
            <p
              className="
              text-zinc-400

              text-[13px]
              sm:text-sm
              md:text-base

              leading-6
              md:leading-7

              max-w-md
              mx-auto
            "
            >
              The movie you're looking for may have been removed, renamed, or
              the link may no longer be available.
            </p>

            {/* Divider */}
            <div
              className="
              w-16
              md:w-24

              h-px

              bg-gradient-to-r
              from-transparent
              via-orange-500/30
              to-transparent

              mx-auto

              my-5
              md:my-8
            "
            />

            {/* Buttons */}
            <div
              className="
              flex
              flex-col
              sm:flex-row

              items-center
              justify-center

              gap-2
              md:gap-3
            "
            >
              <Link
                to="/"
                className="
                flex
                items-center
                justify-center

                gap-2

                w-full
                sm:w-auto

                px-5
                md:px-6

                py-3

                rounded-xl

                bg-orange-500

                text-white

                text-sm
                md:text-base

                font-medium

                hover:bg-orange-600

                transition-all
                duration-300
              "
              >
                <HiHome size={16} />
                Go To Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="
                w-full
                sm:w-auto

                px-5
                md:px-6

                py-3

                rounded-xl

                border
                border-white/10

                text-zinc-300

                text-sm
                md:text-base

                hover:bg-white/5

                transition-all
                duration-300
              "
              >
                Go Back
              </button>
            </div>

            {/* Error Message */}
            {message && (
              <div
                className="
                mt-5
                md:mt-6

                rounded-xl

                border
                border-white/5

                bg-white/[0.02]

                px-3
                py-2
                md:px-4
                md:py-3
              "
              >
                <p className="text-[11px] md:text-xs text-zinc-500 break-words">
                  {message}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Data illa na onnum kaatatha
  if (!movieData) return null;

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4 md:px-6 min-h-[calc(100vh-320px)] md:min-h-[calc(100vh-100px)]">
      <MovieDetailsHeader
        movie={movieData}
        isRatingModalOpen={isRatingModalOpen}
        setIsRatingModalOpen={setIsRatingModalOpen}
        userRatingData={userRatingData}
        userRatingLoading={userRatingLoading}
        addMovieRatingMutation={addMovieRatingMutation}
        averageRating={averageRating}
        avgRatingLoading={avgRatingLoading}
      />
      <MovieDescriptionSection
        movie={movieData}
        isRatingModalOpen={isRatingModalOpen}
        setIsRatingModalOpen={setIsRatingModalOpen}
        // ============================================
        // ✅ MARK WATCHED
        // ============================================
        watchedData={watchedData}
        watchedLoading={watchedLoading}
        watchedError={watchedError}
        toggleMarkWatchedMutation={toggleMarkWatchedMutation}
        // ============================================
        // ✅ USER RATING
        // ============================================
        userRatingData={userRatingData}
        userRatingLoading={userRatingLoading}
        userRatingError={userRatingError}
        addMovieRatingMutation={addMovieRatingMutation}
        // ============================================
        // ✅ WATCHLIST
        // ============================================
        isInWatchlist={isInWatchlist}
        watchlistLoading={watchlistLoading}
        watchlistError={watchlistError}
        watchlistErrorMessage={watchlistErrorMessage}
        refetchWatchlist={refetchWatchlist}
        toggleWatchlistMutation={toggleWatchlistMutation}
        analyticsData={analyticsData}
        analyticsLoading={analyticsLoading}
        analyticsFetching={analyticsFetching}
        currentUserReview={currentUserReview}
      />

      {/* 2. Main Content Grid (Split into Left & Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 ">
        {/* LEFT SIDE (8 Columns): Gallery, Description, Cast */}
        <div className="lg:col-span-9 ">
          <MovieGallery movie={movieData} />
          <div className="grid grid-cols-1 lg:grid-cols-1">
            <ReviewsCarousel movieId={movieData?.id} />
          </div>
          <TopCast movie={movieData} />
        </div>

        {/* RIGHT SIDE (4 Columns): Movie Timeline (Sidebar) */}
        <div className="lg:col-span-3">
          {/* {!isRatingModalOpen && <MovieTimeline movie={movieData} />} */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
