import React, { useEffect, useState } from "react";
import StreamingUpcommingMovies from "./StreamingUpcommingMovies";
import StreamingNewRelease from "./StreamingNewRelease";
import { useDispatch, useSelector } from "react-redux";
import Nprogress from "nprogress";
import { fetchActiveStreaming } from "../redux/StreamingNowSlice/StreamVideo";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchStreamingNowPage } from "../redux/CentralizedMovieSlice/CentralizedMovieSlice";
import LoadingComponents from "../Components/LoadingComponents";
import StreamingTrailer from "./StreamingTrailer";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import UpdateStreamingUi from "./UpdateStreamingUI/UpdateStreamingUi";
import UpdateNewReleaseUi from "./UpdateStreamingUI/UpdateNewReleaseUi";

const StreamingNow = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("newRelease");

  const { streamingData } = useSelector((state) => state.centralizedMovies);

  const {
    data: homeMoviesData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["json-upload-movies"],
    queryFn: async () => {
      const response = await api.get("/admin/get-public-home-data");
      console.log("New Movies Data", response.data.data);
      return response.data.data;
    },
    // refetchOnWindowFocus: false,
  });

  //console.log(streamingData);

  const tabs = [
    { key: "newRelease", label: "Streaming" },
    { key: "upcoming", label: "Upcoming" },
    { key: "trending", label: "Trending" },
  ];

  useEffect(() => {
    const fetchAllHomeData = async () => {
      try {
        Nprogress.start();
        await Promise.all([
          dispatch(fetchActiveStreaming()).then(unwrapResult),
          dispatch(fetchStreamingNowPage()).then(unwrapResult),
        ]);
      } catch (error) {
        console.error("Home Page Parallel Fetch Error:", error);
      } finally {
        Nprogress.done();
      }
    };
    fetchAllHomeData();
  }, [dispatch]);

  // Loading Screen
  if (isLoading) {
    return <LoadingComponents />;
  }

  // Error handle (Optional)
  if (isError) {
    return (
      <div className="flex  items-center mt-10 md:mt-14 lg:mt-20 justify-center min-h-[calc(100vh-320px)] md:min-h-[calc(100vh-100px)] px-4">
        <div
          className="
          w-full
          max-w-2xl
          rounded-3xl
          border
          border-red-500/20
          bg-gradient-to-b
          from-zinc-900
          to-black
          p-8
          md:p-12
          text-center
          shadow-[0_0_40px_rgba(239,68,68,0.08)]
        "
        >
          {/* Error Icon */}
          <div
            className="
            mx-auto
            mb-6
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border
            border-red-500/20
            bg-red-500/10
          "
          >
            <span className="text-4xl">⚠</span>
          </div>

          {/* Title */}
          <h2
            className="
            text-2xl
            md:text-4xl
            font-black
            uppercase
            tracking-widest
            bg-gradient-to-r
            from-red-500
            via-white
            to-red-500
            bg-clip-text
            text-transparent
          "
          >
            Something Went Wrong
          </h2>

          {/* Description */}
          <p className="mt-4 text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
            We couldn't load the requested content at the moment. Please reload
            the page or try again later.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              onClick={() => refetch()}
              className="
              px-6
              py-3
              rounded-xl
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              transition-all
            "
            >
              Try Again
            </button>

            <button
              onClick={() => window.history.back()}
              className="
              px-6
              py-3
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              hover:bg-zinc-800
              text-zinc-300
              transition-all
            "
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 md:px-8 bg-[#0f0f0f] min-h-[calc(100vh-320px)] md:min-h-[calc(100vh-100px)]">
      {/* <div className="overflow-hidden rounded-[18px] border border-white/10 shadow-2xl shadow-black/30 md:rounded-[28px]">
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-zinc-950 px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-5 py-2 text-[12px] md:text-base font-semibold transition cursor-pointer select-auto duration-200 ${
                  activeTab === tab.key
                    ? "bg-orange-500 shadow-md shadow-orange-500/25 md:shadow-lg md:shadow-orange-500/30 "
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 px-0 py-0 md:px-2 md:py-2">
          {activeTab === "newRelease" && (
            <StreamingNewRelease
              newReleases={streamingData.newReleases}
              newStreaming={homeMoviesData?.streaming?.newRelease}
            />
          )}

          {activeTab === "upcoming" && (
            <StreamingUpcommingMovies
              upcoming={streamingData.upcoming}
              upcomingStream={homeMoviesData?.streaming?.upcoming}
            />
          )}

          {activeTab === "trending" && (
            <StreamingTrailer
              newReleases={streamingData.newReleases}
              trendingStream={homeMoviesData?.streaming?.trending}
            />
          )}
        </div>
      </div> */}
      <div className="">
        <div className="pt-8 pb-4">
          <div className="ml-1 mb-4 flex items-center gap-3">
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
        text-zinc-500 font-semibold
      "
              >
                Streaming
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
          <div className="mt-6 md:mt-8">
            <UpdateNewReleaseUi
              newReleaseStreaming={homeMoviesData?.streaming?.newRelease}
            />
          </div>
        </div>
        <div className="pt-4 md:pt-6">
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
                Streaming
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

          <div className="mt-6 md:mt-8">
            <UpdateStreamingUi upcoming={homeMoviesData?.streaming?.upcoming} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingNow;
