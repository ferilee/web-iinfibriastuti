export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  profileTitle: string;
  profileBody: string;
  profileBody2: string;
  visionTitle: string;
  visionBody: string;
  missionTitle: string;
  missionItems: string[];
  extraTitle: string;
  extraBody: string;
};

export const defaultHomeContent: HomeContent = {
  heroTitle: "Selamat Datang di Ruang Berbagi Iin Fibriastuti",
  heroSubtitle:
    "Membangun generasi cerdas, berkarakter, dan berdaya saing global melalui pendidikan yang inklusif dan inovatif di SMPN 2 Temanggung.",
  heroImageUrl: "/hero-rocket.svg",
  heroPrimaryLabel: "Baca Artikel Terbaru",
  heroPrimaryHref: "/blog",
  heroSecondaryLabel: "Hubungi Saya",
  heroSecondaryHref: "/contact",
  profileTitle: "Profil Singkat",
  profileBody:
    "Sebagai pendidik dan pemimpin, saya percaya bahwa setiap anak memiliki potensi luar biasa yang bisa dikembangkan. Dengan pengalaman puluhan tahun di dunia pendidikan, saya terus berinovasi untuk memberikan pengalaman belajar yang terbaik.",
  profileBody2:
    "Melalui website ini, saya berbagi pemikiran, pengalaman, dan jejak langkah perjalanan karir saya di SMPN 2 Temanggung. Harapan saya, kita bisa saling menginspirasi untuk kemajuan bersama.",
  visionTitle: "Visi",
  visionBody:
    "Mewujudkan generasi muda yang berbudi pekerti luhur, berprestasi tingkat nasional, dan berwawasan lingkungan menuju sekolah kebanggaan masyarakat.",
  missionTitle: "Misi",
  missionItems: [
    "Meningkatkan kualitas pembelajaran yang aktif dan menyenangkan.",
    "Mengembangkan karakter siswa melalui kegiatan ekstrakurikuler yang positif.",
    "Inovasi manajemen sekolah yang transparan dan akuntabel.",
  ],
  extraTitle: "",
  extraBody: "",
};

export function parseMissionItems(value?: string | string[] | null): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // Ignore JSON parse errors and fall back to line parsing.
  }
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeMissionItems(items: string[]): string {
  return JSON.stringify(items.map((item) => item.trim()).filter(Boolean));
}

export function normalizeHomeContent(
  input?: Partial<HomeContent> | null,
): HomeContent {
  return {
    heroTitle: input?.heroTitle?.trim() || defaultHomeContent.heroTitle,
    heroSubtitle:
      input?.heroSubtitle?.trim() || defaultHomeContent.heroSubtitle,
    heroImageUrl:
      input?.heroImageUrl?.trim() || defaultHomeContent.heroImageUrl,
    heroPrimaryLabel:
      input?.heroPrimaryLabel?.trim() || defaultHomeContent.heroPrimaryLabel,
    heroPrimaryHref:
      input?.heroPrimaryHref?.trim() || defaultHomeContent.heroPrimaryHref,
    heroSecondaryLabel:
      input?.heroSecondaryLabel?.trim() ||
      defaultHomeContent.heroSecondaryLabel,
    heroSecondaryHref:
      input?.heroSecondaryHref?.trim() || defaultHomeContent.heroSecondaryHref,
    profileTitle:
      input?.profileTitle?.trim() || defaultHomeContent.profileTitle,
    profileBody: input?.profileBody?.trim() || defaultHomeContent.profileBody,
    profileBody2:
      input?.profileBody2?.trim() || defaultHomeContent.profileBody2,
    visionTitle: input?.visionTitle?.trim() || defaultHomeContent.visionTitle,
    visionBody: input?.visionBody?.trim() || defaultHomeContent.visionBody,
    missionTitle:
      input?.missionTitle?.trim() || defaultHomeContent.missionTitle,
    missionItems:
      input?.missionItems && input.missionItems.length > 0
        ? input.missionItems
        : defaultHomeContent.missionItems,
    extraTitle: input?.extraTitle?.trim() || defaultHomeContent.extraTitle,
    extraBody: input?.extraBody?.trim() || defaultHomeContent.extraBody,
  };
}
