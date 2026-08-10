import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useMovieBySelectedDate = ({
  year,
  month,
  day,
  releaseMode,
  streamType,
}) => {
  return useQuery({
    queryKey: [
      "movie-selected-date",
      year,
      month,
      day,
      releaseMode,
      streamType,
    ],

    queryFn: async () => {
      const { data } = await api.get("/admin/by-selected-date", {
        params: {
          year,
          month,
          day,
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
