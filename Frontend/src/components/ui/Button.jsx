import clsx from "clsx";
import React, { useMemo } from "react";

const Button = ({
  size,
  loading,
  loadingText = "Loading...",
  children,
  onClick,
  disabled,
  icon,
  iconPosition,
}) => {
  const buttonClass = useMemo(
    () => clsx("btn", size, { loading }),
    [size, loading, disabled]
  );
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? loadingText : children}
      {!loading && icon && iconPosition === "right" && icon}
      
    </button>
  );
};

export default Button;
