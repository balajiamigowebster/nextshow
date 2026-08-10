import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const TimeContext = createContext(Date.now());

export const TimeProvider = ({ children }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <TimeContext.Provider value={now}>{children}</TimeContext.Provider>;
};

export const useGlobalNow = () => useContext(TimeContext);
