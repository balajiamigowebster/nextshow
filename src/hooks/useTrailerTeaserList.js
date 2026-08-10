import { useQuery } from "@tanstack/react-query";
import api from "../api";

export const useTrailerTeaserList = ({
  year,
  month,
  mediaType,
  status = "ALL",
}) => {
  //   console.log("call useTrailerTeaser", year, month, mediaType, status);
  return useQuery({
    queryKey: ["centralized-trailer-list", year, month, status, mediaType],
    queryFn: async () => {
      const { data } = await api.get(
        "/centralized-trailer/public-trailer-teaser-list",
        {
          params: {
            year,
            month,
            mediaType,
            status,
            autoFallback: true,
          },
        },
      );
      return data;
    },
    // staleTime: 1000 * 60 * 5,
    // gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
