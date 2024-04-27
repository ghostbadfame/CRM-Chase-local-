"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectLeadSource from "@/components/selectLeadSource";
import { Textarea } from "@/components/ui/textarea";
import {
  AFTER_SALES_SERVICES,
  CLIENT_STATUS,
  ENGINEER_TASK,
  SITE_STAGES,
  TECHNICIAN_TASK,
  cn,
} from "@/lib/utils";
import RemarksList from "@/components/remarks-list";
import { Calendar } from "@/components/ui/calendar";
import { useSession } from "next-auth/react";
import DesignLinks from "@/components/design-links";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Icons } from "@/components/icons";
import { ZodError } from "zod";
import { LeadDetails } from "@/types/types.td";
import { useToast } from "@/components/ui/use-toast";
import {
  ErrorDialogContextType,
  useErrorDialog,
} from "@/components/ui/error-dialog";
import { Switch } from "@/components/ui/switch";
import DimensionLinks from "@/components/dimension-links";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormValues {
  leadNo: string;
  fullName: string;
  assignTo: string;
  contact: string;
  priority: string;
  altContact: string;
  clientStatus: string;
  status: string;
  address: string;
  lastDate: string;
  city: string;
  followupDate: string;
  leadSource: string;
  actualSource: string;
  siteStage: string;
  salesPerson: string;
  engineerTask: string;
  technicianTask: string;
  afterSaleService: boolean;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const createRemark = async (
  url: string,
  { arg }: { arg: { remark: string; leadNo: string } }
) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => {
    if (!res.ok) throw new Error("failed to add remark!");
    return res.json();
  });
};

const setDetails = async (url: string, { arg }: { arg: LeadDetails }) => {
  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(arg),
  }).then((res) => {
    if (!res.ok) throw res.json();
    return res.json();
  });
};

