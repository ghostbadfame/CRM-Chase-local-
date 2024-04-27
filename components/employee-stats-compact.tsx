import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

interface EmpData {
  empNo: string;
  username: string;
  assigned: number;
  done: number;
  pending: number;
}

function CompactEmployeeStats({
  title,
  desc,
  data,
}: {
  title: string;
  desc: string;
  data: Array<EmpData>;
}) {
  return (
    <div className="border rounded-md p-2 w-full grid gap-2">
      <h1 className="px-2">{title}</h1>
      <div className="border whitespace-nowrap rounded-md py-2 w-full overflow-x-auto">
        <Table>
          <TableCaption className="text-left px-2">{desc}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Emp. ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Done</TableHead>
              <TableHead>Pending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map(({ empNo, username, assigned, done, pending }) => {
                return (
                  <TableRow key={empNo}>
                    <TableCell className="font-medium">
                      <Link href={`/employee/${empNo}`}>{empNo}</Link>
                    </TableCell>
                    <TableCell>{username}</TableCell>
                    <TableCell>{assigned}</TableCell>
                    <TableCell className="text-green-500">{done}</TableCell>
                    <TableCell className="text-red-500">{pending}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="w-full text-nowrap grid place-content-center p-2">
                no employees found!!
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CompactEmployeeStats;
