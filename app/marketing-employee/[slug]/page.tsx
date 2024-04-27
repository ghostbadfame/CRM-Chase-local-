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
import { DataTable } from "@/components/ui/data-table";
import { assignedLeadTableCol } from "@/components/data-table/assignedLeadTableCol";

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
  const { data: session } = useSession();
  const { toast: destructiveToast } = useToast();
  const { showDialog } = useErrorDialog() as ErrorDialogContextType;

  const {
    data: empData,
    isLoading: empDataLoading,
    error: empDataError,
  } = useSWR("/api/getMarketingEmpbyEmpNo?empNo=" + params.slug, fetcher);

  const {
    data: empLeadData,
    isLoading: empLeadDataLoading,
    error: empLeadDataError,
  } = useSWR("/api/getMarketingEmpLeadsCount?empNo=" + params.slug, fetcher);

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
        mutate("/api/getMarketingEmpbyEmpNo?empNo=" + params.slug);
      }
    } catch (e) {
      const error = e as Error;
      destructiveToast({ title: error.message });
    }
  };

  return (
    <div className="md:p-8 p-2 justify-center items-center gap-8 flex">
      <div className="flex-col justify-center items-center gap-6 inline-flex">
        {empDataLoading && <Loading />}
        <div className="text-3xl w-full font-semibold">
          Marketing employee details
        </div>
        <div className="flex gap-2 w-full">
          <DashboardCard
            progress={empLeadData?.leads}
            title="Total Leads"
            desc="added by the employee!"
            href={params.slug + "/employee-leads"}
          />
        </div>
        <div className="w-full">
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
                <div className="grid gap-2 md:grid-cols-2 grid-cols-1 justify-start">
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
        </div>
      </div>
    </div>
  );
}

export default Employee;
