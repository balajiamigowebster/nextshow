import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ isMobileSearchOpen, setIsMobileSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
