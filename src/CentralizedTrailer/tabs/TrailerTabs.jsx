import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TRAILER_TABS } from "../TrailerTabsData";

const TrailerTabs = ({
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
}) => {
  const activeTabData = TRAILER_TABS.find((t) => t.id === activeTab);
  const subTabs = activeTabData?.subTabs || [];

  const activeSubTabRef = useRef(null);

  useEffect(() => {
    if (subTabs.length > 0) {
      setActiveSubTab(subTabs[0].id);
    } else {
      setActiveSubTab(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeSubTabRef.current) {
      activeSubTabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeSubTab]);

  return (
    <div className="relative bg-[#0f0f0f]">
      {/* ================= HEADING ================= */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-500 via-orange-200 to-orange-500" />

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
            Trailers
          </h2>
        </div>
      </div>

      {/* ================= MAIN TABS ================= */}
      <div className="flex flex-col lg:flex-row gap-0 md:gap-0 lg:gap-10 lg:items-center">
        <div className="relative  lg:max-w-[650px]">
          <div className="absolute -left-3 top-0 bottom-2 w-5 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent z-10 pointer-events-none" />

          <div className="absolute -right-3 top-0 bottom-2 w-5 bg-gradient-to-l from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent z-10 pointer-events-none" />

          <div
            className="
                flex
                items-center
                gap-2
                overflow-x-auto
                no-scrollbar
                scroll-smooth
                
                pb-2
            "
          >
            {TRAILER_TABS.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative
                    shrink-0
                    flex
                    items-center
                    gap-2
                    px-3
                    md:px-4
                    py-1.5 md:py-2 lg:py-3
                    rounded-lg
                    md:rounded-xl
                    border
                    transition-all
                    duration-300
                    whitespace-nowrap

                    ${
                      active
                        ? `
                            border-zinc-500
                            bg-zinc-800
                            text-white
                            shadow-[0_0_15px_rgba(161,161,170,0.15)]
                        `
                        : `
                            border-zinc-800
                            bg-zinc-900
                            text-zinc-400
                            hover:text-zinc-200
                            hover:border-zinc-700
                        `
                    }
                    `}
                >
                  {active && (
                    <span
                      className="
                        absolute
                        inset-0
                        rounded-lg
                        bg-gradient-to-r
                        from-zinc-500/10
                        via-white/5
                        to-zinc-500/10
                        "
                    />
                  )}

                  <span className="relative">{tab.icon}</span>

                  <span
                    className="
                        relative
                        text-[9px]
                        md:text-[10px]
                        font-semibold
                        tracking-wide
                    "
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= SUB TABS ================= */}
        {/* <AnimatePresence mode="wait">
          {subTabs.length > 0 && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative mt-1 mb-2  lg:w-[45%]"
            >
              <div className="absolute left-[19%] lg:hidden top-0 bottom-2 w-5 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent z-10 pointer-events-none" />

              <div className="absolute -right-3 top-0 lg:hidden bottom-2 w-5 bg-gradient-to-l from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent z-10 pointer-events-none" />

              <div className="ml-22 md:ml-0 min-w-0">
                <div
                  className="
                    flex
                    items-center
                    justify-start
                    gap-2
                    overflow-x-auto
                    no-scrollbar
                    scroll-smooth
                    pb-2
                    "
                >
                  {subTabs.map((sub) => {
                    const subActive = activeSubTab === sub.id;

                    return (
                      <button
                        key={sub.id}
                        ref={subActive ? activeSubTabRef : null}
                        onClick={() => setActiveSubTab(sub.id)}
                        className={`
                            relative
                            shrink-0
                            flex
                            items-center
                            gap-2
                            px-3
                            md:px-4
                            py-1.5 md:py-2 lg:py-3
                            rounded-lg
                            md:rounded-xl
                            border
                            transition-all
                            duration-300
                            whitespace-nowrap

                            ${
                              subActive
                                ? `
                                border-zinc-500
                                bg-zinc-800
                                text-white
                                shadow-[0_0_15px_rgba(161,161,170,0.15)]
                                `
                                : `
                                border-zinc-800
                                bg-zinc-900
                                text-zinc-400
                                hover:text-zinc-200
                                hover:border-zinc-700
                                `
                            }
                        `}
                      >
                        {subActive && (
                          <span
                            className="
                                absolute
                                inset-0
                                rounded-lg
                                bg-gradient-to-r
                                from-zinc-500/10
                                via-white/5
                                to-zinc-500/10
                            "
                          />
                        )}

                        <span
                          className="
                            relative
                            text-[8.5px]
                            md:text-[10px]
                            font-medium
                            tracking-wide
                            "
                        >
                          {sub.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </div>
  );
};

export default TrailerTabs;
