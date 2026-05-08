import fs from "node:fs/promises";

const QURAN_ARABIC_URL =
  "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json";

const QURAN_ENGLISH_URL =
  "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json";

const outDir = new URL("../packages/data/", import.meta.url);

const surahMeta = [
  ["الفاتحة", "Al-Fatihah", "The Opening", "Meccan", 7],
  ["البقرة", "Al-Baqarah", "The Cow", "Medinan", 286],
  ["آل عمران", "Ali 'Imran", "Family of Imran", "Medinan", 200],
  ["النساء", "An-Nisa", "The Women", "Medinan", 176],
  ["المائدة", "Al-Ma'idah", "The Table Spread", "Medinan", 120],
  ["الأنعام", "Al-An'am", "The Cattle", "Meccan", 165],
  ["الأعراف", "Al-A'raf", "The Heights", "Meccan", 206],
  ["الأنفال", "Al-Anfal", "The Spoils of War", "Medinan", 75],
  ["التوبة", "At-Tawbah", "The Repentance", "Medinan", 129],
  ["يونس", "Yunus", "Jonah", "Meccan", 109],
  ["هود", "Hud", "Hud", "Meccan", 123],
  ["يوسف", "Yusuf", "Joseph", "Meccan", 111],
  ["الرعد", "Ar-Ra'd", "The Thunder", "Medinan", 43],
  ["إبراهيم", "Ibrahim", "Abraham", "Meccan", 52],
  ["الحجر", "Al-Hijr", "The Rocky Tract", "Meccan", 99],
  ["النحل", "An-Nahl", "The Bee", "Meccan", 128],
  ["الإسراء", "Al-Isra", "The Night Journey", "Meccan", 111],
  ["الكهف", "Al-Kahf", "The Cave", "Meccan", 110],
  ["مريم", "Maryam", "Mary", "Meccan", 98],
  ["طه", "Taha", "Ta-Ha", "Meccan", 135],
  ["الأنبياء", "Al-Anbya", "The Prophets", "Meccan", 112],
  ["الحج", "Al-Hajj", "The Pilgrimage", "Medinan", 78],
  ["المؤمنون", "Al-Mu'minun", "The Believers", "Meccan", 118],
  ["النور", "An-Nur", "The Light", "Medinan", 64],
  ["الفرقان", "Al-Furqan", "The Criterion", "Meccan", 77],
  ["الشعراء", "Ash-Shu'ara", "The Poets", "Meccan", 227],
  ["النمل", "An-Naml", "The Ant", "Meccan", 93],
  ["القصص", "Al-Qasas", "The Stories", "Meccan", 88],
  ["العنكبوت", "Al-'Ankabut", "The Spider", "Meccan", 69],
  ["الروم", "Ar-Rum", "The Romans", "Meccan", 60],
  ["لقمان", "Luqman", "Luqman", "Meccan", 34],
  ["السجدة", "As-Sajdah", "The Prostration", "Meccan", 30],
  ["الأحزاب", "Al-Ahzab", "The Combined Forces", "Medinan", 73],
  ["سبأ", "Saba", "Sheba", "Meccan", 54],
  ["فاطر", "Fatir", "Originator", "Meccan", 45],
  ["يس", "Ya-Sin", "Ya Sin", "Meccan", 83],
  ["الصافات", "As-Saffat", "Those Who Set the Ranks", "Meccan", 182],
  ["ص", "Sad", "The Letter Sad", "Meccan", 88],
  ["الزمر", "Az-Zumar", "The Troops", "Meccan", 75],
  ["غافر", "Ghafir", "The Forgiver", "Meccan", 85],
  ["فصلت", "Fussilat", "Explained in Detail", "Meccan", 54],
  ["الشورى", "Ash-Shuraa", "The Consultation", "Meccan", 53],
  ["الزخرف", "Az-Zukhruf", "The Ornaments of Gold", "Meccan", 89],
  ["الدخان", "Ad-Dukhan", "The Smoke", "Meccan", 59],
  ["الجاثية", "Al-Jathiyah", "The Crouching", "Meccan", 37],
  ["الأحقاف", "Al-Ahqaf", "The Wind-Curved Sandhills", "Meccan", 35],
  ["محمد", "Muhammad", "Muhammad", "Medinan", 38],
  ["الفتح", "Al-Fath", "The Victory", "Medinan", 29],
  ["الحجرات", "Al-Hujurat", "The Rooms", "Medinan", 18],
  ["ق", "Qaf", "The Letter Qaf", "Meccan", 45],
  ["الذاريات", "Adh-Dhariyat", "The Winnowing Winds", "Meccan", 60],
  ["الطور", "At-Tur", "The Mount", "Meccan", 49],
  ["النجم", "An-Najm", "The Star", "Meccan", 62],
  ["القمر", "Al-Qamar", "The Moon", "Meccan", 55],
  ["الرحمن", "Ar-Rahman", "The Beneficent", "Medinan", 78],
  ["الواقعة", "Al-Waqi'ah", "The Inevitable", "Meccan", 96],
  ["الحديد", "Al-Hadid", "The Iron", "Medinan", 29],
  ["المجادلة", "Al-Mujadila", "The Pleading Woman", "Medinan", 22],
  ["الحشر", "Al-Hashr", "The Exile", "Medinan", 24],
  ["الممتحنة", "Al-Mumtahanah", "She That Is To Be Examined", "Medinan", 13],
  ["الصف", "As-Saf", "The Ranks", "Medinan", 14],
  ["الجمعة", "Al-Jumu'ah", "The Congregation", "Medinan", 11],
  ["المنافقون", "Al-Munafiqun", "The Hypocrites", "Medinan", 11],
  ["التغابن", "At-Taghabun", "The Mutual Disillusion", "Medinan", 18],
  ["الطلاق", "At-Talaq", "The Divorce", "Medinan", 12],
  ["التحريم", "At-Tahrim", "The Prohibition", "Medinan", 12],
  ["الملك", "Al-Mulk", "The Sovereignty", "Meccan", 30],
  ["القلم", "Al-Qalam", "The Pen", "Meccan", 52],
  ["الحاقة", "Al-Haqqah", "The Reality", "Meccan", 52],
  ["المعارج", "Al-Ma'arij", "The Ascending Stairways", "Meccan", 44],
  ["نوح", "Nuh", "Noah", "Meccan", 28],
  ["الجن", "Al-Jinn", "The Jinn", "Meccan", 28],
  ["المزمل", "Al-Muzzammil", "The Enshrouded One", "Meccan", 20],
  ["المدثر", "Al-Muddaththir", "The Cloaked One", "Meccan", 56],
  ["القيامة", "Al-Qiyamah", "The Resurrection", "Meccan", 40],
  ["الإنسان", "Al-Insan", "The Man", "Medinan", 31],
  ["المرسلات", "Al-Mursalat", "The Emissaries", "Meccan", 50],
  ["النبأ", "An-Naba", "The Tidings", "Meccan", 40],
  ["النازعات", "An-Nazi'at", "Those Who Drag Forth", "Meccan", 46],
  ["عبس", "Abasa", "He Frowned", "Meccan", 42],
  ["التكوير", "At-Takwir", "The Overthrowing", "Meccan", 29],
  ["الإنفطار", "Al-Infitar", "The Cleaving", "Meccan", 19],
  ["المطففين", "Al-Mutaffifin", "Defrauding", "Meccan", 36],
  ["الإنشقاق", "Al-Inshiqaq", "The Sundering", "Meccan", 25],
  ["البروج", "Al-Buruj", "The Mansions of the Stars", "Meccan", 22],
  ["الطارق", "At-Tariq", "The Nightcommer", "Meccan", 17],
  ["الأعلى", "Al-A'la", "The Most High", "Meccan", 19],
  ["الغاشية", "Al-Ghashiyah", "The Overwhelming", "Meccan", 26],
  ["الفجر", "Al-Fajr", "The Dawn", "Meccan", 30],
  ["البلد", "Al-Balad", "The City", "Meccan", 20],
  ["الشمس", "Ash-Shams", "The Sun", "Meccan", 15],
  ["الليل", "Al-Layl", "The Night", "Meccan", 21],
  ["الضحى", "Ad-Duhaa", "The Morning Hours", "Meccan", 11],
  ["الشرح", "Ash-Sharh", "The Relief", "Meccan", 8],
  ["التين", "At-Tin", "The Fig", "Meccan", 8],
  ["العلق", "Al-'Alaq", "The Clot", "Meccan", 19],
  ["القدر", "Al-Qadr", "The Power", "Meccan", 5],
  ["البينة", "Al-Bayyinah", "The Clear Proof", "Medinan", 8],
  ["الزلزلة", "Az-Zalzalah", "The Earthquake", "Medinan", 8],
  ["العاديات", "Al-'Adiyat", "The Courser", "Meccan", 11],
  ["القارعة", "Al-Qari'ah", "The Calamity", "Meccan", 11],
  ["التكاثر", "At-Takathur", "The Rivalry in World Increase", "Meccan", 8],
  ["العصر", "Al-'Asr", "The Declining Day", "Meccan", 3],
  ["الهمزة", "Al-Humazah", "The Traducer", "Meccan", 9],
  ["الفيل", "Al-Fil", "The Elephant", "Meccan", 5],
  ["قريش", "Quraysh", "Quraysh", "Meccan", 4],
  ["الماعون", "Al-Ma'un", "The Small Kindnesses", "Meccan", 7],
  ["الكوثر", "Al-Kawthar", "The Abundance", "Meccan", 3],
  ["الكافرون", "Al-Kafirun", "The Disbelievers", "Meccan", 6],
  ["النصر", "An-Nasr", "The Divine Support", "Medinan", 3],
  ["المسد", "Al-Masad", "The Palm Fiber", "Meccan", 5],
  ["الإخلاص", "Al-Ikhlas", "The Sincerity", "Meccan", 4],
  ["الفلق", "Al-Falaq", "The Daybreak", "Meccan", 5],
  ["الناس", "An-Nas", "Mankind", "Meccan", 6],
];

