const stripTags = (input: string): string => {
  return input.replace(/<[^>]*>/g, "");
};

const normalizeLineBreaks = (input: string): string => {
  return input.replace(/\r\n|\r/g, "\n").replace(/\n{3,}/g, "\n\n");
};

export type FormattedHymn = {
  title?: string;
  number?: string | number;
  language?: string;
  chorus?: string | null;
  verses: Array<{ label?: string; text: string; type?: 'verse' | 'chorus' }>;
};

export const formatHymn = (raw: any): FormattedHymn => {
  const title = raw?.title;
  const number = raw?.number;
  const language = raw?.language;

  // Structured verses from API: verses: [{ number, content }]
  const structuredVerses =
    Array.isArray(raw?.verses) &&
    raw.verses
      .map((v: any, idx: number) => ({
        label: (v?.number ?? idx + 1)?.toString(),
        text: normalizeLineBreaks(stripTags(v?.content ?? "")),
        type: (v?.type === 'chorus' ? 'chorus' : 'verse') as 'verse' | 'chorus',
      }))
      .filter((v: any) => v.text.trim().length > 0);

  // Chorus if present
  const chorus =
    raw?.chorus && typeof raw.chorus === "string"
      ? normalizeLineBreaks(stripTags(raw.chorus))
      : null;

  // Legacy or alternate fields
  const rawLyricsCandidates: string[] = [];
  if (typeof raw?.lyrics === "string") rawLyricsCandidates.push(raw.lyrics);
  if (typeof raw?.verses_text === "string") rawLyricsCandidates.push(raw.verses_text);
  if (typeof raw?.content === "string") rawLyricsCandidates.push(raw.content);
  if (typeof raw?.body === "string") rawLyricsCandidates.push(raw.body);

  // If verses came as a single string
  if (typeof raw?.verses === "string") {
    rawLyricsCandidates.push(raw.verses);
  }

  const legacyLyrics = rawLyricsCandidates
    .map((s) => s.trim())
    .find((s) => s.length > 0);

  const legacyVerses =
    legacyLyrics
      ?.split(/\n{2,}/)
      .map((block, idx) => ({
        label: `${idx + 1}`,
        text: normalizeLineBreaks(stripTags(block)).trim(),
        type: 'verse' as const,
      }))
      .filter((v) => v.text.length > 0) ?? [];

  return {
    title,
    number,
    language,
    chorus,
    verses: structuredVerses?.length ? structuredVerses : legacyVerses,
  };
};

