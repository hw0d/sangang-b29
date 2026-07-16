import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { makeAvatarPng, makeMarkingPng } from "./png";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Seed images are generated PNG placeholders (never real photos), so seed
// data never depends on, or resembles, any real person's likeness.
async function createImage(png: Buffer) {
  const image = await prisma.image.create({
    data: { data: new Uint8Array(png), mimeType: "image/png" },
  });
  return image.id;
}

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-before-seeding";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash, role: "ADMIN" },
    create: { username, passwordHash, role: "ADMIN" },
  });
  console.log(`Admin user ready: ${username}`);

  // --- Groups (all fictional) ---------------------------------------------
  const groupDefs = [
    {
      name: "Crimson Serpents",
      aliases: "The Serpents",
      description:
        "A fictional street crew said to control the docklands smuggling trade in this setting's Old Port district. Known for a coiled-serpent hand sign and crimson bandanas.",
      territory: "Old Port / Dockside Row (fictional)",
      colors: "Crimson red, black",
      status: "ACTIVE" as const,
      hue: 350,
    },
    {
      name: "Iron Vultures MC",
      aliases: "The Vultures",
      description:
        "A fictional outlaw motorcycle club roleplay faction based out of the industrial district. Associated with vehicle theft storylines and turf disputes with the Serpents.",
      territory: "Industrial Quarter (fictional)",
      colors: "Black, gunmetal grey",
      status: "ACTIVE" as const,
      hue: 210,
    },
    {
      name: "Nightshade Crew",
      aliases: "Shade",
      description:
        "A fictional, loosely organized crew tied to in-character narcotics storylines. Mostly disbanded after an in-universe police operation two seasons ago.",
      territory: "Formerly Southbank Estates (fictional)",
      colors: "Purple, silver",
      status: "DISBANDED" as const,
      hue: 270,
    },
  ];

  const groups: Record<string, string> = {};
  for (const g of groupDefs) {
    const symbolImageId = await createImage(makeAvatarPng(g.hue));
    const group = await prisma.group.upsert({
      where: { slug: slugify(g.name) },
      update: {},
      create: {
        name: g.name,
        slug: slugify(g.name),
        aliases: g.aliases,
        description: g.description,
        territory: g.territory,
        colors: g.colors,
        status: g.status,
        symbolImageId,
      },
    });
    groups[g.name] = group.id;
  }
  console.log(`Seeded ${groupDefs.length} fictional groups`);

  // --- Profiles (all fictional characters) --------------------------------
  const profileDefs = [
    {
      fullName: "Marcus \"Rook\" Delaney",
      alias: "Rook",
      status: "AT_LARGE" as const,
      group: "Crimson Serpents",
      rank: "Lieutenant",
      heightCm: 183,
      weightKg: 86,
      eyeColor: "Brown",
      hairColor: "Black",
      description:
        "Fictional character. Said in-story to run the Serpents' Old Port smuggling routes.",
      notes: "Roleplay flag: wanted for in-character warehouse arson plot.",
      hue: 350,
      tattoos: [
        { bodyLocation: "Right forearm", meaning: "Coiled serpent — full Serpents membership mark" },
      ],
    },
    {
      fullName: "Elena \"Domino\" Cruz",
      alias: "Domino",
      status: "IN_CUSTODY" as const,
      group: "Crimson Serpents",
      rank: "Member",
      heightCm: 168,
      weightKg: 61,
      eyeColor: "Green",
      hairColor: "Auburn",
      description: "Fictional character. In-story getaway driver for the Serpents.",
      notes: "Roleplay flag: currently in in-character holding after a scripted traffic stop.",
      hue: 350,
      tattoos: [
        { bodyLocation: "Left wrist", meaning: "Card suit — crew recruit marker" },
      ],
    },
    {
      fullName: "Gideon \"Ghost\" Okafor",
      alias: "Ghost",
      status: "AT_LARGE" as const,
      group: "Iron Vultures MC",
      rank: "Road Captain",
      heightCm: 190,
      weightKg: 95,
      eyeColor: "Grey",
      hairColor: "Bald",
      description: "Fictional character. In-story enforcer for the Vultures MC.",
      notes: "Roleplay flag: linked in-character to a chop-shop storyline.",
      hue: 210,
      tattoos: [
        { bodyLocation: "Back, full", meaning: "Vulture-in-flight — club back patch mirror tattoo" },
        { bodyLocation: "Neck", meaning: "Founding-chapter roman numeral" },
      ],
    },
    {
      fullName: "Priya \"Marbles\" Anand",
      alias: "Marbles",
      status: "ON_PROBATION" as const,
      group: "Iron Vultures MC",
      rank: "Prospect",
      heightCm: 172,
      weightKg: 64,
      eyeColor: "Hazel",
      hairColor: "Brown",
      description: "Fictional character. Newest in-story prospect for the Vultures.",
      notes: null,
      hue: 210,
      tattoos: [],
    },
    {
      fullName: "Victor \"Salt\" Reyes",
      alias: "Salt",
      status: "DECEASED" as const,
      group: "Nightshade Crew",
      rank: "Former leader",
      heightCm: 178,
      weightKg: 79,
      eyeColor: "Brown",
      hairColor: "Grey",
      description:
        "Fictional character. In-story former head of the now-disbanded Nightshade Crew.",
      notes: "Roleplay flag: character retired from the server storyline.",
      hue: 270,
      tattoos: [
        { bodyLocation: "Chest", meaning: "Four-point star — leadership marker" },
      ],
    },
    {
      fullName: "Talia \"Shade\" Novak",
      alias: "Shade",
      status: "UNKNOWN" as const,
      group: "Nightshade Crew",
      rank: "Member",
      heightCm: 165,
      weightKg: 58,
      eyeColor: "Blue",
      hairColor: "Black",
      description: "Fictional character. Whereabouts unknown in the current storyline.",
      notes: null,
      hue: 270,
      tattoos: [],
    },
    {
      fullName: "Owen \"Domino's Cousin\" Blake",
      alias: "Blake",
      status: "UNKNOWN" as const,
      group: null,
      rank: null,
      heightCm: 175,
      weightKg: 70,
      eyeColor: "Brown",
      hairColor: "Brown",
      description: "Fictional character, unaffiliated. Family tie to Elena Cruz in-story.",
      notes: null,
      hue: 40,
      tattoos: [],
    },
  ];

  const profileIds: Record<string, string> = {};
  for (const p of profileDefs) {
    const mugshotImageId = await createImage(makeAvatarPng(p.hue));
    const profile = await prisma.profile.create({
      data: {
        fullName: p.fullName,
        alias: p.alias,
        status: p.status,
        heightCm: p.heightCm,
        weightKg: p.weightKg,
        eyeColor: p.eyeColor,
        hairColor: p.hairColor,
        description: p.description,
        notes: p.notes,
        rank: p.rank,
        mugshotImageId,
        groupId: p.group ? groups[p.group] : null,
      },
    });
    profileIds[p.fullName] = profile.id;

    for (const t of p.tattoos) {
      const imageId = await createImage(makeMarkingPng(p.hue));
      await prisma.tattoo.create({
        data: {
          profileId: profile.id,
          imageId,
          bodyLocation: t.bodyLocation,
          meaning: t.meaning,
        },
      });
    }
  }
  console.log(`Seeded ${profileDefs.length} fictional profiles`);

  // --- Affiliate / rival / family links ------------------------------------
  const linkDefs: { from: string; to: string; type: "ASSOCIATE" | "RIVAL" | "FAMILY" | "SUBORDINATE_OF" | "LEADER_OF"; note?: string }[] = [
    { from: "Marcus \"Rook\" Delaney", to: "Elena \"Domino\" Cruz", type: "LEADER_OF", note: "In-story chain of command" },
    { from: "Elena \"Domino\" Cruz", to: "Owen \"Domino's Cousin\" Blake", type: "FAMILY", note: "In-story cousins" },
    { from: "Marcus \"Rook\" Delaney", to: "Gideon \"Ghost\" Okafor", type: "RIVAL", note: "In-story Old Port turf dispute" },
    { from: "Gideon \"Ghost\" Okafor", to: "Priya \"Marbles\" Anand", type: "LEADER_OF" },
    { from: "Victor \"Salt\" Reyes", to: "Talia \"Shade\" Novak", type: "ASSOCIATE", note: "Former crew ties" },
  ];

  for (const l of linkDefs) {
    await prisma.profileLink.upsert({
      where: {
        fromProfileId_toProfileId: {
          fromProfileId: profileIds[l.from],
          toProfileId: profileIds[l.to],
        },
      },
      update: {},
      create: {
        fromProfileId: profileIds[l.from],
        toProfileId: profileIds[l.to],
        type: l.type,
        note: l.note,
      },
    });
  }
  console.log(`Seeded ${linkDefs.length} affiliate links`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
