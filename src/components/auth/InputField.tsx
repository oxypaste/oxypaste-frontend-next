import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const InputField: React.FC<Props> = ({ icon, ...props }) => (
  <div className="relative">
    {icon && (
      <span className="absolute top-3 left-3 text-gray-400">{icon}</span>
    )}
    <input
      {...props}
      className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default InputField;
