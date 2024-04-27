import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "date-fns";
import { Label } from "./ui/label";

interface Remark {
  empName: string;
  remark: string;
  createdAt: string;
  clientStatus: string;
  followUpDate: string;
}

export default function RemarksList({ remarks }: { remarks: Array<Remark> }) {
  return (
    <div className="grid gap-2 col-span-2">
      <Label>Remarks list</Label>
      <ScrollArea className="border gap-2 max-h-[50vh] grid p-2 rounded-md text-sm font-medium">
        {remarks.map((remark, i) => (
          <div
            className={
              "flex flex-col md:flex-row gap-2 p-2 " +
              (i == remarks.length - 1 ? "" : " border-b")
            }
            key={remark.createdAt.toString() + i}
          >
            <div className="w-44 text-muted-foreground">
              <div className="grid h-min gap-2">
                <p className="truncate">{remark.empName}</p>
                <p className="text-xs font-normal">
                  {formatDate(new Date(remark.createdAt), "PPp")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex-1">{remark.remark}</div>
              <div className="flex gap-2 text-muted-foreground">
                {remark.clientStatus && (
                  <Chip label="Status" data={remark.clientStatus} />
                )}
                {remark.followUpDate && (
                  <Chip
                    label="Followup"
                    data={formatDate(new Date(remark.followUpDate), "PP")}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

function Chip({ label, data }: { label: string; data: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-sm">{label}:</span>
      <span className="text-xs p-1 px-2 rounded-full bg-secondary max-w-36 w-fit truncate">
        {data}
      </span>
    </div>
  );
}