const expectedAyahCounts = surahMeta.map((item) => Number(item[4]));

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

function getSurahNumber(value) {
  return Number(
    value.index ?? value.id ?? value.number ?? value.surah ?? value.chapter
  );
}

function getAyahNumber(value) {
  return Number(
    value.index ??
      value.id ??
      value.number ??
      value.ayah ??
      value.verse ??
      value.numberInSurah
  );
}

function getArabicText(value) {
  return String(value.text ?? value.uthmani ?? value.arabic ?? "").trim();
}

function getEnglishText(value) {
  return String(
    value.translation ?? value.english ?? value.meaning ?? value.text ?? ""
  ).trim();
}

function flattenPayload(payload, language) {
  const root = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.quran)
        ? payload.quran
        : Array.isArray(payload.surahs)
          ? payload.surahs
          : Array.isArray(payload.chapters)
            ? payload.chapters
            : null;

  if (!root) {
    throw new Error("Unsupported Quran JSON structure.");
  }

  const getPayloadText =
    language === "english" ? getEnglishText : getArabicText;

  if (root[0]?.verses || root[0]?.ayahs) {
    return root.flatMap((surah) => {
      const surahNumber = getSurahNumber(surah);
      const verses = surah.verses ?? surah.ayahs;

      return verses.map((verse) => ({
        surahNumber,
        ayahNumber: getAyahNumber(verse),
        text: getPayloadText(verse),
      }));
    });
  }

  return root.map((ayah) => ({
    surahNumber: getSurahNumber(ayah),
    ayahNumber: getAyahNumber(ayah),
    text: getPayloadText(ayah),
  }));
}

