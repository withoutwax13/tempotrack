"use client";
import axios from "axios";
import supabase from "@/services/supabaseClient";
import { useState } from "react";
import Link from "next/link";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [termsConditionsAgreed, setTermsConditionsAgreed] = useState(false);

  const handleSyncToPublicUsers = async (user_id: string, username: string) => {
    axios
      .post("/api/users", { user_id, username })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        window.location.href = "/login";
      });
  };

  const handleSubmit = async () => {
    if (!email || !password || !username) {
      alert("Please fill all the fields");
    } else if (password.length < 6) {
      alert("Password must be at least 6 characters");
    } else if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address");
    } else if (!termsConditionsAgreed) {
      alert("Please agree to the terms and conditions");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      const { user } = data;

      if (error) {
        alert(error.message);
      } else {
        if (user?.id) {
          handleSyncToPublicUsers(user.id, username);
        } else {
          alert("An error occurred. Please contact support.");
        }
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-150px)]">
      <div className="selling-points w-1/2 p-8 flex flex-col justify-center">
        <span className="mb-6 flex items-center">
          <div className="blue-shade bg-blue-500 w-2 h-full mr-2"></div>
          <div>
            <h2 className="main-point text-xl font-semibold mb-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </h2>
            <p className="text-gray-700">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo
              pariatur eligendi nobis, voluptatibus est aliquid libero fuga illo
              perferendis voluptas quia, fugiat nisi.
            </p>
          </div>
        </span>
        <span className="mb-6 flex items-center">
          <div className="blue-shade bg-blue-500 w-2 h-full mr-2"></div>
          <div>
            <h2 className="main-point text-xl font-semibold mb-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </h2>
            <p className="text-gray-700">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo
              pariatur eligendi nobis, voluptatibus est aliquid libero fuga illo
              perferendis voluptas quia, fugiat nisi.
            </p>
          </div>
        </span>
        <span className="flex items-center">
          <div className="blue-shade bg-blue-500 w-2 h-full mr-2"></div>
          <div>
            <h2 className="main-point text-xl font-semibold mb-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </h2>
            <p className="text-gray-700">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo
              pariatur eligendi nobis, voluptatibus est aliquid libero fuga illo
              perferendis voluptas quia, fugiat nisi.
            </p>
          </div>
        </span>
      </div>
      <div className="form flex items-center justify-center w-1/2">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Join us at TempoTrack
          </h1>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold">
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
            <label htmlFor="username" className="block text-sm font-bold">
              Username
            </label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold">
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
              checked={termsConditionsAgreed}
              onChange={(e) => setTermsConditionsAgreed(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberDevice"
              className="ml-2 block text-sm text-gray-900"
            >
              You agree to our{" "}
              <Link href="/terms" className="text-blue-500 hover:underline">
                terms and conditions
              </Link>
            </label>
          </div>
          <div className="mb-4">
            <button
              style={{ backgroundColor: "#2EA2F8" }}
              className="w-full text-white py-2 px-4 rounded-md"
              onClick={handleSubmit}
            >
              Register
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
