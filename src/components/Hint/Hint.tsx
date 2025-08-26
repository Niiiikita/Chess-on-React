import React from "react";
import styles from "./Hint.module.css";
import clsx from "clsx";

export default function Hint({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(styles.moveHint, className)}
      {...props}
    >
      {children}
    </div>
  );
}
