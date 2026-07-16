// ─────────────────────────────────────────────────────────────
//  Profanity / insult filter for user comments (RU + EN).
//
//  Russian obscenity is generated from a small set of roots, so a root-based
//  matcher plus obfuscation-resistant normalization catches far more real
//  variants than a flat word list — including "с у к а" (spacing), "cyka"
//  (Latin look-alikes), "п1зда" (leet) and "суууука" (repeats).
//
//  Matching is split to keep false positives low (e.g. "плохо" contains "лох",
//  "употреблять" contains "блят", "команда" contains "манда"):
//    • SUB   — strong, distinctive stems matched anywhere in the de-spaced text
//              (safe as substrings; obscene mat + long insult stems).
//    • WORD  — shorter/ambiguous insults matched per WORD only: exact, or a
//              prefix for stems of 5+ letters, so ordinary words that merely
//              contain them are never flagged.
// ─────────────────────────────────────────────────────────────

// Confusable letters + leetspeak → a single canonical script. We fold to
// Cyrillic (for RU) and to Latin (for EN) so cross-script tricks are caught.
const TO_CYR: Record<string, string> = {
  a: "а", e: "е", o: "о", c: "с", p: "р", x: "х", y: "у", k: "к", m: "м", t: "т", h: "н", b: "в",
  ё: "е",
  "0": "о", "1": "и", "3": "е", "4": "а", "5": "с", "6": "б", "7": "т", "8": "в", "@": "а", $: "с", "!": "и",
};
const TO_LAT: Record<string, string> = {
  а: "a", е: "e", о: "o", с: "c", р: "p", х: "x", у: "y", к: "k", м: "m", т: "t", н: "h", в: "b", і: "i", ё: "e",
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", $: "s", "!": "i",
};

// Collapse any run of the same letter to one — defeats "суууука"/"fuuuck" and
// double-letter tricks ("суука"). Applied to both text and word lists so they
// compare consistently.
const squeeze = (s: string) => s.replace(/(.)\1+/g, "$1");

type Folded = { tokens: string[]; joined: string };

function fold(text: string, map: Record<string, string>, keep: RegExp): Folded {
  const lower = text.toLowerCase();
  const tokens: string[] = [];
  let cur = "";
  for (const raw of lower) {
    const ch = map[raw] ?? raw;
    if (keep.test(ch)) cur += ch;
    else if (cur) {
      tokens.push(cur);
      cur = "";
    }
  }
  if (cur) tokens.push(cur);
  const norm = tokens.map(squeeze);
  return { tokens: norm, joined: norm.join("") };
}

// ── Substring stems (safe anywhere): obscene mat + long distinctive insults ──
const RU_SUB = [
  // mat — hard obscenity
  "хуй", "хуя", "хуе", "хуё", "хуи", "хуйн", "хуйл", "хуес", "хуёв", "хуев", "охуе", "охуи", "ахуе", "нахуй", "похуй", "дохуя", "хуепут",
  "пизд", "пезд", "пизж", "распизд",
  "ебал", "ебан", "ебат", "ебуч", "ебло", "ебну", "ебис", "ебош", "ебаш", "ёбан", "ёбну", "выеб", "въеб", "наеб", "поеб", "уеб", "доеб",
  "объеб", "разъеб", "заеб", "отъеб", "съеб", "приеб", "недоеб", "долбоеб", "долбоёб", "долбаёб",
  "муда", "мудак", "мудач", "мудил", "мудеж", "мудозвон",
  "залуп", "дроч", "гандон", "гондон", "пидор", "пидар", "педрил", "пидрил", "уёбок", "уебок", "уёбищ", "уебищ",
  "сука", "суки", "суку", "сукин", "сукой", "сучар", "сучен", "сученыш", "сучёныш",
  "говно", "говня", "гавно", "дерьм", "жопа", "жопу", "жоплиз", "залупа", "спермо", "сперма",
  "нахер", "похер", "херня", "херов", "херас", "мразот", "гнидон", "бляд", "блядь", "бляди",
  // long insult stems — safe as substrings, also catch spaced-out forms
  "дебил", "идиот", "кретин", "придур", "ублюд", "мерзав", "негодяй", "ничтож", "паскуд", "выродок", "уродин", "уродл",
  "дегенерат", "имбецил", "слабоумн", "олигофрен", "дебилоид", "лошар", "лохар", "скотина", "козлин", "гадёныш", "гаденыш",
];
const EN_SUB = [
  "fuck", "fuk", "fck", "motherfuck", "mothafuck", "clusterfuck", "dumbfuck", "fuckface", "fuckwit", "fuckhead", "fucker",
  "shit", "sht", "bulshit", "dipshit", "shitface", "shithead",
  "bitch", "btch", "biatch", "sonofabitch", "cunt", "ashole", "arsehole", "dumbas", "jackas", "asswipe", "ashat",
  "bastard", "pusy", "whore", "slut", "niger", "niga", "fagot", "retard", "dickhead", "wanker", "bolock", "twat",
  "coksuck", "cokhead", "motherf", "goddamn", "scumbag", "douchebag", "douche", "imbecile", "cretin", "degenerate", "idiot", "moron",
  // romanized Russian swearing (safe, distinctive substrings)
  "suka", "cyka", "blyat", "blyad", "pizda", "pizdec", "pizdez", "nahuy", "nahui", "dolboeb", "gandon", "mudak", "pidor", "zaebal", "huyle", "huyn", "ebani",
];

// ── Per-word insults (exact, or prefix for 5+ stems) ──
const RU_WORD = [
  "лох", "чмо", "чмош", "хам", "хамло", "хамьё", "гад", "гадина", "урод", "уроды", "дура", "дурак", "дурачь", "быдло", "быдл",
  "жид", "даун", "чурк", "хачик", "хач", "тварь", "твари", "гнида", "гниды", "мраз", "мразь", "козёл", "козел", "сволоч", "подлец",
  "тупиц", "тупой", "тупая", "тупое", "тормоз", "отброс", "блять", "блят",
];
const EN_WORD = [
  "ass", "arse", "dick", "twat", "jerk", "scum", "nazi", "coon", "chink", "slut", "whore", "knob", "tosser",
  "bugger", "loser", "stupid", "dumbo", "numbnut", "cripple", "spastic", "wetback", "faggot", "nigger", "nigga",
];

const norm = (list: string[]) => list.map((s) => squeeze(s.replace(/ё/g, "е")));
const [RU_SUB_N, EN_SUB_N, RU_WORD_N, EN_WORD_N] = [RU_SUB, EN_SUB, RU_WORD, EN_WORD].map(norm);

function anySub(joined: string, subs: string[]): boolean {
  for (const r of subs) if (r.length >= 3 && joined.includes(r)) return true;
  return false;
}
function anyWord(tokens: string[], words: string[]): boolean {
  for (const tok of tokens) {
    for (const w of words) {
      if (tok === w) return true;
      if (w.length >= 5 && tok.startsWith(w)) return true;
    }
  }
  return false;
}

/** True if the text contains profanity or an insult (RU or EN), resilient to
 * spacing, Latin/Cyrillic look-alikes, leetspeak and repeated letters. */
export function containsProfanity(text: string): boolean {
  if (!text) return false;
  const cyr = fold(text, TO_CYR, /[а-я]/);
  const lat = fold(text, TO_LAT, /[a-z]/);
  return (
    anySub(cyr.joined, RU_SUB_N) ||
    anySub(lat.joined, EN_SUB_N) ||
    anyWord(cyr.tokens, RU_WORD_N) ||
    anyWord(lat.tokens, EN_WORD_N)
  );
}
