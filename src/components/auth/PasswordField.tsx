import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<Props> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={value}
        onChange={onChange}
        required
        autoComplete="current-password"
        className="w-full pl-10 pr-10 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-2.5 right-3 text-gray-400"
        aria-label="Toggle Password Visibility"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordField;
