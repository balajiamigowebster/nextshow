import { RiMovie2AiLine } from "react-icons/ri";
import { TbMovie, TbPhoto } from "react-icons/tb";
import { LuGalleryVertical } from "react-icons/lu";
import { PiVideo } from "react-icons/pi";
import { BsPersonVideo3 } from "react-icons/bs";
import { RiAwardFill } from "react-icons/ri";
import { RiFileList3Line } from "react-icons/ri";
import { RiFileVideoLine } from "react-icons/ri";
import { HiOutlineSquaresPlus } from "react-icons/hi2";

export const TRAILER_TABS = [
  {
    id: "All",
    label: "All",
    icon: (
      <RiFileList3Line className="text-[12px] md:text-[15px] lg:text-[16px]" />
    ),
  },
  {
    id: "Teaser",
    label: "Teaser",
    icon: <TbMovie className="text-[12px] md:text-[15px] lg:text-[16px]" />,
    // subTabs: [
    //   { id: "title-teaser", label: "Title Teaser" }, // Movie title reveal aagura teaser
    //   { id: "teaser", label: "Teaser" },
    //   { id: "announcement-teaser", label: "Announcement" },
    //   { id: "concept-teaser", label: "Concept Teaser" }, // Story idea/theme based teaser, full cast illama
    //   { id: "motion-poster", label: "Motion Poster" },
    //   { id: "glimpse", label: "Glimpse" },
    //   { id: "character-teaser", label: "Character Teaser" }, // Hero/Heroine/Villain individual intro
    // ],
  },
  {
    id: "Trailer",
    label: "Trailer",
    icon: (
      <RiMovie2AiLine className="text-[12px] md:text-[15px] lg:text-[16px]" />
    ),
    // subTabs: [
    //   { id: "all", label: "All" },
    //   { id: "latest", label: "Latest" }, // New: Recent-ah release aanathu
    //   { id: "upcoming", label: "Upcoming" }, // New: Varapora trailers/teasers
    //   { id: "first-look", label: "First Look / Motion Poster" }, // New: Movie announce aana udane varra first look
    //   { id: "trailers", label: "Trailers" },
    //   { id: "bts", label: "Behind the Scenes" },
    //   { id: "making", label: "Making Videos" }, // New: Full making videos (BTS-ku konjam detailed version)
    //   { id: "promos", label: "TV Spots & Promos" },
    //   { id: "sneak-peek", label: "Sneak Peek" },
    //   { id: "interviews", label: "Interviews" }, // New: Cast/crew interviews
    //   { id: "press-meet", label: "Press Meet & Events" }, // New: Pre-release function, success meet
    //   { id: "reactions", label: "Public & Celebrity Reactions" }, // New: Trailer/teaser reactions
    // ],
  },
  {
    id: "Clip",
    label: "Clip",
    icon: (
      <RiFileVideoLine className="text-[12px] md:text-[15px] lg:text-[16px]" />
    ),
  },

  // {
  //   id: "first-look",
  //   label: "First Look",
  //   icon: <TbPhoto className="text-[12px] md:text-[15px] lg:text-[16px]" />,
  //   // subTabs: [
  //   //   { id: "first-look-poster", label: "First Look Poster" }, // Standard first look image
  //   //   { id: "title-look", label: "Title Look" }, // Title reveal poster
  //   //   { id: "character-look", label: "Character Look" }, // Individual actor/character poster
  //   //   { id: "motion-poster", label: "Motion Poster" }, // Animated/video version of first look
  //   //   { id: "bts-look", label: "BTS Look" }, // Behind the scenes still/poster reveal
  //   // ],
  // },

  // {
  //   id: "gallery",
  //   label: "Gallery",
  //   icon: (
  //     <LuGalleryVertical className="text-[12px] md:text-[15px] lg:text-[16px]" />
  //   ),
  //   // subTabs: [
  //   //   {
  //   //     id: "all",
  //   //     label: "All",
  //   //   },
  //   //   {
  //   //     id: "posters",
  //   //     label: "Posters",
  //   //   },
  //   //   {
  //   //     id: "stills",
  //   //     label: "Stills",
  //   //   },
  //   //   {
  //   //     id: "events",
  //   //     label: "Events",
  //   //   },
  //   //   {
  //   //     id: "wallpapers",
  //   //     label: "Wallpapers",
  //   //   },
  //   // ],
  // },

  //   {
  //     id: "cast",
  //     label: "Cast",
  //     icon: "🎭",
  //     subTabs: [
  //       {
  //         id: "main-cast",
  //         label: "Main Cast",
  //       },
  //       {
  //         id: "supporting-cast",
  //         label: "Supporting",
  //       },
  //       {
  //         id: "special-appearance",
  //         label: "Special",
  //       },
  //     ],
  //   },

  //   {
  //     id: "crew",
  //     label: "Crew",
  //     icon: "🎥",
  //     subTabs: [
  //       {
  //         id: "director",
  //         label: "Director",
  //       },
  //       {
  //         id: "writer",
  //         label: "Writer",
  //       },
  //       {
  //         id: "producer",
  //         label: "Producer",
  //       },
  //       {
  //         id: "music",
  //         label: "Music",
  //       },
  //       {
  //         id: "camera",
  //         label: "Camera",
  //       },
  //       {
  //         id: "editor",
  //         label: "Editor",
  //       },
  //     ],
  //   },

  {
    id: "Songs",
    label: "Songs",
    icon: <PiVideo className="text-[12px] md:text-[15px] lg:text-[16px]" />,
    // subTabs: [
    //   {
    //     id: "video-songs",
    //     label: "Video Songs",
    //   },
    //   {
    //     id: "lyric-videos",
    //     label: "Lyrics",
    //   },
    //   {
    //     id: "jukebox",
    //     label: "Jukebox",
    //   },
    //   {
    //     id: "background-score",
    //     label: "BGM",
    //   },
    // ],
  },

  //   {
  //     id: "news",
  //     label: "News",
  //     icon: "📰",
  //     subTabs: [
  //       {
  //         id: "latest",
  //         label: "Latest",
  //       },
  //       {
  //         id: "interviews",
  //         label: "Interviews",
  //       },
  //       {
  //         id: "press-meet",
  //         label: "Press Meet",
  //       },
  //       {
  //         id: "ott-updates",
  //         label: "OTT Updates",
  //       },
  //     ],
  //   },

  //   {
  //     id: "reviews",
  //     label: "Reviews",
  //     icon: "⭐",
  //     subTabs: [
  //       {
  //         id: "critics",
  //         label: "Critics",
  //       },
  //       {
  //         id: "users",
  //         label: "Users",
  //       },
  //       {
  //         id: "community",
  //         label: "Community",
  //       },
  //     ],
  //   },

  //   {
  //     id: "similar",
  //     label: "Similar Movies",
  //     icon: "🎯",
  //     subTabs: [],
  //   },

  // {
  //   id: "ott",
  //   label: "OTT Info",
  //   icon: (
  //     <BsPersonVideo3 className="text-[12px] md:text-[15px] lg:text-[16px]" />
  //   ),
  //   // subTabs: [
  //   //   { id: "all", label: "All" },
  //   //   { id: "now-streaming", label: "Now Streaming" }, // Currently OTT la live ah irukura padangal
  //   //   { id: "upcoming", label: "Upcoming on OTT" }, // OTT release date confirm aana but innum varala
  //   //   { id: "new-arrivals", label: "New Arrivals" }, // Last 1-2 weeks la drop aana
  //   //   { id: "trending", label: "Trending Now" }, // Views/engagement adhigama irukurathu
  //   //   { id: "originals", label: "OTT Originals" }, // Platform-only original content
  //   //   { id: "dubbed", label: "Dubbed" }, // Telugu/Hindi/Malayalam to Tamil dubbed
  //   // ],
  // },

  //   {
  //     id: "boxoffice",
  //     label: "Box Office",
  //     icon: "📊",
  //     subTabs: [
  //       {
  //         id: "collections",
  //         label: "Collections",
  //       },
  //       {
  //         id: "budget",
  //         label: "Budget",
  //       },
  //       {
  //         id: "verdict",
  //         label: "Verdict",
  //       },
  //     ],
  //   },

  // {
  //   id: "awards",
  //   label: "Awards",
  //   icon: <RiAwardFill className="text-[12px] md:text-[15px] lg:text-[16px]" />,
  //   // subTabs: [
  //   //   {
  //   //     id: "national",
  //   //     label: "National",
  //   //   },
  //   //   {
  //   //     id: "filmfare",
  //   //     label: "Filmfare",
  //   //   },
  //   //   {
  //   //     id: "siima",
  //   //     label: "SIIMA",
  //   //   },
  //   // ],
  // },
  {
    id: "OTHERS",
    label: "Others",
    icon: (
      <HiOutlineSquaresPlus className="text-[12px] md:text-[15px] lg:text-[16px]" />
    ),
  },
];
