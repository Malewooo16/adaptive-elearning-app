import {getDashboardInfo} from "@/actions/dashboard";
import UserNavbar from "@/components/Common/UserNavbar";
import Dashboard from "@/components/Dashboard";
import {redirect} from "next/navigation";

export default async function DashboardPage() {
  const dashboardAnalytics = await getDashboardInfo();
  if (!dashboardAnalytics) return null;
  //console.log(dashboardAnalytics);
  return (
    <>
      <UserNavbar />
      <div className="min-h-screen p-6">
        <Dashboard userData={dashboardAnalytics} />
      </div>
    </>
  );
}
