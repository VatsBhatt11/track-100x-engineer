'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import AppLayout from "@/components/layout/AppLayout"
import StreakCalendar from "@/components/dashboard/StreakCalendar"
import PostSubmission from "@/components/dashboard/PostSubmission"
import UserStatsCards from "@/components/dashboard/UserStatsCards"
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable"
import LoginForm from "@/components/auth/LoginForm"

import styles from './HomePage.module.css' // ✅ Import the styles

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    try {
      const user = storedUser ? JSON.parse(storedUser) : null
      setIsLoggedIn(!!user?.email)
    } catch {
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) return <div className={styles.loadingContainer}>Loading...</div>

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoBox}>100x</div>
            <h1 className="text-2xl font-bold">
              Track<span className={styles.brandText}>100x</span>
            </h1>
          </div>
          <h2 className={styles.subtitle}>Track Your #0to100xEngineer Challenge</h2>
          <p className={styles.mutedText}>
            Build your streak, climb the leaderboard, and earn achievements by posting daily about your GenAI journey.
          </p>
        </div>

        <LoginForm />

        <div className={styles.footerText}>
          <p>Need an account? Contact your cohort admin.</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <p className={styles.dashboardSubtitle}>Track your progress in the #0to100xEngineer challenge</p>
        </div>
        <Button className={styles.postButton}>Post Today</Button>
      </div>

      <div className={styles.sectionSpacing}>
        <UserStatsCards />

        <div className={styles.twoColumnLayout}>
          <StreakCalendar />
          <PostSubmission />
        </div>

        <div className={styles.leaderboardWrapper}>
          <LeaderboardTable />
        </div>
      </div>
    </AppLayout>
  )
}

export default HomePage
