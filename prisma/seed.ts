import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const categories = [
  {
    slug: "general",
    name: "General",
    description: "Obrolan harian, event, dan kabar komunitas SKIA.",
    accent: "#18b6a7",
    icon: "sparkles",
    order: 1,
  },
  {
    slug: "guide-build",
    name: "Guide & Build",
    description: "Rute upgrade, komposisi tim, farming, dan prioritas hero.",
    accent: "#d99a22",
    icon: "book-open",
    order: 2,
  },
  {
    slug: "question-help",
    name: "Tanya Jawab",
    description: "Tempat minta bantuan saat stuck stage, boss, atau resource.",
    accent: "#7d63ff",
    icon: "circle-help",
    order: 3,
  },
  {
    slug: "guild-party",
    name: "Guild & Party",
    description: "Rekrutmen guild, cari teman, dan koordinasi raid.",
    accent: "#2aa866",
    icon: "shield",
    order: 4,
  },
  {
    slug: "patch-news",
    name: "Patch & News",
    description: "Catatan update, banner, event, dan perubahan meta.",
    accent: "#e56d4f",
    icon: "newspaper",
    order: 5,
  },
];

const sampleUsers = [
  {
    email: "aria@skia.local",
    name: "Aria Idle",
    image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Aria",
  },
  {
    email: "rudy@skia.local",
    name: "Rudy Raid",
    image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Rudy",
  },
  {
    email: "nina@skia.local",
    name: "Nina Meta",
    image: "https://api.dicebear.com/8.x/adventurer/svg?seed=Nina",
  },
];

const posts = [
  {
    slug: "prioritas-awal-akun-baru",
    title: "Prioritas awal untuk akun baru: apa yang harus dinaikkan dulu?",
    body: "Aku baru mulai main dan merasa resource cepat habis. Urutan aman yang biasa kupakai: fokus ke push stage, buka fitur harian secepatnya, lalu simpan material premium untuk banner yang benar-benar menaikkan progress. Untuk gear, jangan terlalu cepat menyebar upgrade ke semua hero. Lebih enak punya satu core team yang stabil dulu.",
    type: "GUIDE" as const,
    categorySlug: "guide-build",
    authorEmail: "aria@skia.local",
    tags: ["newbie", "progress", "resource"],
    pinned: true,
    featured: true,
  },
  {
    slug: "diskusi-tim-idle-farming-yang-stabil",
    title: "Diskusi tim idle farming yang stabil buat stage menengah",
    body: "Share komposisi kalian dong. Aku lagi coba kombinasi damage dealer jarak jauh, support buff, dan satu frontliner tebal. Rasanya lebih konsisten dibanding mengejar burst doang, terutama saat offline reward jadi fokus utama.",
    type: "DISCUSSION" as const,
    categorySlug: "general",
    authorEmail: "rudy@skia.local",
    tags: ["farming", "team-comp"],
    pinned: false,
    featured: false,
  },
  {
    slug: "cara-baca-patch-note-tanpa-panik-meta",
    title: "Cara baca patch note tanpa langsung panik soal meta",
    body: "Biasanya aku cek tiga hal: perubahan skill yang memengaruhi role utama, event resource yang paling efisien, dan apakah banner baru mengubah kebutuhan akun sendiri. Tidak semua update berarti harus ganti tim. Kadang cukup adjust satu slot.",
    type: "NEWS" as const,
    categorySlug: "patch-news",
    authorEmail: "nina@skia.local",
    tags: ["patch", "meta"],
    pinned: false,
    featured: true,
  },
  {
    slug: "stuck-boss-stage-butuh-saran",
    title: "Stuck boss stage, butuh saran rotasi dan upgrade",
    body: "Damage sudah lumayan tapi boss masih menyisakan HP tipis. Menurut kalian lebih worth upgrade support buff, naikkan gear damage dealer, atau cari hero control? Aku pengin keputusan yang tidak boros resource.",
    type: "QUESTION" as const,
    categorySlug: "question-help",
    authorEmail: "aria@skia.local",
    tags: ["boss", "help"],
    pinned: false,
    featured: false,
  },
  {
    slug: "rekrutmen-guild-santai-aktif-malam",
    title: "Rekrutmen guild santai, aktif malam WIB",
    body: "Guild kecil kami cari member yang aktif daily, tidak wajib push hardcore. Fokusnya ngobrol, saling bantu baca event, dan kompak untuk konten guild. Drop nama akun dan jam aktif kalau berminat.",
    type: "RECRUITMENT" as const,
    categorySlug: "guild-party",
    authorEmail: "rudy@skia.local",
    tags: ["guild", "wib"],
    pinned: false,
    featured: false,
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const user of sampleUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  for (const post of posts) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: post.categorySlug },
    });
    const author = await prisma.user.findUniqueOrThrow({
      where: { email: post.authorEmail },
    });

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        body: post.body,
        type: post.type,
        pinned: post.pinned,
        featured: post.featured,
        categoryId: category.id,
        authorId: author.id,
      },
      create: {
        slug: post.slug,
        title: post.title,
        body: post.body,
        type: post.type,
        pinned: post.pinned,
        featured: post.featured,
        categoryId: category.id,
        authorId: author.id,
        postTags: {
          create: post.tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { slug: tagName },
                create: {
                  slug: tagName,
                  name: tagName,
                },
              },
            },
          })),
        },
      },
    });
  }

  const seededPost = await prisma.post.findUniqueOrThrow({
    where: { slug: "prioritas-awal-akun-baru" },
  });
  const commenter = await prisma.user.findUniqueOrThrow({
    where: { email: "nina@skia.local" },
  });

  const existingComment = await prisma.comment.findFirst({
    where: {
      postId: seededPost.id,
      authorId: commenter.id,
    },
  });

  if (!existingComment) {
    await prisma.comment.create({
      data: {
        postId: seededPost.id,
        authorId: commenter.id,
        body: "Setuju soal jangan sebar upgrade. Aku biasanya bikin catatan resource mingguan biar tidak impulsif saat banner baru muncul.",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
