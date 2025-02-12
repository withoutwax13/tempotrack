"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "@/services/supabaseClient";

const primaryNavItems = [
  { name: "Dashboard", url: "/dashboard" },
  { name: "Budget", url: "/budget" },
  { name: "Calendar", url: "/calendar" },
  { name: "Reports", url: "/reports" },
  { name: "Templates", url: "/templates" },
];

const SideNavigation = ({ currentAppUrl }: { currentAppUrl: string }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert("Error logging out: " + error.message);
    else setIsLoggedIn(false);
  };

  useEffect(() => {
    const checkSigninStatus = async () => {
      const user = await supabase.auth.getUser();
      if (!user.data?.user) window.location.href = "/login";
      else setIsLoggedIn(true);
    };
    checkSigninStatus();
  }, [isLoggedIn]);

  return (
    <nav className="side-navigation bg-[#2EA2F8] text-white h-screen pt-20 pl-4 pr-12">
      <ul className="primary-nav">
        {primaryNavItems.map((item) => (
          <li className="py-2" key={item.url}>
            <Link
              href={item.url}
              className={`main-item text-lg ${
                currentAppUrl === item.url ? "active text-black" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="divider my-2 border-t border-white"></div>
      <ul className="secondary-nav">
        <li
          className="main-item text-lg cursor-pointer py-2"
          onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
        >
          Quick Actions
        </li>
        {isQuickActionsOpen && (
          <>
            <li className="pl-4 cursor-pointer py-2">+ New Budget</li>
            <li className="pl-4 cursor-pointer py-2">+ Time Audit</li>
          </>
        )}
        <li className="main-item text-lg dropdown-input cursor-pointer py-2">
          Switch Workspace
        </li>
      </ul>
      <div className="divider my-2 border-t border-white"></div>
      <ul className="tertiary-nav">
        <li
          className="main-item text-lg cursor-pointer py-2"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          Settings
        </li>
        {isSettingsOpen && (
          <>
            <li className="py-2">
              <Link href="/account-settings" className="pl-4">
                Account Settings
              </Link>
            </li>
            <li className="py-2">
              <Link href="/notification-settings" className="pl-4">
                Notification Settings
              </Link>
            </li>
          </>
        )}
        <li className="main-item text-lg settings-toggle-dependent cursor-pointer py-2">
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavigation;
