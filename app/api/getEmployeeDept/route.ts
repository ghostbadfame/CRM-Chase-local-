import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dept = searchParams.get("dept");
    if (!dept) {
      return NextResponse.error();
    } else {
      const Done = await db.user.findMany({
        where: {
          userType: dept!!,
          NOT:[{password:"1234"}]
        },
        select: {
          empNo: true,
          username: true,
          _count: {
            select: {
              leads: {
                where: {
                  NOT:[
                    {
                      clientStatus:"Lost"
                    }
                  ],
                  status: "done",
                },
              },
            },
          },
        },
      });
      const Pending = await db.user.findMany({
        where: {
          userType: dept!!,NOT:{password:"1234"}
        },
        select: {
          empNo: true,
          username: true,
          _count: {
            select: {
              leads: {
                where: {
                  NOT:[
                    {
                      clientStatus:"Lost"
                    }
                  ],
                  status: "pending",
                },
              },
            },
          },
        },
      });

      const doneMap = new Map(Done.map((item) => [item.empNo, item]));
      const combinedData = Pending.map((pendingItem) => {
        const doneItem = doneMap.get(pendingItem.empNo);
        if (doneItem) {
          const pendingCount = pendingItem._count?.leads ?? 0;
          const doneCount = doneItem._count?.leads ?? 0;
          return {
            empNo: pendingItem.empNo,
            username: pendingItem.username,
            pending: pendingCount,
            done: doneCount,
            assigned: pendingCount + doneCount,
          };
        } else {
          return {
            empNo: pendingItem.empNo,
            username: pendingItem.username,
            pending: pendingItem._count?.leads ?? 0,
            done: 0,
            assigned: pendingItem._count?.leads ?? 0,
          };
        }
      });
      return NextResponse.json(
        {
          data: combinedData,
          message: " Fetched Successfully ",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
