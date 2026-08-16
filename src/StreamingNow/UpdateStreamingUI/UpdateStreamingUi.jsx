import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UpdateStreamingUpcomming from "./UpdateStreamingUpcoming";
import { useMovieDateAvailability } from "../../hooks/useMovieDateAvailability";
import { useMovieBySelectedDate } from "../../hooks/useMovieBySelectedDate";

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
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDate,
  setSelectedDate,
  yearPopupOpen,
  setYearPopupOpen,
  datePopupOpen,
  setDatePopupOpen,
  availableDates,
  direction = "forward",
}) => {
  const CURRENT = new Date();
  const CURRENT_YEAR = CURRENT.getFullYear();
  const YEARS = Array.from(
    { length: CURRENT_YEAR - 2020 + 1 },
    (_, i) => CURRENT_YEAR - i,
  );

  const monthsList = useMemo(() => {
    const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const currentMonthIdx = CURRENT.getMonth();
    
    if (direction === "forward") {
      const list = [];
      for (let i = 0; i < 12; i++) {
        const idx = (currentMonthIdx + i) % 12;
        list.push({
          name: MONTH_NAMES[idx],
          monthNumber: idx + 1,
        });
      }
      return list;
    } else {
      const list = [];
      for (let i = 0; i < 12; i++) {
        list.push({
          name: MONTH_NAMES[i],
          monthNumber: i + 1,
        });
      }
      return list;
    }
  }, [direction]);

  // Days based on Month + Year
  const totalDays = useMemo(() => {
    if (!selectedYear || !selectedMonth) return 0;
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const DAYS = Array.from({ length: totalDays }, (_, i) => i + 1);

  const isFiltered =
    selectedYear !== null || selectedMonth !== null || selectedDate !== null;

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDate(null);
    setYearPopupOpen(false);
    setDatePopupOpen(false);
  };

  return (
    <div className="relative overflow-visible mt-2">
      {/* Floating Reset Button */}
      <AnimatePresence>
        {isFiltered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-full left-0 right-0 mb-[3px] z-50"
          >
            <button
              onClick={handleReset}
              className="w-full py-[2px] rounded bg-gradient-to-b from-zinc-800 to-black 
                hover:from-zinc-700 hover:to-zinc-900 text-zinc-300 hover:text-white 
                text-[7px] md:text-[8px] font-black uppercase tracking-widest 
                shadow-md shadow-black/40 border border-zinc-800 
                transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="
          w-[55px]
          md:w-[90px]
          shrink-0
          rounded-tr-2xl
          rounded-br-2xl
          border
          border-zinc-800
          bg-zinc-900
          overflow-visible
        "
      >
        {/* ================= HEADER ================= */}

        <div className="h-8 md:h-10 flex border-b border-zinc-800">
          {/* YEAR */}

          <div className="relative flex-1 border-r border-zinc-800">
            <button
              onClick={() => {
                setDatePopupOpen(false);
                setYearPopupOpen((prev) => !prev);
              }}
              className="w-full h-full flex items-center justify-center px-1"
            >
              <span
                className="
                  text-[9px]
                  md:text-[11px]
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
                {selectedYear || "YEAR"}
              </span>
            </button>

            <AnimatePresence>
              {yearPopupOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="
                    absolute
                    left-full
                    top-0
                    ml-2
                    z-50
                    w-[90px]
                    max-h-[260px]
                    overflow-y-auto
                    no-scrollbar
                    rounded-xl
                    p-1
                    border
                    border-zinc-700
                    bg-zinc-900
                    shadow-2xl
                  "
                >
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);

                        const maxDays = new Date(
                          year,
                          selectedMonth,
                          0,
                        ).getDate();

                        if (selectedDate > maxDays) {
                          setSelectedDate(maxDays);
                        }

                        setYearPopupOpen(false);
                      }}
                      className={`
                        w-full
                        rounded-lg
                        py-2
                        text-xs
                        font-semibold
                        ${
                          selectedYear === year
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
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

          {/* DATE */}

          {/* DATE */}

          <div className="relative w-[38px] md:w-[42px]">
            <button
              onClick={() => {
                if (!selectedYear || !selectedMonth) return;
                setYearPopupOpen(false);
                setDatePopupOpen((prev) => !prev);
              }}
              className={`w-full h-full flex items-center justify-center px-1 transition-all ${
                selectedDate ? "bg-orange-500/10 border-l border-white/10" : ""
              }`}
            >
              <span className={`text-[9px] md:text-[11px] font-black tracking-widest ${
                selectedDate ? "text-orange-400" : "text-white"
              }`}>
                {selectedDate || "DATE"}
              </span>
            </button>

            <AnimatePresence>
              {datePopupOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="
                    absolute
                    left-full
                    top-0
                    ml-2
                    z-50
                    w-[80px]
                    max-h-[260px]
                    overflow-y-auto
                    custom-scrollbar
                    rounded-xl
                    border
                    border-zinc-700
                    bg-zinc-900
                    p-1
                    shadow-2xl
                  "
                >
                  {DAYS.map((day) => {
                    const dateInfo = availableDates?.dates?.find(
                      (item) => item.day === day,
                    );

                    const hasData = dateInfo?.hasData;

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedDate(day);
                          setDatePopupOpen(false);
                        }}
                        className={`
                          w-full
                          rounded-lg
                          py-2
                          text-xs
                          font-semibold
                          transition-all
                          ${
                            selectedDate === day
                              ? "bg-zinc-800 text-white font-black"
                              : hasData
                                ? "text-orange-400 hover:bg-zinc-800 hover:text-white"
                                : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= MONTHS ================= */}

        <div className="h-[240px] md:h-[280px] overflow-y-auto custom-scrollbar">
          {monthsList.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                const monthNumber = item.monthNumber;

                setSelectedMonth(monthNumber);

                const maxDays = new Date(
                  selectedYear,
                  monthNumber,
                  0,
                ).getDate();

                if (selectedDate > maxDays) {
                  setSelectedDate(maxDays);
                }
              }}
              className={`
                w-full
                h-10
                border-b
                border-zinc-800
                text-center
                text-[8px]
                md:text-[11px]
                tracking-[0.2em]
                font-bold
                transition-all
                ${
                  selectedMonth !== null && selectedMonth === item.monthNumber
                    ? "bg-orange-500/10 text-orange-400 border-r-2 border-r-orange-500 font-black"
                    : "text-zinc-500 hover:bg-zinc-800/40 hover:text-white"
                }
              `}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const UpdateStreamingUi = ({ upcoming = [] }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(null);

  const [yearPopupOpen, setYearPopupOpen] = useState(false);
  const [datePopupOpen, setDatePopupOpen] = useState(false);

  useEffect(() => {
    const list = Array.isArray(upcoming) ? upcoming : [];
    if (list.length > 0) {
      const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const currentMonth = new Date().getMonth() + 1;
      
      const hasCurrentMonthData = list.some((movie) => {
        const dateToCheck = movie.ottReleaseDate || movie.releaseDate;
        if (!dateToCheck || dateToCheck === "TBA") return false;
        const parts = dateToCheck.trim().split(/\s+/);
        let monthNumber = -1;
        let yearVal = "";
        parts.forEach((part) => {
          const cleanPart = part.toUpperCase().replace(/[^A-Z]/g, "");
          if (cleanPart.length === 3) {
            const idx = MONTH_NAMES.indexOf(cleanPart);
            if (idx !== -1) monthNumber = idx + 1;
          }
          if (/^\d{4}$/.test(part)) yearVal = part;
        });
        return monthNumber === currentMonth && yearVal === String(selectedYear);
      });
      
      if (!hasCurrentMonthData && selectedMonth === currentMonth) {
        let closestMonth = currentMonth;
        let minDiff = 13;
        
        list.forEach((movie) => {
          const dateToCheck = movie.ottReleaseDate || movie.releaseDate;
          if (!dateToCheck || dateToCheck === "TBA") return;
          const parts = dateToCheck.trim().split(/\s+/);
          let monthNumber = -1;
          let yearVal = "";
          parts.forEach((part) => {
            const cleanPart = part.toUpperCase().replace(/[^A-Z]/g, "");
            if (cleanPart.length === 3) {
              const idx = MONTH_NAMES.indexOf(cleanPart);
              if (idx !== -1) monthNumber = idx + 1;
            }
            if (/^\d{4}$/.test(part)) yearVal = part;
          });
          
          if (monthNumber !== -1 && yearVal === String(selectedYear)) {
            const diff = Math.abs(monthNumber - currentMonth);
            if (diff < minDiff) {
              minDiff = diff;
              closestMonth = monthNumber;
            }
          }
        });
        
        setSelectedMonth(closestMonth);
      }
    }
  }, [upcoming, selectedYear]);

  // =========================
  // API CALLS
  // =========================
  const { data: availableDates } = useMovieDateAvailability({
    year: selectedYear,
    month: selectedMonth,
    releaseMode: "DIRECT_STREAMING",
    streamType: "UPCOMING",
  });

  const { data: selectedMovies } = useMovieBySelectedDate({
    year: selectedYear,
    month: selectedMonth,
    day: selectedDate,
    releaseMode: "DIRECT_STREAMING",
    streamType: "UPCOMING",
  });

  const movies = useMemo(() => {
    const list = Array.isArray(upcoming) ? upcoming : [];
    if (selectedDate) {
      return selectedMovies?.data ?? [];
    }
    if (selectedMonth) {
      const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return list.filter((movie) => {
        const dateToCheck = movie.ottReleaseDate || movie.releaseDate;
        if (!dateToCheck || dateToCheck === "TBA") return false;
        const parts = dateToCheck.trim().split(/\s+/);
        
        let monthNumber = -1;
        let yearVal = "";
        
        parts.forEach((part) => {
          const cleanPart = part.toUpperCase().replace(/[^A-Z]/g, "");
          if (cleanPart.length === 3) {
            const idx = MONTH_NAMES.indexOf(cleanPart);
            if (idx !== -1) {
              monthNumber = idx + 1;
            }
          }
          if (/^\d{4}$/.test(part)) {
            yearVal = part;
          }
        });
        
        if (monthNumber === -1 || !yearVal) return false;
        return (!selectedYear || yearVal === String(selectedYear)) && monthNumber === selectedMonth;
      });
    }
    return upcoming;
  }, [selectedDate, selectedMonth, selectedYear, selectedMovies, upcoming]);

  return (
    <section>
      {/* ================= CONTENT SECTION ================= */}
      <div className="mt-0 md:mt-2 flex">
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
          <UpdateStreamingUpcomming upcoming={upcoming} />
        </motion.div>
      </div>
    </section>
  );
};

export default UpdateStreamingUi;
