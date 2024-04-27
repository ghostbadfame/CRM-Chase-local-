"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  FieldError,
  FieldValue,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  EmployeeDetails as TEmployeeDetails,
  EmployeeDetailsSchema,
} from "@/types/types.td";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const updateUserDetails = async (
  url: string,
  {
    arg,
  }: {
    arg: { formData: TEmployeeDetails; empNo: string };
  }
): Promise<any> => {
  const finalUrl = `${url}?empNo=${arg.empNo}`;
  const response = await fetch(finalUrl, {
    method: "PATCH",
    body: JSON.stringify(arg.formData),
  });
  return response;
};

function EmployeeDetails() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, error } = useSWR("/api/getUserDetails", fetcher);
  const { trigger, isMutating } = useSWRMutation(
    "/api/setUserData",
    updateUserDetails
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TEmployeeDetails>({
    resolver: zodResolver(EmployeeDetailsSchema),
  });

  useEffect(() => {
    if (data) {
      const fields: Array<
        "username" | "email" | "contact" | "address" | "reportingManager"
      > = ["username", "email", "contact", "address", "reportingManager"];
      fields.forEach((field) => setValue(field, data[field]));
    }
  }, [data, setValue]);

  if (!session || !session.user) {
    return null;
  }

  const onSubmit: SubmitHandler<TEmployeeDetails> = async (formData) => {
    const response = await trigger({ formData, empNo: data.userData["empNo"] });
    if (response.ok) {
      toast("Successfully updated user data!");
    } else {
      const errors = response?.message?.errors?.map(
        (error: any) => error.message
      );
      toast(errors?.join(","));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 place-content-center gap-6 w-[900px] p-6"
    >
      <div className="col-span-2">
        <Avatar>
          <AvatarImage src={session.user.image || ""} />
          <AvatarFallback>{session.user.username?.[0] || "U"}</AvatarFallback>
        </Avatar>
      </div>
      {/* Form Fields */}
      <LabelInputErrorPair
        label="Name"
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
        label="Phone no."
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
      <LabelInputErrorPair
        label="Reporting Manager"
        id="reportingManager"
        error={errors.reportingManager}
        register={register}
      />

      {/* Submit Button */}
      <div className="col-span-2">
        <Button type="submit" disabled={isMutating}>
          Submit
        </Button>
      </div>
    </form>
  );
}

interface LabelInputErrorPairProps {
  label: string;
  id: keyof TEmployeeDetails;
  error?: FieldError;
  register: ReturnType<typeof useForm<TEmployeeDetails>>["register"];
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

export default EmployeeDetails;