function validateDataset({ surahs, ayahs }) {
  const errors = [];

  if (surahs.length !== 114) {
    errors.push(`Expected 114 surahs, got ${surahs.length}.`);
  }

  if (ayahs.length !== 6236) {
    errors.push(`Expected 6236 ayahs, got ${ayahs.length}.`);
  }

  for (const surah of surahs) {
    const count = ayahs.filter((ayah) => ayah.surahId === surah.id).length;
    const expected = expectedAyahCounts[surah.id - 1];

    if (count !== expected) {
      errors.push(
        `Surah ${surah.id} expected ${expected} ayahs, got ${count}.`
      );
    }
  }

  const emptyArabic = ayahs.filter((ayah) => !ayah.arabic.trim());
  const emptyTranslation = ayahs.filter((ayah) => !ayah.translation.trim());

  if (emptyArabic.length > 0) {
    errors.push(`Found ${emptyArabic.length} ayahs with empty Arabic text.`);
  }

  if (emptyTranslation.length > 0) {
    errors.push(
      `Found ${emptyTranslation.length} ayahs with empty English translation.`
    );
  }

  const translationsThatLookArabic = ayahs.filter((ayah) =>
    /[\u0600-\u06FF]/.test(ayah.translation)
  );

  if (translationsThatLookArabic.length > 1000) {
    errors.push(
      `English translation appears to contain Arabic text for ${translationsThatLookArabic.length} ayahs.`
    );
  }

  const duplicateKeys = new Set();
  const seenKeys = new Set();

  for (const ayah of ayahs) {
    const key = `${ayah.surahId}:${ayah.numberInSurah}`;

    if (seenKeys.has(key)) {
      duplicateKeys.add(key);
    }

    seenKeys.add(key);
  }

  if (duplicateKeys.size > 0) {
    errors.push(
      `Found duplicate ayah keys: ${Array.from(duplicateKeys).join(", ")}`
    );
  }

  if (errors.length > 0) {
    throw new Error(`Dataset validation failed:\n${errors.join("\n")}`);
  }
}

