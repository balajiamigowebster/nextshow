import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useMovieDateAvailability = ({
  year,
  month,
  releaseMode,
  streamType,
}) => {
  return useQuery({
    queryKey: ["movie-date-availability", year, month, releaseMode, streamType],

    queryFn: async () => {
      const { data } = await api.get("/admin/date-availability", {
        params: {
          year,
          month,
          releaseMode,
          streamType,
        },
      });

      return data;
    },

    enabled: !!year && !!month,

    refetchOnWindowFocus: true,
  });
};
