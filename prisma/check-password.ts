import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { createInterface } from "node:readline/promises";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ADMIN_EMAIL or ADMIN_PASSWORD is missing.");
    return;
  }

  const admin = await db.adminUser.findUnique({ where: { email } });

  if (!admin) {
    console.log("Admin record not found.");
    return;
  }

  console.log(
    "Password in .env matches database hash:",
    await compare(password, admin.passwordHash)
  );

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const enteredPassword = await rl.question("Enter the password you use on the website: ");
  rl.close();

  console.log(
    "Website password matches database hash:",
    await compare(enteredPassword, admin.passwordHash)
  );
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
