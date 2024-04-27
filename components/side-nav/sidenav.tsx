import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ManagerSideNav from "./manager-side-nav";
import CustomerSideNav from "./customer-side-nav";
import EmployeeSideNav from "./employee-side-nav";
import Image from "next/image";
import Logo from "../logo";
import { ScrollArea } from "../ui/scroll-area";

export default async function SideNav() {
  const session = await getServerSession(authOptions);

  let render;
  if (session?.user) {
    switch (session.user.userType) {
      case "customer":
        render = <CustomerSideNav />;
        break;
      case "manager":
        render = <ManagerSideNav />;
        break;

      default:
        render = (
          <EmployeeSideNav employeeType={session.user.userType.toString()} />
        );
    }
  }

  if (!session) {
    return;
  }

  return (
    <>
      <section className="min-w-fit md:w-[300px] min-h-screen max-h-screen py-6 bg-background md:border-r flex-col justify-start items-center gap-8 md:inline-flex">
        <Logo />
        <ScrollArea className="grid gap-2 w-full">{render}</ScrollArea>
      </section>
    </>
  );
}
