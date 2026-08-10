import { useEffect, useRef, useState } from "react";
import SearchInput from "./SearchInput";

const SearchBar = ({ isMobile, onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={searchRef}>
      <SearchInput
        keyword={keyword}
        setKeyword={setKeyword}
        open={open}
        setOpen={setOpen}
        isMobile={isMobile}
        onClose={onClose}
      />
    </div>
  );
};

export default SearchBar;
