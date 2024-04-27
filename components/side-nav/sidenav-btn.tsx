import { Button } from "../ui/button";

interface BtnVariant {
  variant:
    | "default"
    | "ghost"
    | "destructive"
    | "outline"
    | "secondary"
    | "link"
    | null
    | undefined;
}

export default function SidenavBtn({
  children,
  active,
}: {
  children: React.ReactNode;
  active: Boolean;
}) {
  let btnVariant: BtnVariant = active
    ? { variant: "default" }
    : { variant: "ghost" };
  return (
    <Button variant={btnVariant.variant} className="justify-start gap-2 flex">
      {children}
    </Button>
  );
}
