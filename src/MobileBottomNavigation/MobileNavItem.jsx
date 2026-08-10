import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../../context/SearchContext";

const MobileNavItem = ({
  label,
  path,
  icon: Icon,
  active,
  type,
  isAuthenticated,
  openAuth,
  authChecked,
  currentUser,
  getImageUrl,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsMobileSearchOpen } = useSearch();

  const handleClick = () => {
    if (type === "search") {
      setIsMobileSearchOpen(true);
      return;
    }
    if (type === "profile") {
      if (!authChecked) return;
      if (isAuthenticated) {
        navigate("/profile", { state: { from: location.pathname } });
        return;
      }
      openAuth();
      return;
    }
    // Make sure we close search if navigating to other tabs
    setIsMobileSearchOpen(false);
    navigate(path);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-col items-center justify-end gap-1 min-w-[60px] pb-0.5"
      style={{ minHeight: 56 }}
    >
      {/* ── Floating active circle (lifted above notch) ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="float"
            initial={{ y: 12, scale: 0.7, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="absolute flex items-center justify-center rounded-full z-20"
            style={{
              top: -30,
              width: 52,
              height: 52,
              background: "linear-gradient(145deg, #1e3a8a, #2563eb, #60a5fa)",
              boxShadow: `
                0 0 0 3px #0f0f12,
                0 0 18px rgba(96,165,250,0.55),
                0 4px 14px rgba(0,0,0,0.6)
              `,
            }}
          >
            {/* Profile image inside float */}
            {type === "profile" && isAuthenticated && currentUser ? (
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-300/60">
                {currentUser?.profileImage ? (
                  <img
                    src={getImageUrl(currentUser.profileImage)}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-700
                    flex items-center justify-center text-[13px] font-bold text-white"
                  >
                    {currentUser?.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <Icon className="text-[22px] text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            )}

            {/* Bottom glow reflection */}
            <div
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2
              w-8 h-2 rounded-full blur-md
              bg-blue-400/40"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Icon (hidden when active, float takes over) ── */}
      <motion.div
        className="relative z-10"
        animate={{ opacity: active ? 0 : 1, scale: active ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {type === "profile" && isAuthenticated && currentUser ? (
          <div
            className={`w-7 h-7 rounded-full overflow-hidden border
            ${active ? "border-blue-400" : "border-zinc-700"}`}
          >
            {currentUser?.profileImage ? (
              <img
                src={getImageUrl(currentUser.profileImage)}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-zinc-500 to-zinc-700
                flex items-center justify-center text-[11px] font-bold text-white"
              >
                {currentUser?.fullName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          <Icon className="text-[22px] text-zinc-500" />
        )}
      </motion.div>

      {/* ── Label ── */}
      <span
        className={`relative z-10 text-[10px] font-medium transition-colors duration-300
        ${active ? "text-blue-300 font-semibold" : "text-zinc-500"}`}
      >
        {label}
      </span>
    </button>
  );
};

export default MobileNavItem;
