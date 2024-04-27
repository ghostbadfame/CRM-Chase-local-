import CustomerDashboard from "@/components/dashboard/customer-dashboard";
import EmployeeDashboard from "@/components/dashboard/employee-dashboard";
import ManagerDashboard from "@/components/dashboard/manager-dashboard";
import MarketingDashboard from "@/components/dashboard/marketing-dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let render;
  if (session?.user) {
    switch (session?.user.userType) {
      case "manager":
        render = <ManagerDashboard />;
        break;
      case "customer":
        render = <CustomerDashboard />;
        break;
      case "marketing":
        render = <MarketingDashboard />;
        break;
      default:
        render = <EmployeeDashboard />;
        break;
    }
  } else {
    redirect("/sign-in");
  }

  return <>{render}</>;
}
