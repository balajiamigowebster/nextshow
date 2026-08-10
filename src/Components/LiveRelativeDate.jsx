import { memo, useMemo } from "react";
import { useGlobalNow } from "../../context/TimeContext ";

const LiveRelativeDate = memo(({ targetDate }) => {
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

    const dayMs = 1000 * 60 * 60 * 24;
    const hourMs = 1000 * 60 * 60;
    const minuteMs = 1000 * 60;

    const days = Math.ceil(diff / dayMs);

    if (days > 0) {
      return `${days} days`;
    }

    const hours = Math.ceil(diff / hourMs);

    if (hours > 0) {
      return `${hours}h`;
    }

    const minutes = Math.ceil(diff / minuteMs);

    if (minutes > 0) {
      return `${minutes}m`;
    }

    const seconds = Math.ceil(diff / 1000);

    return `${seconds}s`;
  }, [targetDate, now]);

  return text;
});

LiveRelativeDate.displayName = "LiveRelativeDate";

export default LiveRelativeDate;
