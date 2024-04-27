import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerDetails from "../profile/customerDetails";

function CustomerDashboard() {
  return (
    <Tabs defaultValue="userDetails" className="w-full min-h-[80vh] relative">
      <TabsList>
        <TabsTrigger value="userDetails">User Details</TabsTrigger>
      </TabsList>
      <TabsContent value="userDetails">
        <CustomerDetails />
      </TabsContent>
    </Tabs>
  );
}

export default CustomerDashboard;
