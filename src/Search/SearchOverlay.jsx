import { AnimatePresence, motion } from "framer-motion";
import { HiSearch, HiX } from "react-icons/hi";

const SearchOverlay = ({ open, onClose, keyword, setKeyword }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background */}

          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              bg-black/70
              backdrop-blur-md
              z-[99999]
            "
          />

          {/* Search Box */}

          <motion.div
            initial={{
              opacity: 0,
              y: -30,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="
              fixed
              top-20
              left-1/2
              -translate-x-1/2

              w-[95%]
              max-w-4xl

              rounded-3xl

              border
              border-white/10

              bg-[#111111]

              shadow-2xl

              overflow-hidden

              z-[100000]
            "
          >
            {/* Search Header */}

            <div className="flex items-center gap-3 p-5 border-b border-white/10">
              <HiSearch className="text-2xl text-zinc-400" />

              <input
                autoFocus
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Movies, Trailers, News..."
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-white
                  text-lg
                  placeholder:text-zinc-500
                "
              />

              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            {/* Dummy Body */}

            <div className="h-[500px] overflow-y-auto p-6">
              <h2 className="text-white font-semibold text-lg">Search UI</h2>

              <p className="text-zinc-500 mt-2">
                Next step-la Recent Search, Popular Search, Movies, Trailers,
                News sections add pannuvom.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
