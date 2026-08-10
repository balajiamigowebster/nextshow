import * as XLSX from "xlsx";

const parseExcelFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // 1. Convert all sheets into raw JS Arrays
    const moviesRaw = XLSX.utils.sheet_to_json(workbook.Sheets["Movies"]);
    const castRaw = XLSX.utils.sheet_to_json(workbook.Sheets["CastDetails"]);
    const boxReportsRaw = XLSX.utils.sheet_to_json(
      workbook.Sheets["BoxOfficeReports"],
    );

    // 2. Loop and map back into your target Sequelize JSON format
    const finalPayload = moviesRaw.map((movie) => {
      const movieId = movie.movieId;

      return {
        title: movie.title,
        status: movie.status,
        streamType: movie.streamType,
        director: movie.director || "TBA",
        writer: movie.writer || "TBA",
        producer: movie.producer || "TBA",
        cast: movie.cast || "",
        releaseMode: movie.releaseMode || "THEATRICAL",
        isTheatreReleased:
          String(movie.isTheatreReleased).toUpperCase() === "TRUE",
        isStreamingReleased:
          String(movie.isStreamingReleased).toUpperCase() === "TRUE",
        releaseDate: movie.releaseDate || null,
        theatreReleaseDate: movie.theatreReleaseDate || null,
        ottReleaseDate: movie.ottReleaseDate || null,
        certification: movie.certification || "U/A",
        durationOrSeason: movie.durationOrSeason || "N/A",

        // 🔄 Convert comma separated strings back to Array
        language: movie.language
          ? movie.language.split(",").map((s) => s.trim())
          : ["Tamil"],
        availableOn: movie.availableOn
          ? movie.availableOn.split(",").map((s) => s.trim())
          : [],
        watchUrl: movie.watchUrl
          ? movie.watchUrl.split(",").map((s) => s.trim())
          : [],
        genres: movie.genres
          ? movie.genres.split(",").map((s) => s.trim())
          : ["Drama"],

        // 👥 Filter matching cast details from Sheet 2
        castDetails: castRaw
          .filter((c) => String(c.movieId) === String(movieId))
          .map((c) => ({
            castId: c.castId,
            castName: c.castName,
            characterName: c.characterName || "",
            roleCategory: c.roleCategory || "",
            isLeadRole: String(c.isLeadRole).toUpperCase() === "TRUE",
          })),

        // 💰 Box Office nested object mapping
        boxOffice: {
          budget: movie["boxOffice.budget"] || "N/A",
          verdict: movie["boxOffice.verdict"] || "",
          totalIndiaGross: movie["boxOffice.totalIndiaGross"] || "0",
          totalIndiaNet: movie["boxOffice.totalIndiaNet"] || "0",
          totalOverseas: movie["boxOffice.totalOverseas"] || "0",
          totalWorldwide: movie["boxOffice.totalWorldwide"] || "0",
          summary: movie["boxOffice.summary"] || "",
          preReleaseBusiness: movie["boxOffice.preReleaseBusiness"] || "0",

          // 👥 Filter area reports from Sheet 3
          reports: boxReportsRaw
            .filter((r) => String(r.movieId) === String(movieId))
            .map((r) => ({
              area: r.area,
              collection: r.collection || "0",
              share: r.share || "0",
            })),
          dailyCollection: [], // Optional
        },

        // 🏢 Release Info nested mapping
        releaseInfo: {
          distributors: {
            tamilNadu: [], // Optional circular mappings
            kerala: [],
            karnataka: [],
            overseas: movie["releaseInfo.distributors.overseas"]
              ? movie["releaseInfo.distributors.overseas"]
                  .split(",")
                  .map((s) => s.trim())
              : [],
          },
          rights: {
            satellite: movie["releaseInfo.rights.satellite"] || "TBA",
            digital: movie["releaseInfo.rights.digital"] || "TBA",
            audio: movie["releaseInfo.rights.audio"] || "TBA",
          },
          screenCount: {
            tamilNadu: movie["releaseInfo.screenCount.tamilNadu"] || 0,
            kerala: movie["releaseInfo.screenCount.kerala"] || 0,
            karnataka: movie["releaseInfo.screenCount.karnataka"] || 0,
            teluguStates: movie["releaseInfo.screenCount.teluguStates"] || 0,
            northIndia: movie["releaseInfo.screenCount.northIndia"] || 0,
            overseas: movie["releaseInfo.screenCount.overseas"] || 0,
            worldwideTotal:
              movie["releaseInfo.screenCount.worldwideTotal"] || 0,
          },
          formats: movie["releaseInfo.formats"]
            ? movie["releaseInfo.formats"].split(",").map((s) => s.trim())
            : ["2D"],
          theaterList: [],
        },

        // 📺 Streaming release info nested mapping
        streamReleaseInfo: {
          ott: movie["streamReleaseInfo.ott"]
            ? movie["streamReleaseInfo.ott"].split(",").map((s) => s.trim())
            : [],
          satellite: [],
          audio: movie["streamReleaseInfo.audio"]
            ? movie["streamReleaseInfo.audio"].split(",").map((s) => s.trim())
            : [],
          contractDetails: {
            digitalPartner:
              movie["streamReleaseInfo.contractDetails.digitalPartner"] ||
              "TBA",
            satellitePartner:
              movie["streamReleaseInfo.contractDetails.satellitePartner"] ||
              "TBA",
          },
        },
      };
    });

    console.log("Structured JSON for API payload:", finalPayload);
    // Send finalPayload to: axios.post('/api/movies/bulk-create', finalPayload)
  };
  reader.readAsArrayBuffer(file);
};
