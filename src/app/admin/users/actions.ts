"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/adminAuth";
import { notifyDataChanged } from "@/lib/eventBus";
import type { AdminRole, StaffPosition } from "@prisma/client";

function str(formData: FormData, field: string): string | null {
  const v = formData.get(field);
  if (typeof v !== "string" || v.trim() === "") return null;
  return v.trim();
}

export async function createAdminUser(formData: FormData) {
  await requireAdminRole();

  const username = str(formData, "username");
  const password = str(formData, "password");
  if (!username) throw new Error("Username is required");
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) throw new Error("That username is already taken");

  const passwordHash = await bcrypt.hash(password, 12);
  const role = (str(formData, "role") as AdminRole) ?? "EDITOR";
  const position = str(formData, "position") as StaffPosition | null;

  await prisma.adminUser.create({
    data: { username, passwordHash, role, position },
  });

  revalidatePath("/admin/users");
  notifyDataChanged();
  redirect("/admin/users");
}

export async function updateAdminUser(id: string, formData: FormData) {
  await requireAdminRole();

  const role = (str(formData, "role") as AdminRole) ?? "EDITOR";
  const position = str(formData, "position") as StaffPosition | null;
  const password = str(formData, "password");

  await prisma.adminUser.update({
    where: { id },
    data: {
      role,
      position,
      ...(password && password.length >= 6
        ? { passwordHash: await bcrypt.hash(password, 12) }
        : {}),
    },
  });

  revalidatePath("/admin/users");
  notifyDataChanged();
  redirect("/admin/users");
}

export async function deleteAdminUser(id: string) {
  const session = await requireAdminRole();

  if (session.user.id === id) {
    throw new Error("You can't delete your own account while signed in as it.");
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (target?.role === "ADMIN") {
    const remainingAdmins = await prisma.adminUser.count({
      where: { role: "ADMIN", id: { not: id } },
    });
    if (remainingAdmins === 0) {
      throw new Error("Can't delete the last admin account.");
    }
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");
  notifyDataChanged();
}
