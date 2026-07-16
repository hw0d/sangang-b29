"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify } from "@/lib/utils";
import type { GroupStatus, LinkType, ProfileStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

async function storeImageIfProvided(
  formData: FormData,
  field: string
): Promise<string | undefined> {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) return undefined;
  const buffer = Buffer.from(await file.arrayBuffer());
  const image = await prisma.image.create({
    data: { data: buffer, mimeType: file.type || "application/octet-stream" },
  });
  return image.id;
}

function str(formData: FormData, field: string): string | null {
  const v = formData.get(field);
  if (typeof v !== "string" || v.trim() === "") return null;
  return v.trim();
}

function int(formData: FormData, field: string): number | null {
  const v = str(formData, field);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

async function uniqueGroupSlug(name: string): Promise<string> {
  const base = slugify(name) || "group";
  let slug = base;
  let n = 2;
  while (await prisma.group.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

// ---------------------------------------------------------------- Groups --

export async function createGroup(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  if (!name) throw new Error("Group name is required");

  const symbolImageId = await storeImageIfProvided(formData, "symbolImage");
  const slug = await uniqueGroupSlug(name);

  const group = await prisma.group.create({
    data: {
      name,
      slug,
      aliases: str(formData, "aliases"),
      description: str(formData, "description"),
      territory: str(formData, "territory"),
      colors: str(formData, "colors"),
      status: (str(formData, "status") as GroupStatus) ?? "ACTIVE",
      symbolImageId,
    },
  });

  revalidatePath("/admin/groups");
  revalidatePath("/groups");
  redirect(`/admin/groups/${group.id}/edit`);
}

export async function updateGroup(id: string, formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name");
  if (!name) throw new Error("Group name is required");

  const symbolImageId = await storeImageIfProvided(formData, "symbolImage");

  const group = await prisma.group.update({
    where: { id },
    data: {
      name,
      aliases: str(formData, "aliases"),
      description: str(formData, "description"),
      territory: str(formData, "territory"),
      colors: str(formData, "colors"),
      status: (str(formData, "status") as GroupStatus) ?? "ACTIVE",
      ...(symbolImageId ? { symbolImageId } : {}),
    },
  });

  revalidatePath("/admin/groups");
  revalidatePath("/groups");
  revalidatePath(`/groups/${group.slug}`);
  redirect("/admin/groups");
}

export async function deleteGroup(id: string) {
  await requireAdmin();
  await prisma.group.delete({ where: { id } });
  revalidatePath("/admin/groups");
  revalidatePath("/groups");
}

// -------------------------------------------------------------- Profiles --

export async function createProfile(formData: FormData) {
  await requireAdmin();
  const fullName = str(formData, "fullName");
  if (!fullName) throw new Error("Full name is required");

  const mugshotImageId = await storeImageIfProvided(formData, "mugshotImage");
  const dobStr = str(formData, "dob");

  const profile = await prisma.profile.create({
    data: {
      fullName,
      alias: str(formData, "alias"),
      status: (str(formData, "status") as ProfileStatus) ?? "UNKNOWN",
      dob: dobStr ? new Date(dobStr) : null,
      heightCm: int(formData, "heightCm"),
      weightKg: int(formData, "weightKg"),
      eyeColor: str(formData, "eyeColor"),
      hairColor: str(formData, "hairColor"),
      description: str(formData, "description"),
      notes: str(formData, "notes"),
      rank: str(formData, "rank"),
      groupId: str(formData, "groupId"),
      mugshotImageId,
    },
  });

  revalidatePath("/admin/profiles");
  revalidatePath("/profiles");
  redirect(`/admin/profiles/${profile.id}/edit`);
}

export async function updateProfile(id: string, formData: FormData) {
  await requireAdmin();
  const fullName = str(formData, "fullName");
  if (!fullName) throw new Error("Full name is required");

  const mugshotImageId = await storeImageIfProvided(formData, "mugshotImage");
  const dobStr = str(formData, "dob");

  await prisma.profile.update({
    where: { id },
    data: {
      fullName,
      alias: str(formData, "alias"),
      status: (str(formData, "status") as ProfileStatus) ?? "UNKNOWN",
      dob: dobStr ? new Date(dobStr) : null,
      heightCm: int(formData, "heightCm"),
      weightKg: int(formData, "weightKg"),
      eyeColor: str(formData, "eyeColor"),
      hairColor: str(formData, "hairColor"),
      description: str(formData, "description"),
      notes: str(formData, "notes"),
      rank: str(formData, "rank"),
      groupId: str(formData, "groupId"),
      ...(mugshotImageId ? { mugshotImageId } : {}),
    },
  });

  revalidatePath("/admin/profiles");
  revalidatePath("/profiles");
  revalidatePath(`/profiles/${id}`);
  redirect("/admin/profiles");
}

export async function deleteProfile(id: string) {
  await requireAdmin();
  await prisma.profile.delete({ where: { id } });
  revalidatePath("/admin/profiles");
  revalidatePath("/profiles");
}

// --------------------------------------------------------------- Tattoos --

export async function addTattoo(profileId: string, formData: FormData) {
  await requireAdmin();
  const imageId = await storeImageIfProvided(formData, "image");

  await prisma.tattoo.create({
    data: {
      profileId,
      imageId,
      bodyLocation: str(formData, "bodyLocation"),
      meaning: str(formData, "meaning"),
    },
  });

  revalidatePath(`/admin/profiles/${profileId}/edit`);
  revalidatePath(`/profiles/${profileId}`);
}

export async function deleteTattoo(id: string, profileId: string) {
  await requireAdmin();
  await prisma.tattoo.delete({ where: { id } });
  revalidatePath(`/admin/profiles/${profileId}/edit`);
  revalidatePath(`/profiles/${profileId}`);
}

// -------------------------------------------------------- Affiliate links --

export async function addAffiliateLink(
  fromProfileId: string,
  formData: FormData
) {
  await requireAdmin();
  const toProfileId = str(formData, "toProfileId");
  if (!toProfileId || toProfileId === fromProfileId) {
    throw new Error("Select a different profile to link");
  }
  const type = (str(formData, "type") as LinkType) ?? "ASSOCIATE";
  const note = str(formData, "note");

  await prisma.profileLink.upsert({
    where: {
      fromProfileId_toProfileId: { fromProfileId, toProfileId },
    },
    update: { type, note },
    create: { fromProfileId, toProfileId, type, note },
  });

  revalidatePath(`/admin/profiles/${fromProfileId}/edit`);
  revalidatePath(`/profiles/${fromProfileId}`);
  revalidatePath(`/profiles/${toProfileId}`);
}

export async function deleteAffiliateLink(id: string, fromProfileId: string) {
  await requireAdmin();
  const link = await prisma.profileLink.delete({ where: { id } });
  revalidatePath(`/admin/profiles/${fromProfileId}/edit`);
  revalidatePath(`/profiles/${link.fromProfileId}`);
  revalidatePath(`/profiles/${link.toProfileId}`);
}
