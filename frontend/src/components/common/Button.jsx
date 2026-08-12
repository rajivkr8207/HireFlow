
const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg px-4 py-2
        bg-blue-600 text-white
        font-medium
        transition-all duration-200
        hover:bg-blue-700
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;