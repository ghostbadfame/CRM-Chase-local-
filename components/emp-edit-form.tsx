import React from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const schema = z.object({
  username: z.string().min(1, "Name is required"),
  email: z.string().email().min(1, "Email is required"),
  contact: z.string().length(10, "Phone no. should be 10 digits"),
  address: z.string().min(1, "Address is required"),
});

interface EmployeeFormData {
  username: string;
  email: string;
  contact: string;
  address: string;
}

interface EmployeeFormProps {
  defaultValues?: EmployeeFormData;
  onSubmit: SubmitHandler<EmployeeFormData>;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 md:col-span-2 gap-4 w-full"
    >
      <LabelInputErrorPair
        label="Username"
        id="username"
        error={errors.username}
        register={register}
      />
      <LabelInputErrorPair
        label="Email"
        id="email"
        error={errors.email}
        register={register}
        type="email"
      />
      <LabelInputErrorPair
        label="Contact"
        id="contact"
        error={errors.contact}
        register={register}
        type="tel"
      />
      <LabelInputErrorPair
        label="Address"
        id="address"
        error={errors.address}
        register={register}
      />
      {/* Submit Button */}
      <div className="md:col-span-2">
        <Button type="submit" variant={"outline"}>
          Submit
        </Button>
      </div>
    </form>
  );
};

interface LabelInputErrorPairProps {
  label: string;
  id: keyof EmployeeFormData;
  error?: FieldError;
  register: ReturnType<typeof useForm<EmployeeFormData>>["register"];
  type?: React.HTMLInputTypeAttribute;
}

function LabelInputErrorPair({
  label,
  id,
  error,
  register,
  type,
}: LabelInputErrorPairProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input type={type} {...register(id)} placeholder={label} />
      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  );
}
