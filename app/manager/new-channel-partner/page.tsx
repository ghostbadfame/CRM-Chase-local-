"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { format, formatDate } from "date-fns";
import { FieldErrors, useForm } from "react-hook-form";
import {
  NewChannelPartnerFormData,
  NewChannelPartnerSchema,
} from "@/types/types.td";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ErrorDialogContextType,
  useErrorDialog,
} from "@/components/ui/error-dialog";
import { CalendarIcon, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CHANNEL_PARTNER_TYPES, cn } from "@/lib/utils";

function AddNewChannelPartner() {
  const { showDialog } = useErrorDialog() as ErrorDialogContextType;
  const [phoneVerified, setPhoneVerified] = useState(false);
  const form = useForm<NewChannelPartnerFormData>({
    resolver: zodResolver(NewChannelPartnerSchema),
    defaultValues: {
      fullName: "",
      contact: "",
      altContact: undefined,
      address: "",
      city: "",
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

  const onSubmit = async (data: NewChannelPartnerFormData) => {
    try {
      const response = await fetch("/api/channelPartner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast(`Channel Partner ${responseData.new.fullName} has been created`, {
          description: formatDate(new Date(), "PP"),
        });
        showDialog(
          "Success",
          `Channel Partner ${responseData.new.fullName} has been created`
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

  const onError = async (error: FieldErrors<NewChannelPartnerFormData>) => {
    console.log(error);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
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
              name="firm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Firm/Company" {...field} />
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
                  <FormLabel>Address</FormLabel>
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="grid gap-2">
                      <Label htmlFor="birthday">Birthday</Label>
                      <Button
                        variant={"outline"}
                        className={cn("justify-start text-left font-normal")}
                        type="button"
                        disabled={true}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      selected={new Date(field.value || " ")}
                      onDayClick={(value) => {
                        field.onChange(value.toISOString());
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="weddingAnniversary"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="grid gap-2">
                      <Label htmlFor="weddingAnniversary">
                        Wedding Anniversary
                      </Label>
                      <Button
                        variant={"outline"}
                        className={cn("justify-start text-left font-normal")}
                        type="button"
                        disabled={true}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      selected={new Date(field.value || " ")}
                      onDayClick={(value) => {
                        field.onChange(value.toISOString());
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner type *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Partner Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHANNEL_PARTNER_TYPES.map((v) => (
                          <SelectItem value={v} key={v}>
                            {v}
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

export default AddNewChannelPartner;
