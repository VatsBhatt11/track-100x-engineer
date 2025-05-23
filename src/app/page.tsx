'use client'

export const dynamic = 'force-dynamic'
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import AppLayout from "@/components/layout/AppLayout"
import StreakCalendar from "@/components/dashboard/StreakCalendar"
import PostSubmission from "@/components/dashboard/PostSubmission"
import UserStatsCards from "@/components/dashboard/UserStatsCards"
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable"
import AuthContainer from "@/components/auth/AuthContainer"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import styles from './HomePage.module.css' // ✅ Import the styles

const HomePage = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.refresh()
    }
  }, [status, router])

  if (status === "loading") {
    return <div className={styles.loadingContainer}>Loading...</div>
  }

  if (status === "unauthenticated") {
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

        <AuthContainer />

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
          <p className={styles.dashboardSubtitle}>Track your progress and stay motivated</p>
        </div>
        <Button className={styles.postButton}>New Post</Button>
      </div>

      <div className={styles.sectionSpacing}>
        <UserStatsCards />
      </div>

      <div className={styles.twoColumnLayout}>
        <div>
          <StreakCalendar />
        </div>
        <div>
          <PostSubmission />
        </div>
      </div>

      <div className={styles.leaderboardWrapper}>
        <LeaderboardTable />
      </div>
    </AppLayout>
  )
}

export default HomePage
