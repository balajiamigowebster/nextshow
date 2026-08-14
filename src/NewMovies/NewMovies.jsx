import React, { useEffect, useState } from "react";
import UpcomingMoviesCarousel from "./UpcomingMoviesCarousel";
import NewReleaseMoviesCarousel from "./NewReleaseMoviesCarousel";
import NewMoviesTrailerCarousel from "./NewMoviesTrailerCarousel";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Nprogress from "nprogress";
import { fetchNewMoviesPage } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import LoadingComponents from "../Components/LoadingComponents";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import UpdateNewMoviesUi from "./UpdateNewMoviesUI/UpdateNewMoviesUi";
import UpdateNewReleaseMovieUi from "./UpdateNewMoviesUI/UpdateNewReleaseMovieUi";

const NewMovies = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("newReleases");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [sortOption, setSortOption] = useState("Popular");
  const [autoPlay, setAutoPlay] = useState(true);

  // Redux state-la irunthu data-vai edukkirom
  const { newMoviesData, isPublicError } = useSelector(
    (state) => state.centralizedMovies,
  );

  const {
    data: homeMoviesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["json-upload-movies"],
    queryFn: async () => {
      const response = await api.get("/admin/get-public-home-data");
      return response.data.data;
    },
  });

  const tabs = [
    { key: "newReleases", label: "New" },
    { key: "upcoming", label: "Upcoming" },
    { key: "trending", label: "Trending" },
  ];

  const newReleases = newMoviesData?.newReleases ?? [];
  const upcoming = homeMoviesData?.theatrical?.upcoming ?? [];
  const trending = homeMoviesData?.theatrical?.trending ?? [];

  const hasData =
    newReleases.length > 0 || upcoming.length > 0 || trending.length > 0;

  // console.log(newMoviesData);
  // Data irukkannu check pannikirom (to avoid re-fetching)
  // const hasData =
  //   newMoviesData.upcoming?.length > 0 || newMoviesData.newReleases?.length > 0;

  useEffect(() => {
    const fetchAllNewMoviesData = async () => {
      // Data munnadiye iruntha fetch panna thavai illai
      if (hasData) {
        setIsPageLoading(false);
        return;
      }

      try {
        setIsPageLoading(true);
        Nprogress.start();

        // Promise.all use panni parallel fetch pandrom
        // Unga slice-la ithu ore API call thaan,
        // aana innum extra calls (videos/ads) add panna ithu helpful-aa irukkum.
        await dispatch(fetchNewMoviesPage()).then(unwrapResult);
        // Inga vera ethavathu fetch thalaivara iruntha add pannikalam
      } catch (error) {
        console.error("New Movies Page Parallel Fetch Error:", error);
      } finally {
        setIsPageLoading(false);
        Nprogress.done();
      }
    };

    fetchAllNewMoviesData();
  }, [dispatch, hasData]);

  // Loading Screen
  if (isLoading) {
    return <LoadingComponents />;
  }

  // Error handle (Optional)
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500">Failed to load content. Please try again</p>
      </div>
    );
  }

  return (
    <div className="mt-28 px-4 md:px-8 bg-[#0f0f0f] min-h-[calc(100vh-320px)] md:min-h-[calc(100vh-100px)]">
      {/* <div className="rounded-[28px] border border-white/10 shadow-2xl shadow-black/30 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-zinc-950 px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-5 py-2 text-[12px] md:text-base font-semibold transition cursor-pointer select-auto duration-200 ${
                    activeTab === tab.key
                      ? "bg-orange-500 shadow-lg shadow-orange-500/30 "
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-0 py-2 md:px-2">
          {activeTab === "newReleases" && (
            <NewReleaseMoviesCarousel
              newReleases={newReleases}
              newMovies={homeMoviesData?.theatrical?.newRelease ?? []}
            />
          )}

          {activeTab === "upcoming" && (
            <UpcomingMoviesCarousel
              upcomingMovies={upcoming}
              upcomming={upcoming}
            />
          )}

          {activeTab === "trending" && (
            <NewMoviesTrailerCarousel trendingMovies={trending} />
          )}

          {!hasData && (
            <div className="flex min-h-[260px] items-center justify-center rounded-[24px] bg-[#111827] px-6 py-12 text-center">
              <p className="text-slate-400">
                No content available yet. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </div> */}
      <div className="">
        <div className="pt-8 pb-14">
          <div className="ml-1 mb-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Left Accent Bar */}
              <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500" />

              {/* Text */}
              <div className="flex flex-col">
                <span
                  className="
          text-[9px]
          md:text-[11px]
          uppercase
          tracking-[0.35em]
          text-zinc-500
          font-semibold
        "
                >
                  New Movies
                </span>

                <h2
                  className="
          text-[15px]
          md:text-[20px]
          font-black
          uppercase
          tracking-widest
          bg-gradient-to-r
          from-zinc-600
          via-zinc-300
          to-zinc-600
          bg-clip-text
          text-transparent
        "
                >
                  New Release
                </h2>
              </div>
            </div>
          </div>
          <UpdateNewReleaseMovieUi
            newReleaseMovies={homeMoviesData?.theatrical?.newRelease ?? []}
          />
        </div>
        <div className="pt-12 md:pt-16">
          <div className="ml-1 mb-4 flex items-center gap-3">
            {/* Left Accent Bar */}
            <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500" />

            {/* Text Content */}
            <div className="flex flex-col">
              <span
                className="
        text-[9px]
        md:text-[11px]
        uppercase
        tracking-[0.35em]
        text-zinc-500
        font-semibold
      "
              >
                New Movies
              </span>

              <h2
                className="
        text-[15px]
        md:text-[20px]
        font-black
        uppercase
        tracking-widest
        bg-gradient-to-r
        from-zinc-600
        via-zinc-300
        to-zinc-600
        bg-clip-text
        text-transparent
      "
              >
                Upcoming
              </h2>
            </div>
          </div>
          <UpdateNewMoviesUi upcomingNewMovies={upcoming} />
        </div>
      </div>
    </div>
  );
};

export default NewMovies;
