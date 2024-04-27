"use client";
import React, {
  InputHTMLAttributes,
  ReactHTMLElement,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import { useForm } from "react-hook-form";
import { NewLeadFormData, NewLeadSchema } from "@/types/types.td";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SelectLeadSource from "@/components/selectLeadSource";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CLIENT_STATUS, SITE_STAGES } from "@/lib/utils";
import {
  ErrorDialogContextType,
  useErrorDialog,
} from "@/components/ui/error-dialog";
import { Check } from "lucide-react";

function AddNewLead() {
  const { showDialog } = useErrorDialog() as ErrorDialogContextType;
  const [phoneVerified, setPhoneVerified] = useState(false);
  const form = useForm<NewLeadFormData>({
    resolver: zodResolver(NewLeadSchema),
    defaultValues: {
      clientStatus: "Welcome",
      fullName: "",
      contact: "",
      altContact: undefined,
      address: "",
      city: "",
      leadSource: "",
      actualSource: "",
      siteStage: "",
      salesPerson: "",
      remark: "",
    },
  });

  const checkPhone = async () => {
    if (form.getValues("contact").length < 10) return;
    const response = await fetch(
      "/api/checkPhone?phone=" + form.getValues("contact")
    );
    if (response.ok) {
      const data = await response.json();
      if (data?.exists == true) {
        showDialog(
          "Error",
          `Lead ${data.lead.fullName} is already in the database. Assigned to ${data.lead.empNo} ${data.lead.username} (${data.lead.userType}).`
        );
      } else if (data && !data?.exists) {
        setPhoneVerified(true);
        const phone = form.getValues("contact");
        isPhoneSame(phone);
      }
    } else {
      toast.error("could not check the phone number");
    }
  };

  const isPhoneSame = (phone: string) => {
    setTimeout(() => {
      if (phone != form.getValues("contact")) setPhoneVerified(false);
      else {
        isPhoneSame(phone);
      }
    }, 2000);
  };

  const onSubmit = async (data: NewLeadFormData) => {
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast(`Lead ${responseData.new.fullName} has been created`, {
          description: formatDate(new Date(), "PP"),
        });
        showDialog(
          "Success",
          `Lead ${responseData.new.fullName} has been created`
        );
        form.reset();
      } else {
        const errorData = await response.json();
        if (errorData.message.errors) {
          const zodError = errorData.message;
          const formattedErrors = zodError.errors.map((error: any) => {
            if (error.code === "unrecognized_keys") {
              return `Unrecognized key(s) in object: ${error.keys.join(", ")}`;
            } else if (error.code === "invalid_type") {
              return `${error.message} at ${error.path.join(".")}`;
            } else {
              return error.message;
            }
          });
          throw new Error(formattedErrors.join(", "));
        } else {
          throw new Error(errorData.message);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      showDialog("Error!", errorMessage);
      console.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 w-full">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 items-end">
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone no. *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {phoneVerified ? (
              <span className="grid place-items-center h-10">
                <Check className="w-5 h-5 text-black bg-green-500 rounded-full p-1" />
              </span>
            ) : (
              <Button
                variant={"secondary"}
                className="w-fit"
                onClick={checkPhone}
                type="button"
              >
                Verify
              </Button>
            )}
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="altContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Phone no.</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Address" {...field} />
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
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="leadSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Source *</FormLabel>
                  <FormControl>
                    <SelectLeadSource
                      value={field.value}
                      onValueChange={field.onChange}
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
              name="actualSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Source *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Actual Source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="siteStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Stage *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Site Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SITE_STAGES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
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
              name="salesPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Person *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Sales Person" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="clientStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead status</FormLabel>
                  <FormControl>
                    <Select disabled defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CLIENT_STATUS).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
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

          <div className="grid gap-2 md:col-span-2">
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark *</FormLabel>
                  <FormControl>
                    <Textarea id="remark" placeholder="remark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2 place-items-start mb-3">
            <Button type="submit" id="sales">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default AddNewLead;
