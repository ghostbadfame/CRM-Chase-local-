import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch
    const email = session?.user.email;

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }
    const telecallerDone = await db.user.findMany({
      where: {
        userType: "telecaller",
        NOT: [{ password: "1234" }],
      },
      select: {
        empNo: true,
        username: true,
        _count: {
          select: {
            leads: {
              where: {    NOT:[
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
    const telecallerPending = await db.user.findMany({
      where: {
        userType: "telecaller",
        NOT: [{ password: "1234" }],
      },
      select: {
        empNo: true,
        username: true,
        _count: {
          select: {
            leads: {
              where: {    NOT:[
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

    const engineerDone = await db.user.findMany({
      where: {
        userType: "engineer",
        NOT: [{ password: "1234" }],
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
    const engineerPending = await db.user.findMany({
      where: {
        userType: "engineer",
        NOT: [{ password: "1234" }],
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

    const designerDone = await db.user.findMany({
      where: {
        userType: "designer",
        NOT: [{ password: "1234" }],
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
    const designerPending = await db.user.findMany({
      where: {
        userType: "designer",
        NOT: [{ password: "1234" }],
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

    const technicianDone = await db.user.findMany({
      where: {
        userType: "technician",
        NOT: [{ password: "1234" }],
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
    const technicianPending = await db.user.findMany({
      where: {
        userType: "technician",
        NOT: [{ password: "1234" }],
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

    const managerDone = await db.user.findMany({
      where: {
        userType: "manager",
        NOT: [{ password: "1234" }],
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
    const managerPending = await db.user.findMany({
      where: {
        userType: "manager",
        NOT: [{ password: "1234" }],
      },
      select: {
        empNo: true,
        username: true,
        _count: {
          select: {
            leads: {
              where: {    NOT:[
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

    const doneMap = new Map(telecallerDone.map((item) => [item.empNo, item]));
    const combinedTelecallerData = telecallerPending.map((pendingItem) => {
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

    const technicianMap = new Map(
      technicianDone.map((item) => [item.empNo, item])
    );
    const combinedTechnicianData = technicianPending.map((pendingItem) => {
      const doneItem = technicianMap.get(pendingItem.empNo);
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

    const engineerMap = new Map(engineerDone.map((item) => [item.empNo, item]));
    const combinedEngineerData = engineerPending.map((pendingItem) => {
      const doneItem = engineerMap.get(pendingItem.empNo);
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

    const doneMapDesigner = new Map(
      designerDone.map((item) => [item.empNo, item])
    );
    const combinedDesignerData = designerPending.map((pendingItem) => {
      const doneItem = doneMapDesigner.get(pendingItem.empNo);
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

    const doneMapManager = new Map(
      managerDone.map((item) => [item.empNo, item])
    );
    const combinedManagerData = managerPending.map((pendingItem) => {
      const doneItem = doneMapManager.get(pendingItem.empNo);
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
        combinedTelecallerData,
        combinedTechnicianData,
        combinedEngineerData,
        combinedDesignerData,
        combinedManagerData,
        message: "Data Fetched Successfully ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
