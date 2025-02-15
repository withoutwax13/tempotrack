"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import SideNavigation from "@/components/SideNavigation";
import BudgetCards from "@/components/BudgetCards";
import Loader from "@/components/Loader";
import { ToastContainer, toast } from "react-toastify";

const Budget = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetData, setBudgetData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/budgets")
      .then((res) => {
        setBudgetData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong: " + err.response.data.error);
      });
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-60">
        <SideNavigation currentAppUrl="/budget" />
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <ToastContainer />
        {!isLoading && <BudgetCards budgetData={budgetData} />}
        {isLoading && (
          <div className="flex h-96 justify-center items-center w-full">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
