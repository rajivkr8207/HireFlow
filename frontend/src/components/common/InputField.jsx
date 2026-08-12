// src/components/Input.jsx

const InputField = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    className = "",
    disabled = false,
    required = false,
    readOnly = false,
    id,
}) => {
    return (
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            className={`
        w-full rounded-lg border border-gray-300
        bg-white px-4 py-2.5
        text-sm text-gray-900
        outline-none
        transition-all duration-200

        placeholder:text-gray-400

        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-500/20

        disabled:cursor-not-allowed
        disabled:bg-gray-100
        disabled:text-gray-500

        ${className}
      `}
        />
    );
};

export default InputField;