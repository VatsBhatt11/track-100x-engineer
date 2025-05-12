"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Calendar,
  Award,
  Users,
  UserRound,
} from "lucide-react";
import '@/styles/mainNavigation.css'

const MainNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/", icon: Calendar },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "My Achievements", path: "/achievements", icon: Award },
    { name: "Community", path: "/community", icon: Users },
    { name: "Profile", path: "/profile", icon: UserRound },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">100x</div>
        <h1 className="sidebar-title">
          Track<span className="highlight">100x</span>
        </h1>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={cn(`nav-link ${isActive ? "active" : ""}`)}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="cohort-info">
          <div className="status-dot"></div>
          <span>100xEngineers Cohort</span>
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
