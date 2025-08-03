"use client";

import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "../../app.config";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 px-6 py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-sm">
        {/* Left: Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-white text-lg font-semibold mb-1">
            {APP_CONFIG.FOOTER_NAME}
          </h2>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-center">
          {APP_CONFIG.FOOTER_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.link}
              className="hover:text-white transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Empty or for future use */}
        <div className="text-center md:text-right" />
      </div>
    </footer>
  );
}
