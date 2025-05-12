"use client"

import Link from "next/link"
import { Home } from "lucide-react"

import AppLayout from "@/components/layout/AppLayout"
import AchievementGrid from "@/components/achievements/AchievementGrid"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import "@/styles/achievements.css" // Importing external CSS

export default function AchievementsPage() {
  return (
    <AppLayout>
      <Breadcrumb className="breadcrumb-margin">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="icon-sm" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Achievements</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="header-section">
        <h1 className="page-title">My Achievements</h1>
        <p className="page-subtitle">
          Track your milestones and unlock achievements through consistent posting
        </p>
      </div>

      <AchievementGrid />
    </AppLayout>
  )
}
