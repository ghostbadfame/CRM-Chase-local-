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
import { format, formatDate } from "date-fns";
import { EmployeeForm } from "@/components/emp-edit-form";
import {
  ChannelPartnerSchema,
  EmployeeDetails,
  NewChannelPartnerFormData,
  NewChannelPartnerSchema,
  NewLeadFormData,
  NewLeadSchema,
} from "@/types/types.td";
import {
  ErrorDialogContextType,
  useErrorDialog,
} from "@/components/ui/error-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CHANNEL_PARTNER_TYPES, cn } from "@/lib/utils";
import * as z from "zod";
import RemarksList from "@/components/remarks-list";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

type ChannelPartnerFormData = z.infer<typeof ChannelPartnerSchema>;

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
    arg: { formData: any; channelPartnerNo: string };
  }
): Promise<any> => {
  const finalUrl = `${url}?channelPartnerNo=${arg.channelPartnerNo}`;
  const response = await fetch(finalUrl, {
    method: "PATCH",
    body: JSON.stringify(arg.formData),
  });
  return response;
};

const postRequest = async (
  url: string,
  {
    arg,
  }: {
    arg: { formData: any; channelPartnerNo: string };
  }
): Promise<any> => {
  const finalUrl = `${url}?channelPartnerNo=${arg.channelPartnerNo}`;
  const response = await fetch(finalUrl, {
    method: "POST",
    body: JSON.stringify(arg.formData),
  });
  return response;
};

