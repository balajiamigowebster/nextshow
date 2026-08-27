import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UpdateNewMoviesUpcoming from "./UpdateNewMoviesUpcoming";
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
      for (let i = 0; i < 6; i++) {
        const idx = (currentMonthIdx + i) % 12;
        list.push({
          name: MONTH_NAMES[idx],
          monthNumber: idx + 1,
        });
      }
      return list;
    } else if (direction === "backward") {
      const list = [];
      for (let i = 0; i < 6; i++) {
        const idx = (currentMonthIdx + i) % 12;
        list.push({
          name: MONTH_NAMES[idx],
          monthNumber: idx + 1,
        });
      }
      return list.reverse();
    } else {
      const list = [];
      for (let i = 0; i < 6; i++) {
        list.push({
          name: MONTH_NAMES[i],
          monthNumber: i + 1,
        });
      }
      return list;
    }
  }, [direction]);

  const totalDays = useMemo(() => {
    if (!selectedYear || !selectedMonth) return 0;
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const DAYS = Array.from({ length: totalDays }, (_, i) => i + 1);

  const sortedDays = useMemo(() => {
    return [...DAYS].sort((a, b) => {
      if (selectedDate === a) return -1;
      if (selectedDate === b) return 1;

      const hasDataA = availableDates?.dates?.find((item) => item.day === a)?.hasData;
      const hasDataB = availableDates?.dates?.find((item) => item.day === b)?.hasData;

      if (hasDataA && !hasDataB) return -1;
      if (!hasDataA && hasDataB) return 1;

      return a - b;
    });
  }, [DAYS, selectedDate, availableDates]);

  const handleReset = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDate(null);
    setYearPopupOpen(false);
    setDatePopupOpen(false);
  };

  return (
    <div className="relative overflow-visible h-[292px] md:h-[338px]">
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
          flex
          flex-col
          h-full
        "
      >
        {/* HEADER */}

        <div className="h-8 md:h-10 flex border-b border-zinc-800 flex-shrink-0">
          {/* YEAR */}

          <div className="relative w-full h-full">
            <button
              onClick={() => {
                setYearPopupOpen(!yearPopupOpen);
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
                {selectedYear || new Date().getFullYear()}
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
                    border
                    border-zinc-700
                    bg-zinc-900
                    p-1
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
                      className={`w-full rounded-lg py-2 text-xs font-semibold ${
                        selectedYear === year
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MONTHS */}

        <div className="flex-grow h-0 flex flex-col">
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
              className={`w-full flex-1 flex items-center justify-center border-b border-zinc-800 text-center text-[8px] md:text-[11px] tracking-[0.2em] font-bold transition-all ${
                selectedMonth !== null && selectedMonth === item.monthNumber
                  ? "bg-orange-500/10 text-orange-400 border-r-2 border-r-orange-500 font-black"
                  : "text-zinc-500 hover:bg-zinc-800/40 hover:text-white"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* NOW FOOTER */}
        <div className="h-8 md:h-10 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={handleReset}
            className={`w-full h-full flex items-center justify-center
              text-[8px] md:text-[10px] font-black uppercase tracking-widest 
              transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                selectedMonth === null
                  ? "bg-orange-500/10 text-orange-400 font-black"
                  : "hover:bg-zinc-800/40 text-zinc-300 hover:text-white"
              }`}
          >
            Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// MAIN UI WRAPPER
// Props:
//   upcomingNewMovies = []   → "Upcoming" carousel
// ─────────────────────────────────────────
const UpdateNewMoviesUi = ({ upcomingNewMovies = [] }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [yearPopupOpen, setYearPopupOpen] = useState(false);
  const [datePopupOpen, setDatePopupOpen] = useState(false);

  useEffect(() => {
    const list = Array.isArray(upcomingNewMovies) ? upcomingNewMovies : [];
    if (list.length > 0) {
      const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const currentMonth = new Date().getMonth() + 1;
      
      const hasCurrentMonthData = list.some((movie) => {
        const dateToCheck = movie.theatreReleaseDate || movie.releaseDate;
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
          const dateToCheck = movie.theatreReleaseDate || movie.releaseDate;
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
  }, [upcomingNewMovies, selectedYear]);

  // =========================
  // API CALLS
  // =========================
  const { data: availableDates } = useMovieDateAvailability({
    year: selectedYear,
    month: selectedMonth,
    releaseMode: "THEATRICAL",
    streamType: "UPCOMING",
  });

  const { data: selectedMovies } = useMovieBySelectedDate({
    year: selectedYear,
    month: selectedMonth,
    day: selectedDate,
    releaseMode: "THEATRICAL",
    streamType: "UPCOMING",
  });

  const movies = useMemo(() => {
    const list = Array.isArray(upcomingNewMovies) ? upcomingNewMovies : [];
    if (selectedDate) {
      return selectedMovies?.data ?? [];
    }
    if (selectedMonth) {
      const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return list.filter((movie) => {
        const dateToCheck = movie.theatreReleaseDate || movie.releaseDate;
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
    return list.slice(0, 10);
  }, [selectedDate, selectedMonth, selectedYear, selectedMovies, upcomingNewMovies]);

  return (
    <section>
      <div className="mt-0 md:mt-2 flex">
        {/* Timeline sidebar */}
        <div className="md:block shrink-0">
          <TimelineContent
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            yearPopupOpen={yearPopupOpen}
            setYearPopupOpen={setYearPopupOpen}
            datePopupOpen={datePopupOpen}
            setDatePopupOpen={setDatePopupOpen}
            availableDates={availableDates}
            direction="backward"
          />
        </div>

        {/* Content area */}
        <motion.div layout className="flex-1 mt-0 min-w-0 w-full rounded-2xl">
          <UpdateNewMoviesUpcoming upcomingNewMovies={movies} />
        </motion.div>
      </div>
    </section>
  );
};

export default UpdateNewMoviesUi;
