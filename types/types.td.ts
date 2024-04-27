import { FieldError, UseFormRegister } from "react-hook-form";
import * as z from "zod";

export type NewLeadFormData = {
  fullName: string;
  contact: string;
  altContact?: string;
  address: string;
  city: string;
  leadSource: string;
  actualSource: string;
  siteStage: string;
  salesPerson: string;
  clientStatus: string;
  remark: string;
};

export type NewLeadFormFieldProps = {
  type: string;
  placeholder: string;
  name: NewLeadFormValidFieldNames;
  register: UseFormRegister<NewLeadFormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type NewLeadFormValidFieldNames =
  | "fullName"
  | "contact"
  | "altContact"
  | "address"
  | "city"
  | "leadSource"
  | "actualSource"
  | "siteStage"
  | "salesPerson"
  | "clientStatus"
  | "remark";

export const NewLeadSchema = z.object({
  fullName: z.string().min(1, "Username is required").max(100),
  contact: z.string().length(10, "Contact must have 10 characters"),
  altContact: z.union([
    z.string().length(10, "altContact must have 10 characters").optional(),
    z.literal(""),
  ]),
  address: z.string().min(1, "address is required").max(100),
  city: z.string().min(1, "city is required").max(100),
  siteStage: z.string().min(1, "siteStage is required").max(100),
  actualSource: z.string().min(1, "actual source is required").max(100),
  salesPerson: z.string().min(1, "sales person is required").max(100),
  leadSource: z.string().min(1, "leadSource is required").max(100),
  clientStatus: z.string(),
  remark: z.string().min(1, "remark is required").max(100),
});

export type NewChannelPartnerFormData = {
  fullName: string;
  contact: string;
  email: string;
  altContact?: string;
  address?: string;
  city?: string;
  userType: string;
  birthday?: Date;
  weddingAnniversary: Date;
  firm?: string;
  remark: string;
};

export type NewChannelPartnerFormFieldProps = {
  type: string;
  placeholder: string;
  name: NewChannelPartnerFormValidFieldNames;
  register: UseFormRegister<NewChannelPartnerFormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type NewChannelPartnerFormValidFieldNames =
  | "fullName"
  | "contact"
  | "email"
  | "altContact"
  | "address"
  | "city"
  | "birthday"
  | "remark"
  | "userType"
  | "firm"
  | "weddingAnniversary";

export const NewChannelPartnerSchema = z.object({
  fullName: z.string().min(1, "Username is required").max(100),
  contact: z.string().length(10, "Contact must have 10 characters"),
  altContact: z
    .string()
    .length(10, "altContact must have 10 characters")
    .optional()
    .nullable(),
  address: z.string().min(1, "address is required").max(100),
  city: z.string().min(1, "city is required").max(100),
  remark: z.string().min(1, "remark is required").max(100),
  userType: z.string().min(1, "userType is required").max(100),
  birthday: z.string().optional().nullable(),
  weddingAnniversary: z.string().optional().nullable(),
  firm: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
});

export const ChannelPartnerSchema = z.object({
  fullName: z.string().min(1, "Username is required").max(100),
  contact: z.string().length(10, "Contact must have 10 characters"),
  altContact: z
    .string()
    .length(10, "altContact must have 10 characters")
    .optional()
    .nullable(),
  address: z.string().min(1, "address is required").max(100),
  city: z.string().min(1, "city is required").max(100),
  remark: z.string().min(1, "remark is required").max(100),
  userType: z.string().min(1, "userType is required").max(100),
  birthday: z.string().optional().nullable(),
  weddingAnniversary: z.string().optional().nullable(),
  firm: z.string(),
  email: z.string().email().optional().nullable(),
  followupDate: z.string().optional().nullable(),
});

export type NewEmployeeFormData = {
  username: string;
  email: string;
  userType: string;
  contact: string;
  altContact?: string | undefined;
  address: string;
  city: string;
  govtID: string;
  reportingManager: string;
  role: string;
  referenceEmployee?: string | undefined;
};

export type NewEmployeeFormFieldProps = {
  type: string;
  placeholder: string;
  name: NewEmployeeFormValidFieldNames;
  register: UseFormRegister<NewEmployeeFormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type NewEmployeeFormValidFieldNames =
  | "username"
  | "email"
  | "userType"
  | "contact"
  | "altContact"
  | "address"
  | "city"
  | "role"
  | "govtID"
  | "reportingManager"
  | "referenceEmployee";

export const NewEmployeeSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  userType: z.string().min(1, "Usertype is required").max(100),
  contact: z.string().length(10, "Contact must have 10 characters"),
  altContact: z.union([
    z.string().length(10, "altContact must have 10 characters").optional(),
    z.literal(""),
  ]),
  address: z.string().min(1, "address is required").max(100),
  city: z.string().min(1, "city is required").max(100),
  govtID: z.string().min(12, "govtID is required").max(12),
  reportingManager: z.string().min(1, "reportingManager is required").max(100),
  role: z.enum(["ADMIN", "BASIC"]),
  referenceEmployee: z.union([
    z.string().min(4, "invalid emp no").max(100).optional(),
    z.literal(""),
  ]),
});

export const LeadDetailsSchema = z.object({
  clientStatus: z
    .string()
    .min(1, "Client status cannot be empty")
    .max(100, "Client status must be under 100 characters")
    .optional()
    .nullable(),
  technicianTask: z
    .string()
    .min(1, "Technician Task cannot be empty")
    .max(100, "Technician Task must be under 100 characters")
    .optional()
    .nullable(),
  engineerTask: z
    .string()
    .min(1, "Engineer's Task cannot be empty")
    .max(100, "Engineer's Task must be under 100 characters")
    .optional()
    .nullable(),
  priority: z
    .string()
    .min(1, "Priority cannot be empty")
    .max(100, "Priority must be under 100 characters")
    .optional()
    .nullable(),
  followupDate: z
    .string()
    .min(1, "Follow-up date cannot be empty")
    .max(100, "Follow-up date must be under 100 characters")
    .optional()
    .nullable(),
  status: z
    .string()
    .min(1, "Status cannot be empty")
    .max(100, "Status must be under 100 characters")
    .optional()
    .nullable(),
  siteStage: z
    .string()
    .min(1, "Site stage cannot be empty")
    .max(100, "Site stage must be under 100 characters")
    .optional()
    .nullable(),
  assignTo: z
    .string()
    .min(1, "Assign to cannot be empty")
    .max(100, "Assign to must be under 100 characters")
    .optional()
    .nullable(),
  fullName: z
    .string()
    .min(1, "Full name cannot be empty")
    .max(100, "Full name must be under 100 characters")
    .optional()
    .nullable(),
  city: z
    .string()
    .min(1, "City cannot be empty")
    .max(100, "City must be under 100 characters")
    .optional()
    .nullable(),
  address: z
    .string()
    .min(1, "Address cannot be empty")
    .max(100, "Address must be under 100 characters")
    .optional()
    .nullable(),
  actualSource: z
    .string()
    .min(1, "Actual source cannot be empty")
    .max(100, "Actual source must be under 100 characters")
    .optional()
    .nullable(),
  salesPerson: z
    .string()
    .min(1, "Sales person cannot be empty")
    .max(100, "Sales person must be under 100 characters")
    .optional()
    .nullable(),
  afterSaleService: z.boolean().optional().nullable(),
  altContact: z.union([
    z
      .string()
      .length(10, "Alternative contact must exactly have 10 characters")
      .optional()
      .nullable(),
    z.literal(""),
  ]),
  contact: z
    .string()
    .length(10, "Contact must exactly have 10 characters")
    .optional()
    .nullable(),
});

export type LeadDetails = z.infer<typeof LeadDetailsSchema>;

export const EmployeeDetailsSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  contact: z.string().length(10, { message: "Contact must be 10 digits" }),
  address: z.string().min(1, "Address is required").optional().nullable(),
  reportingManager: z.string().optional().nullable(),
});

export type EmployeeDetails = z.infer<typeof EmployeeDetailsSchema>;
