"use client";
import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { NewEmployeeFormData, NewEmployeeSchema } from "@/types/types.td";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodError } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { EMPLOYEE_TYPES } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import {
  ErrorDialogContextType,
  useErrorDialog,
} from "@/components/ui/error-dialog";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const res = await response.json();
  return res;
};

const createEmployee = async (url: string, { arg }: { arg: any }) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ ...arg }),
  });
  const res = await response.json();
  if (!response.ok) {
    console.clear();
    console.log("this fired");
    if (res.status >= 500) {
      const error = res.message as ZodError;
      if (error?.errors) {
        const formattedErrors = error.errors.map((error) => {
          if (error.code === "unrecognized_keys") {
            return `Unrecognized key(s) in object: ${error.keys.join(", ")}`;
          } else if (error.code === "invalid_type") {
            return `${error.message} at ${error.path.join(".")}`;
          } else {
            return error.message;
          }
        });
        throw formattedErrors;
      }
      throw new Error("Server error. Please try again later.");
    } else {
      // Handle other types of errors
      throw new Error(res.message || "An error occurred. Please try again.");
    }
  }
  return res;
};

function AddNewEmployee() {
  const { data: session } = useSession();
  const { showDialog } = useErrorDialog() as ErrorDialogContextType;
  const [error, setError] = useState("");

  const {
    data: employees,
    isLoading: employeeIsLoading,
    error: employeesError,
  } = useSWR(
    session?.user.userType == "manager" ? "/api/getEmployeeName" : null,
    fetcher
  );

  const form = useForm<NewEmployeeFormData>({
    resolver: zodResolver(NewEmployeeSchema),
    defaultValues: {
      username: "",
      email: "",
      userType: "",
      contact: "",
      altContact: undefined,
      address: "",
      city: "",
      govtID: "",
      role: "BASIC",
      reportingManager: "",
      referenceEmployee: undefined,
    },
  });

  const {
    data: managersData,
    isLoading: managerIsLoading,
    error: managerError,
  } = useSWR("/api/getmanagersName", fetcher);

  const {
    trigger,
    isMutating,
    error: mutationError,
  } = useSWRMutation("/api/addEmployee", createEmployee);

  const onSubmit = async (data: NewEmployeeFormData) => {
    try {
      const response = await trigger({
        arg: data,
      });
      if (response?.new) {
        // toast("Employee has been added", {
        //   description: formatDate(new Date(), "PP"),
        // });
        showDialog("Success", "Employee has been added.");
        form.reset();
      }
    } catch (e) {
      if (Array.isArray(e)) {
        setError(e.join(","));
        showDialog("Error", e.join(","));
      } else if (e instanceof Error) {
        setError(e.message);
        showDialog("Error", e.message);
      }
    }
  };

  const onError = async (error: FieldErrors<NewEmployeeFormData>) => {
    console.log(error);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 w-full">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="name">Full Name *</Label>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="contact">Contact No. *</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      id="contact"
                      placeholder="Contact"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="altContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="altContact">Alternative Contact No.</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="altContact"
                      placeholder="Alternative Contact"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="email">Email *</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="address">Address *</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="address"
                      placeholder="Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="city">City *</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="city"
                      placeholder="City"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="userType">Department *</Label>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EMPLOYEE_TYPES).map((value) => (
                          <SelectItem value={value[0]} key={value[0]}>
                            {value[1]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="role">Role *</Label>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"BASIC"}>BASIC</SelectItem>
                        <SelectItem value={"ADMIN"}>ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="govtID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="govtID">Adhaar ID *</Label>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="govtID"
                      placeholder="Adhaar ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="reportingManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="reportingManager">
                      Reporting Manager *
                    </Label>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={managerIsLoading || managerError}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {managersData?.data?.map((value: any) => {
                          return (
                            <SelectItem value={value.empNo} key={value.empNo}>
                              {value.username}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="referenceEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Label htmlFor="referenceEmployee">
                      Reference Employee
                    </Label>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={employeeIsLoading || employeesError}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {employees?.data.map((value: any) => {
                          return (
                            <SelectItem value={value.empNo} key={value.empNo}>
                              <div className={"flex justify-between gap-2"}>
                                <span>{value.empNo}</span>
                                <span>{value.username}</span>
                                <span className="capitalize">
                                  {value.userType}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Button type="submit" className="w-fit" disabled={isMutating}>
              Add Employee
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default AddNewEmployee;
