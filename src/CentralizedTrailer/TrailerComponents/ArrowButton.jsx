import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ArrowButton = ({
  top = "50%",
  right,
  left,
  size = 18,
  direction = "right", // right | left
  onClick,
}) => {
  const isRight = direction === "right";

  return (
    <motion.button
      onClick={onClick}
      style={{
        top,
        right: right !== undefined ? `${right}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
      }}
      className="
        absolute
        -translate-y-1/2
        z-50
        flex
        items-center
        text-zinc-400
        hover:text-zinc-100
        drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]
      "
    >
      {/* Main Arrow */}

      <motion.div
        animate={{
          x: isRight ? [0, 4, 0] : [0, -4, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        }}
      >
        {isRight ? <ChevronRight size={size} /> : <ChevronLeft size={size} />}
      </motion.div>

      {/* Ghost Arrow */}

      <motion.div
        animate={{
          x: isRight ? [0, 4, 0] : [0, -4, 0],
          opacity: [0.1, 0.7, 0.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          delay: 0.2,
          ease: "easeInOut",
        }}
        className={isRight ? "-ml-2" : "-mr-2"}
      >
        {isRight ? <ChevronRight size={size} /> : <ChevronLeft size={size} />}
      </motion.div>
    </motion.button>
  );
};

export default ArrowButton;
