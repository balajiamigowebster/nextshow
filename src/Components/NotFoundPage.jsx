import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { HiHome, HiArrowLeft } from "react-icons/hi2";
import { PiCompassBold } from "react-icons/pi";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
      relative
      min-h-screen
      overflow-hidden

      bg-[#050505]

      flex
      items-center
      justify-center

      px-5
    "
    >
      {/* BACKGROUND GLOW */}

      <motion.div
        animate={{
          x: [-120, 120, -120],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute

        w-[500px]
        h-[500px]

        rounded-full

        bg-orange-500/10

        blur-[180px]
      "
      />

      {/* MOVING BACKGROUND TEXT */}

      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
        absolute
        whitespace-nowrap

        text-[70px]
        md:text-[120px]

        font-black

        text-white/[0.02]

        select-none
      "
      >
        PAGE NOT FOUND • PAGE NOT FOUND • PAGE NOT FOUND • PAGE NOT FOUND •
      </motion.div>

      {/* FLOATING PARTICLES */}

      {[...Array(12)].map((_, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
          }}
          className="
          absolute

          w-1.5
          h-1.5

          rounded-full

          bg-orange-500/40
        "
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* CONTENT */}

      <div
        className="
        relative
        z-20

        text-center

        max-w-3xl
      "
      >
        {/* ICON */}
        {/* 
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="
          flex
          justify-center
          mb-8
        "
        >
          <div
            className="
            w-24
            h-24

            rounded-full

            border
            border-white/10

            bg-white/[0.02]

            backdrop-blur-xl

            flex
            items-center
            justify-center
          "
          >
            <PiCompassBold size={44} className="text-orange-500" />
          </div>
        </motion.div> */}

        {/* TITLE */}

        <motion.h1
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="
          text-white

          text-5xl
          md:text-8xl

          font-black

          tracking-tight
        "
        >
          PAGE
          <span className="text-zinc-600"> NOT </span>
          FOUND
        </motion.h1>

        {/* SUB TITLE */}

        <p
          className="
          mt-6

          text-zinc-400

          text-base
          md:text-lg

          max-w-xl
          mx-auto

          leading-8
        "
        >
          The page you are looking for doesn't exist, may have been moved, or
          the URL might be incorrect.
        </p>

        {/* BUTTONS */}

        <div
          className="
          mt-10

          flex
          flex-col
          sm:flex-row

          justify-center
          gap-4
        "
        >
          <Link
            to="/"
            className="
            flex
            items-center
            justify-center
            gap-2

            px-7
            py-4

            rounded-2xl

            bg-orange-500

            text-white
            font-semibold

            hover:bg-orange-600

            transition-all
          "
          >
            <HiHome size={20} />
            Go To Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="
            flex
            items-center
            justify-center
            gap-2

            px-7
            py-4

            rounded-2xl

            border
            border-white/10

            bg-white/[0.02]

            text-white

            hover:bg-white/[0.05]

            transition-all
          "
          >
            <HiArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
