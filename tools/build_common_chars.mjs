import fs from 'node:fs/promises';
import { pinyin } from 'pinyin-pro';

const pages = Array.from({ length: 17 }, (_, i) => `https://chinese.gratis/characters/index.php?start=${i}`);
const chars = [];
for (const url of pages) {
  const html = await fetch(url).then(r => r.text());
  for (const match of html.matchAll(/<span class=ccn1>([^<]+)<\/span>/g)) {
    const raw = match[1].replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
    for (const ch of [...raw]) if (/\p{Script=Han}/u.test(ch) && !chars.includes(ch)) chars.push(ch);
  }
}
const selected = chars.slice(0, 1500);
const toneMap = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['ü', 1], ǘ: ['ü', 2], ǚ: ['ü', 3], ǜ: ['ü', 4], ü: ['ü', 0]
};
const initialList = ['zh','ch','sh','b','p','m','f','d','t','n','l','g','k','h','j','q','x','r','z','c','s','y','w'];
function parseSyllable(marked) {
  const lower = marked.toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü');
  let tone = 0;
  let plain = '';
  for (const char of [...lower]) {
    if (toneMap[char]) {
      plain += toneMap[char][0];
      if (toneMap[char][1]) tone = toneMap[char][1];
    } else {
      plain += char;
    }
  }
  let initial = initialList.find(i => plain.startsWith(i)) || '';
  let final = plain.slice(initial.length);
  if (!initial) return null;
  if (['j','q','x','y'].includes(initial) && final.startsWith('u')) final = 'ü' + final.slice(1);
  return { initial, final, tone, pinyin: marked };
}
const cards = [];
for (const ch of selected) {
  const marked = pinyin(ch, { toneType: 'symbol', type: 'array', multiple: false })[0];
  const parsed = parseSyllable(marked);
  if (parsed) cards.push({ char: ch, ...parsed });
}
await fs.writeFile('data/common-1500.json', JSON.stringify(cards, null, 2));
await fs.writeFile('common-chars.js', `window.COMMON_CHAR_CARDS = ${JSON.stringify(cards)};\n`);
console.log(JSON.stringify({ fetched: chars.length, selected: selected.length, cards: cards.length }, null, 2));