function ChannelPartner() {
  const params = useParams();
  const form = useForm<ChannelPartnerFormData>({
    resolver: zodResolver(ChannelPartnerSchema),
    defaultValues: {
      altContact: "",
    },
  });
  const [editMode, setEditMode] = useState(false);
  const { data: session } = useSession();
  const { showDialog } = useErrorDialog() as ErrorDialogContextType;

  const {
    data: remarks,
    isLoading: remarksLoading,
    error: remarksError,
  } = useSWR(
    "/api/getchannelPartnerRemark?channelPartnerNo=" + params.slug,
    fetcher
  );

  const {
    data: channelPartnerData,
    isLoading: channelPartnerDataLoading,
    error: channelPartnerDataError,
  } = useSWR(
    "/api/getChannelPartnerData?channelPartnerNo=" + params.slug,
    fetcher
  );

  const {
    data: channelPartnerLeads,
    isLoading: channelPartnerLeadsLoading,
    error: channelPartnerLeadsError,
  } = useSWR(
    "/api/getChannelPartnerLeads?channelPartnerNo=" + params.slug,
    fetcher
  );

  const {
    trigger: updateUserDetailsTrigger,
    isMutating: isMutatingUserDetails,
  } = useSWRMutation("/api/setChannelPartnerData", updateUserDetails);

  const { trigger: addRemark, isMutating: isMutatingAddRemark } =
    useSWRMutation("/api/addChannelPartnerRemark", postRequest);

  useEffect(() => {
    if (!channelPartnerDataError && channelPartnerData) {
      const {
        fullName,
        contact,
        altContact,
        address,
        city,
        email,
        followupDate,
        firm,
        weddingAnniversary,
        birthday,
        userType,
      } = channelPartnerData?.channelPartner;
      form.setValue("fullName", fullName);
      form.setValue("contact", contact);
      form.setValue("city", city);
      form.setValue("firm", firm);
      form.setValue("userType", userType);
      form.setValue("email", email);
      form.setValue("birthday", birthday);
      form.setValue("weddingAnniversary", weddingAnniversary);
      form.setValue("altContact", altContact);
      form.setValue("address", address);
      form.setValue("followupDate", followupDate);
    }
  }, [channelPartnerData, channelPartnerDataError]);

  if (!session?.user) {
    return <Loading />;
  }

  if (session.user.userType != "manager") {
    redirect("/");
  }

  const onSubmit = async (data: ChannelPartnerFormData) => {
    console.clear();
    console.log("submit things");

    const response = await updateUserDetailsTrigger({
      formData: data,
      channelPartnerNo: params.slug as string,
    });

    const responseRemark = await addRemark({
      formData: {
        remark: data.remark,
        channelPartnerNo: params.slug as string,
      },
      channelPartnerNo: params.slug as string,
    });

    if (responseRemark.ok) {
      mutate("/api/getchannelPartnerRemark?channelPartnerNo=" + params.slug);
    }

    if (response.ok && responseRemark.ok) {
      showDialog("Success", "Successfully updated user data!");
    } else {
      const errors = response?.message?.errors?.map(
        (error: any) => error.message
      );
      showDialog("Error", errors?.join(","));
    }
  };

  const onError = async (error: FieldErrors<ChannelPartnerFormData>) => {
    console.log(error);
  };

  return (
    <div className="md:p-8 p-2 justify-center items-center gap-8 flex">
      <div className="flex-col w-full justify-center items-center gap-4 inline-flex">
        {channelPartnerDataLoading && <Loading />}
        <div className="flex justify-between w-full">
          <div className="text-3xl w-full font-semibold">Total leads</div>
          <div className="flex flex-col-reverse md:flex-row  items-end md:justify-end gap-2 w-full">
            <Label
              htmlFor="edit-mode"
              className="text-xs md:text-base text-secondary-foreground"
            >
              Edit Mode
            </Label>
            <Switch
              id="edit-mode"
              checked={editMode}
              onCheckedChange={(val) => {
                setEditMode(val);
              }}
            />
          </div>
        </div>
        <div className="flex gap-8 w-full justify-between">
          <DashboardCard
            href=""
            title={"Total"}
            desc="leads added!"
            progress={channelPartnerLeads?.leadsCount || 0}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="w-full"
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
              <div className="grid gap-2">
                <FormField
                  disabled={!editMode}
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          placeholder="Full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2 items-end">
                <FormField
                  disabled={!editMode}
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone no. *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          type="tel"
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
                  disabled={!editMode}
                  control={form.control}
                  name="firm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firm</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          type="text"
                          placeholder="Firm/Company"
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
                  disabled={!editMode}
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          type="text"
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
                  disabled={!editMode}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          type="text"
                          placeholder="City"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="grid gap-2">
                <FormField
                  disabled={!editMode}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!editMode}
                          type="email"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              <div className="grid gap-2">
                <FormField
                  disabled={!editMode}
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger disabled={!editMode} asChild>
                        <div className="grid gap-2">
                          <Label htmlFor="birthday">Birthday</Label>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal"
                            )}
                            type="button"
                            disabled={!editMode}
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
                          disabled={!editMode}
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
                  disabled={!editMode}
                  control={form.control}
                  name="weddingAnniversary"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild disabled={!editMode}>
                        <div className="grid gap-2">
                          <Label htmlFor="weddingAnniversary">
                            Wedding Anniversary
                          </Label>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal"
                            )}
                            type="button"
                            disabled={!editMode}
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
                          disabled={!editMode}
                          selected={new Date(field.value || " ")}
                          onDayClick={(value) => {
                            field.onChange(value);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  disabled={!editMode}
                  control={form.control}
                  name="followupDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild disabled={!editMode}>
                        <div className="grid gap-2">
                          <Label htmlFor="followupDate">Followup Date</Label>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal"
                            )}
                            type="button"
                            disabled={!editMode}
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
                  disabled={!editMode}
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner type *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!editMode}
                        >
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
                        <Textarea
                          disabled={!editMode}
                          id="remark"
                          placeholder="remark"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2 place-items-start mb-3">
                <Button type="submit" id="sales" disabled={!editMode}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="w-full">
          {remarks?.data && <RemarksList remarks={remarks.data || []} />}
        </div>
      </div>
    </div>
  );
}

export default ChannelPartner;
