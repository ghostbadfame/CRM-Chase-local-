import { Icons } from "./icons";

export default function Loading() {
  return (
    <div className="flex justify-center items-center">
      {<Icons.spinner className="animate-spin" />}
    </div>
  );
}
