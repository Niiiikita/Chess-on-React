import clsx from "clsx";
import styles from "./Button.module.css";

export default function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(styles.button, className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
