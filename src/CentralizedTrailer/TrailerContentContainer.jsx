import React from "react";
import TrailerSection from "./TrailerCard/TrailerSection";

const TrailerContentContainer = ({ trailerData, isLoading }) => {
  return (
    <div>
      <TrailerSection trailers={trailerData} isLoading={isLoading} />
    </div>
  );
};

export default TrailerContentContainer;
