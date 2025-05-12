// app/leaderboard/page.tsx
import AppLayout from "@/components/layout/AppLayout";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import "@/styles/leaderboard.css"

const Leaderboard = () => {
  return (
    <AppLayout>
      <Breadcrumb className="breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="icon" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Leaderboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="page-heading">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank against other #0to100xEngineer participants
        </p>
      </div>

      <LeaderboardTable />
    </AppLayout>
  );
};

export default Leaderboard;
