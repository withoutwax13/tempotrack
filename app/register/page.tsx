"use client";

import { useEffect, useState } from "react";
import supabase from "@/services/supabaseClient";
import RegisterForm from "@/components/RegisterForm";
import TopNavigation from "@/components/TopNavigation";
import Loader from "@/components/Loader";
import "./index.css";

const Register = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchUser() {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        window.location.replace("/calendar");
      } else {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);
  return isLoading ? (
    <div className="flex h-96 justify-center items-center w-full">
      <Loader />
    </div>
  ) : (
    <div>
      <TopNavigation displayText="Login" />
      <main className="register-bg" style={{ height: "calc(100vh - 60px)" }}>
        <RegisterForm />
      </main>
    </div>
  );
};

export default Register;
