import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "../ui/label";

function CustomerDetails() {
  return (
    <div className="grid grid-cols-2 place-content-center gap-6 w-[900px] py-6">
      <div className="col-span-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" placeholder="Username" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact">Phone no.</Label>
        <Input type="tel" id="contact" placeholder="Contact" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input type="text" id="address" placeholder="Address" />
      </div>
    </div>
  );
}

export default CustomerDetails;