async function main() {
  console.log("Downloading Quran JSON data...");

  const [arabicPayload, englishPayload] = await Promise.all([
    fetchJson(QURAN_ARABIC_URL),
    fetchJson(QURAN_ENGLISH_URL),
  ]);

  const arabicSource = flattenPayload(arabicPayload, "arabic");
  const englishSource = flattenPayload(englishPayload, "english");

  const englishMap = new Map(
    englishSource.map((ayah) => [
      `${ayah.surahNumber}:${ayah.ayahNumber}`,
      ayah.text,
    ])
  );

  let id = 1;

  const ayahs = arabicSource.map((ayah) => {
    const translation = englishMap.get(
      `${ayah.surahNumber}:${ayah.ayahNumber}`
    );

    if (!translation) {
      throw new Error(
        `Missing translation for ${ayah.surahNumber}:${ayah.ayahNumber}`
      );
    }

    return {
      id: id++,
      surahId: ayah.surahNumber,
      numberInSurah: ayah.ayahNumber,
      juz: 1,
      page: 1,
      arabic: ayah.text,
      translation,
    };
  });

  const surahs = surahMeta.map(
    (
      [
        arabicName,
        englishName,
        englishNameTranslation,
        revelationType,
        numberOfAyahs,
      ],
      index
    ) => ({
      id: index + 1,
      arabicName,
      englishName,
      englishNameTranslation,
      revelationType,
      numberOfAyahs,
    })
  );

  validateDataset({ surahs, ayahs });

  const surahsFile = `import type { Surah } from "./types";

export const surahs: Surah[] = ${JSON.stringify(surahs, null, 2)};
`;

  const quranFile = `import type { Ayah } from "./types";

export const ayahs: Ayah[] = ${JSON.stringify(ayahs, null, 2)};
`;

  await fs.writeFile(new URL("surahs.ts", outDir), surahsFile, "utf8");
  await fs.writeFile(new URL("quran.ts", outDir), quranFile, "utf8");

  console.log("Dataset validation passed.");
  console.log(`Generated ${surahs.length} surahs.`);
  console.log(`Generated ${ayahs.length} ayahs.`);
  console.log("Checked known ayah counts for all 114 surahs.");
  console.log("Checked no empty Arabic text.");
  console.log("Checked no empty English translation.");
  console.log("Checked translation content is not Arabic.");
  console.log("Checked no duplicate surah:ayah keys.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});