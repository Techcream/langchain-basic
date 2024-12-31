export const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  className,
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:ring-primary-200 focus:border-primary-300 ${className}`}
      {...props}
    />
  );
};
