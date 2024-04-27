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
import { SOURCE_TYPES, SOURCE_TYPES_DIGITAL } from "@/lib/utils";

function SelectLeadSource({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Lead Source" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SOURCE_TYPES).map((value, i) => {
          return (
            <SelectItem value={value[0]} key={value[0]}>
              {value[1]}
            </SelectItem>
          );
        })}

        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Digital Marketing</SelectLabel>
          {Object.entries(SOURCE_TYPES_DIGITAL).map((value, i) => {
            return (
              <SelectItem value={value[0]} key={value[0]}>
                {value[1]}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectLeadSource;
