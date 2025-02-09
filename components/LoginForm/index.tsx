"use client";
import { useState } from "react";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRememberDevice, setIsRememberDevice] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) {
      alert("Please fill all the fields");
    } else if (password.length < 6) {
      alert("Password must be at least 6 characters");
    } else if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address");
    } else {
      alert("Login successful");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] ">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to your TempoTrack account
        </h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="rememberDevice"
            checked={isRememberDevice}
            onChange={(e) => setIsRememberDevice(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label
            htmlFor="rememberDevice"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me on this device
          </label>
        </div>
        <div className="mb-4">
          <button
            style={{ backgroundColor: "#2EA2F8" }}
            className="w-full text-white py-2 px-4 rounded-md"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
        <p className="text-center text-sm text-gray-600">
          No account yet?{" "}
          <Link href="register" className="text-blue-500 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
