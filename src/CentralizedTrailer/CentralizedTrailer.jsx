import React, { useState, useMemo } from "react";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import TrailerTabs from "./tabs/TrailerTabs";
import ArrowButton from "./TrailerComponents/ArrowButton";
import TrailerContentContainer from "./TrailerContentContainer";
import { useEffect } from "react";
import { useTrailerTeaserList } from "../hooks/useTrailerTeaserList";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const TimelineContent = ({
  YEARS,
  selectedYear,
  setSelectedYear,
  yearPopupOpen,
  setYearPopupOpen,
  selectedMonth,
  setSelectedMonth,
  direction = "forward",
}) => {
  const timelineMonths = useMemo(() => {
    const CURRENT = new Date();
    const currentMonth = CURRENT.getMonth();
    const currentYear = CURRENT.getFullYear();
    const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const list = [];
    
    if (direction === "backward") {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        list.push({
          name: MONTH_NAMES[d.getMonth()],
          monthNumber: d.getMonth() + 1,
          year: d.getFullYear(),
        });
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const d = new Date(currentYear, currentMonth + i, 1);
        list.push({
          name: MONTH_NAMES[d.getMonth()],
          monthNumber: d.getMonth() + 1,
          year: d.getFullYear(),
        });
      }
    }
    return list;
  }, [direction]);

  return (
    <div
      className="
        w-[50px]
        md:w-[90px]
        shrink-0
        rounded-tr-xl
        md:rounded-tr-2xl
        rounded-br-xl
        md:rounded-br-2xl
        border
        border-zinc-800
        bg-zinc-900
        overflow-visible
        mt-2
      "
    >
      {/* Year */}

      <div
        className="
    h-6
    md:h-13
    border-b
    border-zinc-800
    flex
    items-center
    justify-center
    relative
  "
      >
        <button
          onClick={() => {
            console.log("Run year popup");
            setYearPopupOpen(!yearPopupOpen);
          }}
          className="
      flex
      items-center
      justify-center
      gap-[2px]
      w-full
      cursor-pointer
      h-full
    "
        >
          <h2
            className="
        text-[12px]
        md:text-lg
        font-black
        tracking-widest
        bg-gradient-to-b
        from-zinc-100
        via-zinc-400
        to-zinc-700
        bg-clip-text
        text-transparent
      "
          >
            {selectedYear}
          </h2>
        </button>

        <AnimatePresence>
          {yearPopupOpen && (
            <motion.div
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -10,
              }}
              className="
          absolute
  left-full
  top-0
  ml-2
  z-50
  w-[90px]
  max-h-[220px]
  overflow-y-auto
  no-scrollbar
  rounded-xl
  border
  border-zinc-700/50
  bg-zinc-900
  backdrop-blur-md
  shadow-xl
        "
            >
              {YEARS.map((year) => (
                <button
                  key={year}
                  disabled={selectedYear === year}
                  onClick={() => {
                    setSelectedYear(year);
                    setYearPopupOpen(false);
                  }}
                  className={`
              w-full
              py-2
              text-[12px]
              font-semibold
              transition-all

              ${
                selectedYear === year
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-800/60 hover:text-white"
              }
            `}
                >
                  {year}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Months */}

      <div
        className="
          h-[240px]
          md:h-[280px]
          overflow-y-auto
          custom-scrollbar
        "
      >
        {MONTHS.map((month, index) => {
          const monthNumber = index + 1;
          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(monthNumber)}
              className={`
              w-full
              h-10
              md:h-10
              border-b
              border-zinc-800
              text-center
              text-[8px]
              md:text-[11px]
              tracking-[0.2em]
              font-bold
              transition-all

              ${
                selectedMonth === monthNumber
                  ? `
                    bg-orange-500/10
                    text-orange-400
                    border-r-2
                    border-r-orange-500
                    font-black
                  `
                  : `
                    text-zinc-500
                    hover:text-zinc-200
                    hover:bg-zinc-800/40
                  `
              }
            `}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CentralizedTrailer = () => {
  const CURRENT_YEAR = new Date().getFullYear();
  const CURRENT_MONTH = new Date().getMonth() + 1;

  const YEARS = Array.from(
    { length: CURRENT_YEAR - 2020 + 1 },
    (_, i) => CURRENT_YEAR - i,
  );
  const [activeTab, setActiveTab] = useState("All");
  const [activeSubTab, setActiveSubTab] = useState(null);

  // Mobile drawer state
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [yearPopupOpen, setYearPopupOpen] = useState(false);
  const {
    data: trailerData,
    isLoading,
    isError,
    error,
  } = useTrailerTeaserList({
    year: selectedYear,
    month: selectedMonth,
    mediaType: activeTab.toUpperCase(),
    status: "ALL",
  });

  useEffect(() => {
    if (!trailerData) return;
    if (trailerData.isFallback) {
      if (
        trailerData.displayMonth !== selectedMonth ||
        trailerData.displayYear !== selectedYear
      ) {
        setSelectedMonth(trailerData.displayMonth);
        setSelectedYear(trailerData.displayYear);
      }
    }
  }, [trailerData]);

  // console.log("CentralizedTrailer", trailerData);

  useEffect(() => {
    if (yearPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [yearPopupOpen]);

  return (
    <section className="pt-12 md:pt-16 px-4 md:px-8 bg-[#0f0f0f]">
      <TrailerTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* ================= CONTENT SECTION ================= */}

      <div className="mt-0 md:mt-2 gap-[5px] md:gap-2 flex">
        {/* <div className="relative md:hidden">
          <ArrowButton
            direction={isTimelineOpen ? "left" : "right"}
            top="20px"
            right={-18}
            size={20}
            // onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          />

          <AnimatePresence>
            
              <motion.div
                initial={{
                  width: 0,
                  opacity: 0,
                }}
                animate={{
                  width: 50,
                  opacity: 1,
                }}
                exit={{
                  width: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="
          overflow-hidden
          shrink-0
        "
              >
                <TimelineContent />
              </motion.div>
            
          </AnimatePresence>
        </div> */}

        {/* ================= TABLET + DESKTOP TIMELINE ================= */}

        <div className="md:block shrink-0">
          <TimelineContent
            YEARS={YEARS}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            yearPopupOpen={yearPopupOpen}
            setYearPopupOpen={setYearPopupOpen}
            direction="forward"
          />
        </div>

        {/* ================= CONTENT ================= */}

        <motion.div
          layout
          className="
             flex-1
             mt-2
    min-w-0
    w-full
    rounded-2xl

    
          "
        >
          <TrailerContentContainer
            trailerData={trailerData?.data || []}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CentralizedTrailer;
