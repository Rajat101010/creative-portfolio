import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  console.log("ADMIN_EMAIL configured:", Boolean(email));
  console.log("AUTH_SECRET configured:", Boolean(process.env.AUTH_SECRET));

  const admins = await db.adminUser.findMany({
    select: { email: true, createdAt: true },
  });

  console.log("Database admin records:", admins);

  if (email) {
    const admin = await db.adminUser.findUnique({ where: { email } });
    console.log("Matching configured email:", Boolean(admin));
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
