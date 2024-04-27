import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Lead = {
  leadNo: string;
  fullName: string;
  contact: string;
  priority: "P1" | "P2" | "P3";
  clientStatus:
    | "Welcome"
    | "Visit and Dim pending"
    | "Visit done- Dim pending"
    | "Dim done- Visit pending"
    | "Visit and Dim done"
    | "Design Discussion 1"
    | "Design Discussion 2"
    | "Design Discussion 3"
    | "Design Discussion 4"
    | "Costing Given"
    | "Won"
    | "Lost";
  siteStage:
    | "Initial"
    | "Brick Work"
    | "Lanter/Slab"
    | "Plaster"
    | "Flooring"
    | "Finishing"
    | "Renovation";
  updatedAt: Date;
  followupDate: Date;
  assignToDate: Date;
  leadSource: string;
  actualSource: string;
  lastDate?: Date;
};

export interface AssignedLead extends Lead {}

export interface AttendedLead extends Lead {
  remark: string;
}

export type ChannelPartner = {
  channelPartnerNo: string;
  fullName: string;
  contact: string;
  updatedAt: Date;
  birthday: Date;
  userType: string;
  firm: string;
  followUpDate: string;
  remark: string;
  address: string;
};

export interface ScheduledCalls extends Lead {
  remark: string;
}
export const SOURCE_TYPES = {
  Architect: "Architect",
  Builder: "Builder/Contracter",
  BNI: "BNI",
  ClientReference: "Client Reference",
  WalkIn: "Walk-In",
  Marketing: "Marketing",
};

export const SOURCE_TYPES_DIGITAL = {
  faceBook: "Facebook ads",
  Google: "Google",
};

export type Employee = {
  fullName: string;
  phone: string;
  altPhone: string;
  address: string;
  city: string;
  department:
    | "Telecaller"
    | "Technician"
    | "Manager"
    | "Engineer"
    | "Designer"
    | "Marketing";
  employeeId: string;
  reportingManager: string;
  referenceEmployee: string;
};

export type EmployeeCompactData = {
  empNo: string;
  username: string;
  assigned: number;
  done: number;
  pending: number;
};

export type MarketingEmployeeCompactData = {
  empNo: string;
  username: string;
  total: number;
};

export const CHANNEL_PARTNER_TYPES = ["Architect", "BNI","Contractor","Builder"];

export const SITE_STAGES = {
  Initial: "Initial",
  BrickWork: "Brick Work",
  LanterSlab: "Lanter/Slab",
  Plaster: "Plaster",
  Flooring: "Flooring",
  Finishing: "Finishing",
  Renovation: "Renovation",
};

export const PRIORITY = {
  P1: "P1",
  P2: "P2",
  P3: "P3",
};

export const CLIENT_STATUS = {
  Welcome: "Welcome",
  VisitDimPending: "Visit and Dim pending",
  VisitDoneDimPending: "Visit done- Dim pending",
  DimDoneVisitPending: "Dim done- Visit pending",
  VisitDimDone: "Visit and Dim done",
  DesignDiscussion1: "Design Discussion 1",
  DesignDiscussion2: "Design Discussion 2",
  DesignDiscussion3: "Design Discussion 3",
  DesignDiscussion4: "Design Discussion 4",
  CostingGiven: "Costing Given",
  OrderDone: "Order Done",
  OrderPending: "Order Pending",
  OrderProcessing: "Order Processing",
  Won: "Won",
  Lost: "Lost",
};

export const ENGINEER_TASK = {
  PreSaleDimension: "Pre Sale Dimension",
  PostSaleDimension: "Post Sale Dimension",
  EPPointsMarking: "EP Points Marking",
  EPPointsCheck: "EP Points Check",
  FinalDimension: "Final Dimension",
  FinalInspection: "Final Inspection",
};

export const TECHNICIAN_TASK = {
  Installation: "Installation",
  PendingPostInstallation: "Pending Post Installation",
  Finishing: "Finishing",
  Handover: "Handover",
};

export const EMPLOYEE_TYPES = {
  telecaller: "Telecaller",
  technician: "Technician",
  manager: "Manager",
  engineer: "Engineer",
  designer: "Designer",
  marketing: "Marketing",
};

export const AFTER_SALES_SERVICES = {
  complaints: "Complaints",
  resolved: "Resolved",
  postSalesServices: "Post Sales Services",
};
