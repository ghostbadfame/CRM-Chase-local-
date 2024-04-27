import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardCard({
  title,
  desc,
  progress,
  textColor,
  href,
}: {
  title: string;
  desc: string;
  progress: number;
  textColor?: string;
  href: string;
}) {
  return (
    <Link href={href} className="md:w-[180px] flex-1">
      <Card className={cn("text-center", textColor)}>
        <CardHeader>
          <CardTitle className="md:text-lg text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="w-full font-bold md:text-5xl text-4xl">
          {progress}
        </CardContent>
      </Card>
    </Link>
  );
}
