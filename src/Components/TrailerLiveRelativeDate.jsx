import { memo, useMemo } from "react";
import { useGlobalNow } from "../../context/TimeContext ";

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;
const MINUTE_MS = 1000 * 60;

const TrailerLiveRelativeDate = memo(({ targetDate }) => {
  const now = useGlobalNow();

  const text = useMemo(() => {
    if (!targetDate || targetDate === "TBA") {
      return "TBA";
    }

    const target = new Date(targetDate).getTime();

    if (Number.isNaN(target)) {
      return targetDate;
    }

    const diff = target - now;

    // Already Released
    if (diff <= 0) {
      return "Now";
    }

    const days = Math.floor(diff / DAY_MS);
    const hours = Math.floor((diff % DAY_MS) / HOUR_MS);
    const minutes = Math.floor((diff % HOUR_MS) / MINUTE_MS);
    const seconds = Math.floor((diff % MINUTE_MS) / 1000);

    // 2d 5h
    if (days > 0) {
      return `${days}d ${hours}h`;
    }

    // 10h 20m
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    // 25m
    if (minutes > 0) {
      return `${minutes}m`;
    }

    // 45s
    return `${seconds}s`;
  }, [targetDate, now]);

  return <>{text}</>;
});

TrailerLiveRelativeDate.displayName = "LiveRelativeDate";

export default TrailerLiveRelativeDate;
