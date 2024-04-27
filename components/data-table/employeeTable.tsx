import { DataTable } from "../ui/data-table";
import { employeeTableCol } from "./employeeTableCol";

function EmployeeTable({ data, desc }: { data: any; desc: string }) {
  return (
    <DataTable
      columns={employeeTableCol}
      data={data}
      caption={desc}
      noFilters={true}
    />
  );
}

export default EmployeeTable;
