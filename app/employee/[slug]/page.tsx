"use client";
import useSWR, { mutate } from "swr";
import CompactUserDetails from "@/components/dashboard/compact-user-details";
import DashboardCard from "@/components/dashboard/dashboard-card";
import DashboardGraph from "@/components/dashboard/dashboard-graph";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { redirect, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import useSWRMutation from "swr/mutation";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "date-fns";
import { EmployeeForm } from "@/components/emp-edit-form";
import { EmployeeDetails } from "@/types/types.td";
import {
  ErrorDialogContextType,
  useErrorDialog,
} from "@/components/ui/error-dialog";
import { toast } from "sonner";

interface LeadAnalytics {
  date: string;
  done: number;
  pending: number;
}

const fetcher: any = async (url: string) => {
  const response = await fetch(url);
  const data = response.json();
  return data;
};

const updateUserDetails = async (
  url: string,
  {
    arg,
  }: {
    arg: { formData: any; empNo: string };
  }
): Promise<any> => {
  const finalUrl = `${url}?empNo=${arg.empNo}`;
  const response = await fetch(finalUrl, {
    method: "PATCH",
    body: JSON.stringify(arg.formData),
  });
  return response;
};

const patchRequest = async (url: string) => {
  const response = await fetch(url, {
    method: "PATCH",
  });
  const data = response.json();
  if (response.ok) {
    return data;
  } else {
    console.error(data);
    throw new Error("request failed!!");
  }
};

const restrictUser = async (
  url: string,
  { arg }: { arg: { restricted: boolean } }
) => {
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(arg),
  });
  const data = response.json();
  if (response.ok) {
    return data;
  } else {
    console.error(data);
    throw new Error("request failed!!");
  }
};

function Employee() {
  const params = useParams();
  let graphData: LeadAnalytics[] = [];
  const { data: session } = useSession();
  const { toast: destructiveToast } = useToast();
  const { showDialog } = useErrorDialog() as ErrorDialogContextType;

  const {
    data: empData,
    isLoading: empDataLoading,
    error: empDataError,
  } = useSWR("/api/getEmpDetailsByEmpNo?empNo=" + params.slug, fetcher);

  const {
    data: fetchGraphData,
    isLoading: isGraphDataLoading,
    error: graphDataError,
  } = useSWR(
    empData
      ? `/api/getcountLeadsofweek?empId=${empData?.data?.id}&userType=${empData?.data?.userType}`
      : null,
    fetcher
  );

  const {
    data: leadCount,
    isLoading: leadCountLoading,
    error: leadCountError,
  } = useSWR(
    empData
      ? `/api/getTotalLeadsCount?empId=${empData?.data?.id}&userType=${empData?.data?.userType}`
      : null,
    fetcher
  );

  const { trigger, isMutating } = useSWRMutation(
    "/api/passwordReset?empNo=" + params.slug,
    patchRequest
  );

  const { trigger: restrict, isMutating: restricting } = useSWRMutation(
    "/api/restrict?empNo=" + params.slug,
    restrictUser
  );

  const {
    trigger: updateUserDetailsTrigger,
    isMutating: isMutatingUserDetails,
  } = useSWRMutation("/api/setUserData", updateUserDetails);

  if (!session?.user) {
    return <Loading />;
  }

  if (
    session.user.userType != "manager" &&
    session.user.userType != "telecaller"
  ) {
    redirect("/");
  }

  graphData = fetchGraphData?.result || [];

  const resetPassword = async () => {
    try {
      if (confirm("You're going to reset the password!!") == true) {
        trigger();
      }
    } catch (e) {
      const error = e as Error;
      destructiveToast({ title: error.message });
    }
  };

  const onSubmit = async (data: EmployeeDetails) => {
    const response = await updateUserDetailsTrigger({
      formData: data,
      empNo: params.slug as string,
    });
    if (response.ok) {
      showDialog("Success", "Successfully updated user data!");
    } else {
      const errors = response?.message?.errors?.map(
        (error: any) => error.message
      );
      showDialog("Error", errors?.join(","));
    }
  };

  const handleRestrict = async (res: boolean) => {
    try {
      if (
        confirm(
          `You're going to ${res ? "restrict" : "allow"} the user access!!`
        ) == true
      ) {
        const data = await restrict({ restricted: res });
        toast.success("employee " + (res ? "restricted!" : "allowed!"));
        mutate("/api/getEmpDetailsByEmpNo?empNo=" + params.slug);
      }
    } catch (e) {
      const error = e as Error;
      destructiveToast({ title: error.message });
    }
  };

  return (
    <div className="p-8 justify-center items-center gap-8 flex">
      <div className="flex-col justify-center items-center gap-6 inline-flex">
        {(empDataLoading || isGraphDataLoading || leadCountLoading) && (
          <Loading />
        )}
        <div className="text-3xl w-full font-semibold">Today&apos;s Leads</div>
        <div className="flex gap-8 w-full justify-between">
          <DashboardCard
            href={`${params.slug}/employee-leads?date=${formatDate(
              new Date(),
              "dd-MM-yyyy"
            )}&employee=${params.slug}`}
            title={"Total"}
            desc="of the day!"
            progress={leadCount?.total || 0}
          />
          <DashboardCard
            href={params.slug + "/employee-leads/done"}
            title={"Done"}
            desc="of the day!"
            progress={leadCount?.done || 0}
            textColor="text-green-500"
          />
          <DashboardCard
            href={params.slug + "/employee-leads/pending"}
            title={"Pending"}
            desc="of the day!"
            progress={leadCount?.pending || 0}
            textColor="text-red-500"
          />
        </div>
        <CompactUserDetails>
          <div className="grid gap-2">
            <Label htmlFor="employeeNo">Employee Id</Label>
            <Input
              type="text"
              disabled
              id="employeeNo"
              placeholder="Employee no."
              value={empData?.data?.empNo}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="manager">Reporting Manager</Label>
            <Input
              type="text"
              disabled
              id="manager"
              value={empData?.data?.reportingManager}
              placeholder="Reporting Manager"
            />
          </div>
          {session.user.userType == "manager" ? (
            <>
              {empData?.data && (
                <EmployeeForm
                  onSubmit={onSubmit}
                  defaultValues={{
                    username: empData?.data?.username,
                    email: empData?.data?.email,
                    contact: empData?.data?.contact,
                    address: empData?.data?.address,
                  }}
                />
              )}
              <div className="grid gap-2 grid-flow-col justify-start">
                <Button
                  variant={"destructive"}
                  className="w-fit"
                  onClick={resetPassword}
                >
                  Reset Password
                </Button>
                {!empData?.data?.restricted ? (
                  <Button
                    variant={"destructive"}
                    className="w-fit"
                    onClick={() => handleRestrict(true)}
                  >
                    Restrict User
                  </Button>
                ) : (
                  <Button
                    variant={"destructive"}
                    className="w-fit"
                    onClick={() => handleRestrict(false)}
                  >
                    Allow User
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </CompactUserDetails>

        <div className="grid gap-8 w-full">
          <DashboardGraph data={graphData} type="employee" />
        </div>
      </div>
    </div>
  );
}

export default Employee;
