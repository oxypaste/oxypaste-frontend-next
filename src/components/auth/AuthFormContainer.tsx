import React from "react";

interface Props {
  title: string;
  error?: string | null;
  message?: string | null;
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<Props> = ({
  title,
  error,
  message,
  children,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-md bg-gray-950/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          {title}
        </h2>

        {error && (
          <div className="text-red-500 bg-red-100/10 border border-red-500 rounded px-4 py-3 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="text-white-500 bg-blue-100/10 border border-blue-500 rounded px-4 py-3 text-sm text-center mb-4">
            {message}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthFormContainer;
