import { DataTable } from "../ui/data-table";
import { marketingEmpTableCol } from "./marketingEmpTableCol";

function MarketingEmployeeTable({ data, desc }: { data: any; desc: string }) {
  return (
    <DataTable
      columns={marketingEmpTableCol}
      data={data}
      caption={desc}
      noFilters={true}
    />
  );
}

export default MarketingEmployeeTable;