function Lead({ params }: { params: { slug: string } }) {
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const { toast: destructiveToast } = useToast();
  const [remark, setRemark] = useState("");
  const [editMode, setEditMode] = useState(false);
  const { showDialog } = useErrorDialog() as ErrorDialogContextType;
  const [calOpen, setCalOpen] = useState(false);

  const { data: session } = useSession();

  const {
    data: leadData,
    isLoading: leadDataLoading,
    error: leadDataError,
  } = useSWR(`/api/getLeadDataLeadNo?leadNo=${params.slug}`, fetcher);

  const {
    data: managers,
    isLoading: managerIsLoading,
    error: managerError,
  } = useSWR("/api/getmanagersName", fetcher);

  const {
    data: employees,
    isLoading: employeeIsLoading,
    error: employeesError,
  } = useSWR(session?.user ? "/api/getEmployeeName" : null, fetcher);

  const {
    data: remarks,
    isLoading: remarksLoading,
    error: remarksError,
  } = useSWR("/api/getRemarks?leadNo=" + params.slug, fetcher);
  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: remarkError,
  } = useSWRMutation("/api/addNewRemark", createRemark);

  const {
    trigger: setDetailsTrigger,
    isMutating: isMutatingDetails,
    error: deatailsError,
  } = useSWRMutation("/api/setLeadDetails?leadNo=" + params.slug, setDetails);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | boolean>
  >({});

  const ShowExtra =
    session?.user.userType.toLocaleLowerCase() == "telecaller" ||
    session?.user.userType.toLocaleLowerCase() == "manager"
      ? true
      : false;

  const ShowDesign =
    session?.user.userType.toLocaleLowerCase() == "designer" ||
    session?.user.userType.toLocaleLowerCase() == "engineer" ||
    session?.user.userType.toLocaleLowerCase() == "technician" ||
    session?.user.userType.toLocaleLowerCase() == "manager"
      ? true
      : false;

  const showEngineersTasks =
    session?.user.userType.toLocaleLowerCase() == "engineer" ||
    session?.user.userType.toLocaleLowerCase() == "manager"
      ? true
      : false;

  const showTechnicianTask =
    session?.user.userType.toLocaleLowerCase() == "technician" ||
    session?.user.userType.toLocaleLowerCase() == "manager"
      ? true
      : false;

  const showAfterSales =
    session?.user.userType.toLocaleLowerCase() != "telecaller" ||
    session?.user.userType.toLocaleLowerCase() != "designer" ||
    session?.user.userType.toLocaleLowerCase() != "engineer";

  const disableClientStatus =
    session?.user.userType.toLocaleLowerCase() == "designer" ||
    session?.user.userType.toLocaleLowerCase() == "engineer";

  useEffect(() => {
    if (!leadData?.lead) return;
    console.log(leadData?.lead);
    setFormValues((prevValues) => ({
      ...prevValues,
      ...leadData.lead,
      assignTo: leadData.lead.assignTo || undefined,
    }));
  }, [leadData]);

  if (leadDataLoading) {
    return (
      <div className="flex justify-center items-center">
        {<Icons.spinner className="animate-spin" />}
      </div>
    );
  }

  if (leadDataError) {
    destructiveToast({
      variant: "destructive",
      title: "failed to fetch lead data!!",
    });
  }

  if (managerError && session?.user.userType != "manager") {
    console.log(managerError);
    destructiveToast({
      variant: "destructive",
      title: "failed to fetch managers list!!",
    });
  }

  if (employeesError && session?.user.userType == "manager") {
    console.log(employeesError);
    destructiveToast({
      variant: "destructive",
      title: "failed to fetch employees list!!",
    });
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (session?.user.userType == "marketing") {
      alert("You can't make any changes!!");
    }
    if (!formValues) return;

    const errors: Partial<FormValues> = {};

    // Validate assign to
    if (!formValues.fullName.trim()) {
      errors.fullName = "full name is required";
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(formValues.contact.trim())) {
      errors.contact = "Phone no. should be 10 digits";
    }

    // Validate priority
    if (!formValues.priority.trim()) {
      errors.priority = "Priority is required";
    }

    // Validate alternative phone number (if provided)
    if (
      formValues.altContact?.trim() &&
      !/^\d{10}$/.test(formValues.altContact?.trim())
    ) {
      errors.altContact = "Alternative Phone no. should be 10 digits";
    }

    // Validate status
    if (!formValues.status.trim()) {
      errors.status = "Status is required";
    }

    // Validate client status
    if (!formValues.status.trim()) {
      errors.clientStatus = "client status is required";
    }

    // Validate address
    if (!formValues.address.trim()) {
      errors.address = "Address is required";
    }

    // Validate city
    if (!formValues.city.trim()) {
      errors.city = "City is required";
    }

    // Validate followup date (you may need to adjust the validation based on the expected format)
    if (!formValues.followupDate.trim()) {
      errors.followupDate = "Followup Date is required";
    }

    // Validate lead source
    if (!formValues.leadSource.trim()) {
      errors.leadSource = "Lead Source is required";
    }

    // Validate site stage
    if (!formValues.siteStage.trim()) {
      errors.siteStage = "Site Stage is required";
    }

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await setDetailsTrigger({
        fullName: formValues.fullName,
        assignTo: formValues.assignTo,
        priority: formValues.priority,
        contact: formValues.contact,
        altContact: formValues.altContact,
        clientStatus: formValues.clientStatus,
        status: formValues.status,
        address: formValues.address,
        city: formValues.city,
        followupDate: formValues.followupDate,
        actualSource: formValues.actualSource,
        siteStage: formValues.siteStage,
        salesPerson: formValues.salesPerson,
        engineerTask: formValues.engineerTask,
        technicianTask: formValues.technicianTask,
        afterSaleService: formValues.afterSaleService,
      });

      handleAddRemark();

      const error = response.message as ZodError;
      if (error?.errors) {
        const formattedErrors = error.errors.map((error) => {
          if (error.code === "unrecognized_keys") {
            return `Unrecognized key(s) in object: ${error.keys.join(", ")}`;
          } else if (error.code === "invalid_type") {
            return `${error.message} at ${error.path.join(".")}`;
          } else if (error.code === "too_small") {
            return `${error.message} at ${error.path.join(".")}`;
          } else {
            return error.message;
          }
        });
        throw formattedErrors;
      }
      if (!deatailsError && response) {
        mutate("/api/getRemarks?leadNo=" + params.slug);
        showDialog("Success", "Updated succsesfully!!", "/assigned-leads");
      }
    } catch (e) {
      const error = e as Array<string>;
      if (Array.isArray(error)) {
        error.forEach((e) => toast.error(e));
      } else {
        const error = e as Error;
        showDialog("Error", error.message);
      }
    }
  };

  async function handleAddRemark() {
    if (!remark.trim()) return;
    try {
      await trigger({
        leadNo: formValues!!.leadNo,
        remark: remark,
      });
      if (!remarkError) {
        toast.success("remark added!");
        mutate("/api/getRemarks?leadNo=" + params.slug);
        setRemark("");
      }
    } catch (error) {
      destructiveToast({
        variant: "destructive",
        title: "failed to add remark!!",
      });
    }
  }

  function getPriorityColor() {
    switch (formValues?.priority) {
      case "p1":
        return "bg-red-500";
      case "p2":
        return "bg-orange-500";
      case "p3":
        return "bg-yellow-500";
      default:
        return "";
    }
  }

  let assignToOptions;

  switch (session?.user.userType) {
    case "manager":
      assignToOptions = (
        <>
          {employees?.data?.map((value: any) => {
            if (value.userType == "marketing") return;
            return (
              <SelectItem value={value.empNo} key={value.empNo}>
                <div className={"flex justify-between gap-2"}>
                  <span>{value.empNo}</span>
                  <span>{value.username}</span>
                  <span className="capitalize">{value.userType}</span>
                </div>
              </SelectItem>
            );
          })}
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Managers</SelectLabel>
            {managers?.data.map((value: any) => {
              return (
                <SelectItem value={value.empNo} key={value.empNo}>
                  {value.username}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </>
      );
      break;

    case "telecaller":
      assignToOptions = (
        <>
          <SelectGroup>
            <SelectLabel>Managers</SelectLabel>
            {managers?.data.map((value: any) => {
              return (
                <SelectItem value={value.empNo} key={value.empNo}>
                  {value.username}
                </SelectItem>
              );
            })}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Telecaller</SelectLabel>
            {employees?.data
              .filter((emp: any) => emp.userType == "telecaller")
              .map((value: any) => {
                return (
                  <SelectItem value={value.empNo} key={value.empNo}>
                    {value.username}
                  </SelectItem>
                );
              })}
          </SelectGroup>
        </>
      );
      break;

    case "designer":
      assignToOptions = (
        <>
          <SelectGroup>
            <SelectLabel>Managers</SelectLabel>
            {managers?.data.map((value: any) => {
              return (
                <SelectItem value={value.empNo} key={value.empNo}>
                  {value.username}
                </SelectItem>
              );
            })}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Telecaller</SelectLabel>
            {employees?.data
              .filter((emp: any) => emp.userType == "telecaller")
              .map((value: any) => {
                return (
                  <SelectItem value={value.empNo} key={value.empNo}>
                    {value.username}
                  </SelectItem>
                );
              })}
          </SelectGroup>
        </>
      );
      break;

    default:
      assignToOptions = (
        <>
          <SelectGroup>
            <SelectLabel>Managers</SelectLabel>
            {managers?.data.map((value: any) => {
              return (
                <SelectItem value={value.empNo} key={value.empNo}>
                  {value.username}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </>
      );
  }

  return (
    formValues && (
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="grid gap-2 mb-3">
          <h1 className="">
            <input
              type="text"
              id="fullName"
              placeholder="Fullname"
              className="md:text-4xl text-3xl font-extrabold tracking-tight lg:text-5xl border-none bg-transparent focus:outline-none truncate"
              value={formValues.fullName}
              disabled={!editMode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFormValues((prevValues) => ({
                  ...prevValues!!,
                  fullName: e.target.value,
                }));
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  fullName: "",
                }));
              }}
            />
            {validationErrors.fullName && (
              <div className="text-red-500">{validationErrors.fullName}</div>
            )}
          </h1>
        </div>
        <div className="grid place-items-end gap-2 mb-3">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2">
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
        <div className="grid gap-2">
          <Label htmlFor="leadNo">Lead No.</Label>
          <Input
            type="text"
            id="leadNo"
            placeholder="Lead No."
            disabled
            value={formValues.leadNo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormValues((prevValues) => ({
                ...prevValues!!,
                leadNo: e.target.value,
              }));
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                leadNo: "",
              }));
            }}
          />
          {validationErrors.leadNo && (
            <div className="text-red-500">{validationErrors.leadNo}</div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="assignTo">Assign To</Label>
          <Select
            value={formValues?.assignTo}
            onValueChange={(value) =>
              setFormValues((prev) => ({ ...prev!!, assignTo: value }))
            }
            disabled={
              managerIsLoading ||
              managerError ||
              employeeIsLoading ||
              employeesError
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Click to assign" />
            </SelectTrigger>
            <SelectContent className="w-full">{assignToOptions}</SelectContent>
          </Select>
          {validationErrors.assignTo && (
            <div className="text-red-500">{validationErrors.assignTo}</div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contact">Phone no.</Label>
          <Input
            type="tel"
            id="contact"
            placeholder="Contact"
            value={formValues.contact}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormValues((prevValues) => ({
                ...prevValues!!,
                contact: e.target.value,
              }));
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                contact: "",
              }));
            }}
            disabled={!editMode}
          />
          {validationErrors.contact && (
            <div className="text-red-500">{validationErrors.contact}</div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formValues.priority}
            onValueChange={(value) =>
              setFormValues((prevValues) => ({
                ...prevValues!!,
                priority: value,
              }))
            }
          >
            <SelectTrigger className={getPriorityColor()}>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p1">P1</SelectItem>
              <SelectItem value="p2">P2</SelectItem>
              <SelectItem value="p3">P3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="altContact">Alternative Phone no.</Label>
          <Input
            type="tel"
            id="altContact"
            placeholder="Alternative Contact"
            value={formValues.altContact}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormValues((prevValues) => ({
                ...prevValues!!,
                altContact: e.target.value,
              }));
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                altContact: "",
              }));
            }}
          />
          {validationErrors.altContact && (
            <div className="text-red-500">{validationErrors.altContact}</div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formValues.status}
            onValueChange={(value) =>
              setFormValues((prevValues) => ({
                ...prevValues!!,
                status: value,
              }))
            }
          >
            <SelectTrigger
              className={
                formValues.status &&
                (formValues.status == "done" ? "bg-green-500" : "bg-red-500")
              }
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Client Status</Label>
          <Select
            value={formValues.clientStatus}
            onValueChange={(value) =>
              setFormValues((prevValues) => ({
                ...prevValues!!,
                clientStatus: value,
              }))
            }
            disabled={disableClientStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Client Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CLIENT_STATUS).map((value, i) => {
                return (
                  <SelectItem value={value[1]} key={value[0]}>
                    {value[1]}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {showEngineersTasks && (
          <div className="grid gap-2">
            <Label htmlFor="status">Engineer Tasks</Label>
            <Select
              value={formValues.engineerTask}
              onValueChange={(value) =>
                setFormValues((prevValues) => ({
                  ...prevValues!!,
                  engineerTask: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Engineer Tasks" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ENGINEER_TASK).map((value, i) => {
                  return (
                    <SelectItem value={value[1]} key={value[0]}>
                      {value[1]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
        {showTechnicianTask && (
          <div className="grid gap-2">
            <Label htmlFor="status">Technician Tasks</Label>
            <Select
              value={formValues.technicianTask}
              onValueChange={(value) =>
                setFormValues((prevValues) => ({
                  ...prevValues!!,
                  technicianTask: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Technician Tasks" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TECHNICIAN_TASK).map((value, i) => {
                  return (
                    <SelectItem value={value[1]} key={value[0]}>
                      {value[1]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
        {showAfterSales && (
          <div className="grid gap-2">
            <Label htmlFor="status">After Sale Services</Label>
            <Select
              value={formValues.afterSaleService ? "true" : undefined}
              onValueChange={(value) =>
                setFormValues((prevValues) => ({
                  ...prevValues!!,
                  afterSaleService: value === "true" ? true : false,
                }))
              }
              disabled={formValues.clientStatus.toLowerCase() !== "won"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AFTER_SALES_SERVICES).map((value, i) => {
                  return (
                    <SelectItem value={value[1]} key={value[0]}>
                      {value[1]}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            placeholder="Address"
            value={formValues.address}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormValues((prevValues) => ({
                ...prevValues!!,
                address: e.target.value,
              }));
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                address: "",
              }));
            }}
            disabled={!editMode}
          />
          {validationErrors.address && (
            <div className="text-red-500">{validationErrors.address}</div>
          )}
        </div>
        <Popover open={false}>
          <PopoverTrigger asChild>
            <div className="grid gap-2">
              <Label htmlFor="lastDate">Last Date</Label>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !formValues.lastDate && "text-muted-foreground"
                )}
                type="button"
                disabled={true}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formValues.lastDate ? (
                  format(formValues.lastDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              selected={new Date(formValues.lastDate)}
              onDayClick={(value) => {
                setFormValues((prevValues) => ({
                  ...prevValues!!,
                  lastDate: value.toISOString(),
                }));
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  lastDate: "",
                }));
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            placeholder="City"
            value={formValues.city}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormValues((prevValues) => ({
                ...prevValues!!,
                city: e.target.value,
              }));
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                city: "",
              }));
            }}
          />
          {validationErrors.city && (
            <div className="text-red-500">{validationErrors.city}</div>
          )}
        </div>
        <Popover open={calOpen} onOpenChange={(open) => setCalOpen(open)}>
          <PopoverTrigger asChild>
            <div className="grid gap-2">
              <Label htmlFor="followupDate">Followup Date</Label>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !formValues.followupDate && "text-muted-foreground"
                )}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formValues.followupDate ? (
                  format(formValues.followupDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              selected={new Date(formValues.followupDate)}
              onDayClick={(value) => {
                setFormValues((prev) => ({
                  ...prev!!,
                  followupDate: value.toISOString(),
                }));
                setCalOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="grid gap-2">
          <Label htmlFor="leadSource">Lead Source</Label>
          <SelectLeadSource
            value={formValues.leadSource}
            onValueChange={(value) => {
              setFormValues((prevValues) => ({
                ...prevValues!!,
                leadSource: value,
              }));
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                leadSource: "",
              }));
            }}
          />
          {validationErrors.leadSource && (
            <div className="text-red-500">{validationErrors.leadSource}</div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="actualSource">Actual Source</Label>
          <Input
            type="text"
            id="actualSource"
            placeholder="Actual Source"
            value={formValues.actualSource}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFormValues((prevValues) => ({
                ...prevValues!!,
                actualSource: e.target.value,
              }));
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                actualSource: "",
              }));
            }}
          />
          {validationErrors.actualSource && (
            <div className="text-red-500">{validationErrors.actualSource}</div>
          )}
        </div>
        {ShowExtra && editMode && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="siteStage">Site Stage</Label>
              <Select
                value={formValues.siteStage}
                onValueChange={(value) =>
                  setFormValues((prevValues) => ({
                    ...prevValues!!,
                    siteStage: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Site Stage" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SITE_STAGES).map((value, i) => {
                    return (
                      <SelectItem value={value[0]} key={value[0]}>
                        {value[1]}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salesPerson">Sales Person</Label>
              <Input
                type="text"
                id="salesPerson"
                placeholder="Sales Person"
                value={formValues.salesPerson}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFormValues((prevValues) => ({
                    ...prevValues!!,
                    salesPerson: e.target.value,
                  }));
                  setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    salesPerson: "",
                  }));
                }}
              />
              {validationErrors.salesPerson && (
                <div className="text-red-500">
                  {validationErrors.salesPerson}
                </div>
              )}
            </div>
          </>
        )}
        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="design">Remark</Label>
          <Textarea
            id="remark"
            placeholder="Remark"
            value={remark}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setRemark(e.target.value);
              setValidationErrors((prevErrors) => ({
                ...prevErrors,
                remark: "",
              }));
            }}
          />
          {validationErrors.remark && (
            <div className="text-red-500">{validationErrors.remark}</div>
          )}
        </div>
        {session?.user.userType != "marketing" && (
          <div className="grid gap-2 md:col-span-2">
            <Button
              type="submit"
              id="sales"
              className="w-fit"
              disabled={isMutatingDetails}
            >
              Submit
            </Button>
          </div>
        )}
        {remarks && <RemarksList remarks={remarks.data || []} />}
        {ShowDesign && <DesignLinks leadNo={formValues.leadNo} />}
        {ShowDesign && <DimensionLinks leadNo={formValues.leadNo} />}
      </form>
    )
  );
}

export default Lead;
