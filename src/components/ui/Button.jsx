export const Button = ({
  children,
  className = "",
  disabled,
  type = "button",
  variant = "primary",
  ...props
}) => {
  const variants = {
    primary: "bg-ink text-white hover:bg-ink/90",
    secondary: "bg-white text-ink border border-stone-300 hover:border-moss",
    accent: "bg-coral text-white hover:bg-coral/90",
    ghost: "bg-transparent text-ink hover:bg-black/5",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
