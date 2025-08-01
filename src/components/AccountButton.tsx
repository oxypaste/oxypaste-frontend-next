"use client";

import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Swal from "sweetalert2";

export default function AccountButton() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout confirmation with SweetAlert2
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
    <div ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:text-blue-400 transition duration-200 border border-white/10 shadow-md cursor-pointer"
      >
        <FontAwesomeIcon icon={faUserAlt} />
      </button>

      {open && (
        <div className="mt-2 w-40 bg-gray-900 rounded-md shadow-lg absolute right-0 top-12">
          <ul className="py-1 text-sm text-white">
            <li>
              <span className="block px-4 py-2 font-bold text-gray-300">
                {(user?.username ? `@${user.username}` : "") || "Guest"}
              </span>
            </li>
            <hr className="border-gray-700" />
            {user ? (
              <li>
                <a
                  href="/account"
                  className="block px-4 py-2 hover:bg-gray-300 hover:text-black"
                >
                  Settings
                </a>
              </li>
            ) : null}
            <li>
              <a
                href="/account/history"
                className="block px-4 py-2 hover:bg-gray-300 hover:text-black"
              >
                History
              </a>
            </li>
            <li>
              <hr className="border-gray-700" />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-300 hover:text-black cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/account/login"
                  className="block px-4 py-2 hover:bg-gray-300 hover:text-black"
                >
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
