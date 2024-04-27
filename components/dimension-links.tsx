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

interface Dimension {
  empName: string;
  empNo: string;
  createdAt: string;
  dimension: string;
  dimensionId: string; // Assuming a unique ID for each dimension
}

const fetcher = async (url: string): Promise<Dimension[]> => {
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

const createDimension = async (
  url: string,
  { arg }: { arg: { dimension: string; leadNo: string } }
) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res);
};

export default function DimensionLinks({ leadNo }: { leadNo: string }) {
  const [link, setLink] = useState("");
  const {
    data: dimensions,
    isLoading,
    error,
  } = useSWR("/api/getDimension?leadNo=" + leadNo, fetcher); // Updated API endpoint
  const { trigger, isMutating } = useSWRMutation(
    "/api/addNewDimension", // Updated API endpoint
    createDimension
  );

  async function handleAddDimension() {
    if (!link.trim()) return;
    try {
      const res = await trigger({
        leadNo: leadNo,
        dimension: link,
      });
      if (res.ok) {
        toast.success("Dimension added!");
        mutate("/api/getDimension?leadNo=" + leadNo);
        setLink("");
      } else {
        throw res.json();
      }
    } catch (error) {
      toast.error("Failed to add dimension!!");
    }
  }

  let render;
  if (dimensions && dimensions.length > 0) {
    render = dimensions.map((dimension: Dimension, i: number) => (
      <div
        className={
          "flex gap-2 p-2 " + (i == dimensions.length - 1 ? "" : " border-b")
        }
        key={dimension.dimensionId}
      >
        <div className="w-36 text-nowrap text-muted-foreground">
          <div className="grid h-min">
            <p className="truncate">{dimension.empName}</p>
            <p className="text-xs">{formatDate(dimension.createdAt, "PPp")}</p>
          </div>
        </div>
        <Link className="flex-1" href={dimension.dimension} target="_blank">
          {dimension.dimension}
        </Link>
      </div>
    ));
  } else {
    render = <p className="text-muted-foreground">No dimensions yet</p>;
  }

  return (
    <>
      <div className="grid gap-2 col-span-2">
        <Label>Add Dimension Link</Label>
        <Input
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
          }}
          placeholder="dimension link"
        />
      </div>
      <div className="grid gap-2 col-span-2">
        <Button
          disabled={isMutating}
          onClick={handleAddDimension}
          className="w-fit"
          type="button"
          variant={"secondary"}
        >
          Add Dimension
        </Button>
      </div>
      <div className="grid gap-2 col-span-2">
        <Label>Dimensions List</Label>
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
