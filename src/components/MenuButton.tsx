"use client";

import {
  faBars,
  faUserCircle,
  faRightFromBracket,
  faGear,
  faClockRotateLeft,
  faRightToBracket,
  faHouse,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Swal from "sweetalert2";

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setDropdownVisible(true);
      setIsClosing(false);
    } else if (dropdownVisible) {
      setIsClosing(true);
      const timeout = setTimeout(() => {
        setDropdownVisible(false);
        setIsClosing(false);
      }, 200); // Match with animation duration
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, logout",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      await Swal.fire({
        title: "Logged out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
      });

      setOpen(false);
      window.location.reload();
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:scale-105 transition-transform shadow-lg cursor-pointer"
      >
        <FontAwesomeIcon
          icon={faBars}
          className={`${
            open ? "spin-clockwise" : "spin-anticlockwise"
          } transition-transform duration-300`}
        />
      </button>

      {dropdownVisible && (
        <div
          className={`mt-2 w-56 bg-gray-800 text-white rounded-xl shadow-2xl absolute right-0 top-12 z-50 border border-gray-700
          ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
        >
          <ul className="py-2 px-1 text-sm">
            {/* Home */}
            <li>
              <a
                href="/home"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                <FontAwesomeIcon icon={faHouse} className="w-4" />
                Home
              </a>
            </li>

            <li>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="w-4" />
                Editor
              </a>
            </li>

            <hr className="my-2 border-gray-600" />

            {/* User Display */}
            <li>
              <div className="flex items-center gap-2 px-4 py-2 text-gray-300 font-medium">
                <FontAwesomeIcon icon={faUserCircle} className="w-4" />
                {user?.username ? `@${user.username}` : "Guest"}
              </div>
            </li>

            {/* History Link */}
            <li>
              <a
                href="/account/history"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                <FontAwesomeIcon icon={faClockRotateLeft} className="w-4" />
                History
              </a>
            </li>

            <hr className="my-2 border-gray-600" />

            {/* Login/Logout */}
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left rounded-md hover:bg-red-600 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                  Logout
                </button>
              ) : (
                <a
                  href="/account/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="w-4" />
                  Login
                </a>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
