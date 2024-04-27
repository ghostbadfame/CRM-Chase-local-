import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeData = {
  engineer: ["engineer 1", "engineer 2", "engineer 3"],
  designer: ["designer 1", "designer 2", "designer 3"],
};

function SelectEmployee() {
  let options;

  for (var department in EmployeeData) {
    console.log(department);
  }

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Employee" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="d1">Engineer</SelectItem>
        <SelectItem value="d2">Designer</SelectItem>
        <SelectItem value="d3">Telecaller</SelectItem>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Digital</SelectLabel>
          <SelectItem value="d4">Source 4</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectEmployee;
