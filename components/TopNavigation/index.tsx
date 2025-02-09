"use client";
import { useState } from "react";
import Link from "next/link";

const TopNavigation = (props: { displayText?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md h-150">
      <div className="left-side">
        <span className="text-xl font-bold">Logo here</span>
      </div>
      <div className="right-side">
        <button
          className="md:hidden text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "X" : "☰"}
        </button>
        <nav
          className={`md:flex flex-col md:flex-row md:items-center absolute md:static top-16 right-0 md:top-auto md:right-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col md:flex-row md:items-center">
            <li className="md:ml-4">
              <Link
                href="/"
                className="text-black block py-2 md:py-0 hover:text-[#2EA2F8]"
              >
                Home
              </Link>
            </li>
            <li className="md:ml-4">
              <Link
                href="/features"
                className="text-black block py-2 md:py-0 hover:text-[#2EA2F8]"
              >
                Features
              </Link>
            </li>
            <li className="md:ml-4">
              <Link
                href="/contact-us"
                className="text-black block py-2 md:py-0 hover:text-[#2EA2F8]"
              >
                Contact Us
              </Link>
            </li>
            <li className="md:ml-4">
              <Link
                href="/pricing"
                className="text-black block py-2 md:py-0 hover:text-[#2EA2F8]"
              >
                Pricing
              </Link>
            </li>
            <li className="md:ml-4">
              <Link
                href="/help"
                className="text-black block py-2 md:py-0 hover:text-[#2EA2F8]"
              >
                Help
              </Link>
            </li>
            <div className="button-group mt-4 md:mt-0 md:ml-4">
              <Link
                href={
                  !props.displayText
                    ? "/login"
                    : props.displayText === "Login"
                    ? "/login"
                    : "/register"
                }
                style={{ backgroundColor: "#2EA2F8" }}
                className="text-white py-2 px-4 rounded"
              >
                {props.displayText || "Login"}
              </Link>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default TopNavigation;
