import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";

const IsUserValid = ({ children, disabled = false }) => {
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const { openAuth } = useAuth();

  return React.cloneElement(children, {
    onClickCapture: (e) => {
      // =====================================
      // DISABLED STATE
      // =====================================

      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // =====================================
      // LOGIN CHECK
      // =====================================

      if (!isAuthenticated) {
        e.preventDefault();
        e.stopPropagation();

        openAuth();
        return;
      }

      // =====================================
      // ORIGINAL HANDLER
      // =====================================

      if (children.props.onClickCapture) {
        children.props.onClickCapture(e);
      }
    },
  });
};

export default IsUserValid;
