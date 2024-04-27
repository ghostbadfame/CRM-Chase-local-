"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "date-fns";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import Loading from "./loading";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

interface Design {
  empName: string;
  empNo: string;
  createdAt: string;
  design: string;
  designId: string;
}

const fetcher = async (url: string): Promise<Design[]> => {
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

const createDesign = async (
  url: string,
  { arg }: { arg: { design: string; leadNo: string } }
) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
};

export default function DesignLinks({ leadNo }: { leadNo: string }) {
  const [link, setLink] = useState("");
  const {
    data: designs,
    isLoading,
    error,
  } = useSWR("/api/getDesignLink?leadNo=" + leadNo, fetcher);
  const { trigger, isMutating } = useSWRMutation(
    "/api/addNewdesigns",
    createDesign
  );

  async function handleAddDesign() {
    if (!link.trim()) return;
    try {
      const res = await trigger({
        leadNo: leadNo,
        design: link,
      });
      toast.success("design added!");
      mutate("/api/getDesignLink?leadNo=" + leadNo);
      setLink("");
    } catch (error) {
      toast.error("failed to add design!!");
    }
  }

  let render;
  if (designs && designs.length > 0) {
    render = designs?.map((design: Design, i: number) => (
      <div
        className={
          "flex gap-2 p-2 " + (i == designs.length - 1 ? "" : " border-b")
        }
        key={design.designId}
      >
        <div className="w-36 text-nowrap text-muted-foreground">
          <div className="grid h-min">
            <p className="truncate">{design.empName}</p>
            <p className="text-xs">{formatDate(design.createdAt, "PPp")}</p>
          </div>
        </div>
        <Link className="flex-1" href={design.design} target="_blank">
          {design.design}
        </Link>
      </div>
    ));
  } else render = <p className="text-muted-foreground">No designs yet</p>;

  return (
    <>
      <div className="grid gap-2 col-span-2">
        <Label>Add design link</Label>
        <Input
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
          }}
          placeholder="design link"
        />
      </div>
      <div className="grid gap-2 col-span-2">
        <Button
          disabled={isMutating}
          onClick={handleAddDesign}
          className="w-fit"
          type="button"
          variant={"secondary"}
        >
          Add Design
        </Button>
      </div>
      <div className="grid gap-2 col-span-2">
        <Label>Designs list</Label>
        <ScrollArea className="border gap-2 max-h-[30vh] grid p-2 rounded-md text-sm font-medium">
          {isLoading ? (
            <div className="grid gap-2 col-span-2">
              <Loading />
            </div>
          ) : (
            render
          )}
        </ScrollArea>
      </div>
    </>
  );
}
