const TimelineContent = () => (
  <div
    className="
      w-[120px]
      rounded-2xl
      border
      border-zinc-800
      bg-zinc-900
      overflow-hidden
    "
  >
    {/* YEAR */}

    <div className="h-20 border-b border-zinc-800 flex items-center justify-center">
      <h2
        className="
          text-3xl
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
        2026
      </h2>
    </div>

    {/* MONTHS */}

    <div className="h-[650px] overflow-y-auto no-scrollbar">
      {MONTHS.map((month, index) => (
        <button
          key={month}
          className={`
            w-full
            h-14
            border-b
            border-zinc-800
            text-center
            text-[12px]
            tracking-[0.2em]
            font-bold

            ${
              index === 4
                ? `
                  bg-zinc-800
                  text-white
                  border-l-2
                  border-l-orange-500
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
      ))}
    </div>
  </div>
);
