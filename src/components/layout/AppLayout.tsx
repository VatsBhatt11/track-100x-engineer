'use client'

import { ReactNode } from "react";
import MainNavigation from "@/components/MainNavigation";
import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";
import '@/styles/appLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // const location = useLocation();
  // const isHomePage = location.pathname === "/";
  
  const progressValue = 65; // This would come from user data in a real app
  
  return (
    <div className="app-container">
      <MainNavigation />
      <div className="app-main">
        <main className="app-content">
          {isHomePage && (
            <div className="progress-section">
              <div className="progress-header">
                <p className="progress-label">Overall Progress</p>
                <span className="progress-value">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
              <p className="progress-description">
                Complete your first 30-day streak to reach platform mastery
              </p>
            </div>
          )}
          {children}
        </main>
        <footer className="footer">
          © {new Date().getFullYear()} Track100xEngineers | Powered by 100xEngineers
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;