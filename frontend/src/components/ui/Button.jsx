import { Link } from "react-router-dom";

const styles = {
  primary: "bg-ink text-paper hover:bg-[#303030]",
  secondary: "border border-line bg-transparent text-ink hover:bg-[#ECEAE3]",
  accent: "bg-accent text-paper hover:bg-[#1C4D3C]",
  ghost: "text-ink hover:bg-[#ECEAE3]",
};

export default function Button({ children, variant = "primary", as = "button", className = "", ...props }) {
  const classes = `focus-ring inline-flex min-h-11 items-center justify-center gap-2 px-5 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`;
  if (as === "link") return <Link className={classes} {...props}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}