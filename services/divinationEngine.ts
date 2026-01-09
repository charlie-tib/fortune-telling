
import { TRIGRAMS, GET_HEXAGRAM_NAME } from '../constants';
import { Hexagram, DivinationResult } from '../types';

const getTrigram = (val: number) => {
  let num = val % 8;
  if (num === 0) num = 8;
  return TRIGRAMS[num];
};

const constructHexagram = (upperNum: number, lowerNum: number): Hexagram => {
  const upper = getTrigram(upperNum);
  const lower = getTrigram(lowerNum);
  const lines = [...lower.lines, ...upper.lines];
  return {
    upper,
    lower,
    name: GET_HEXAGRAM_NAME(upperNum % 8 || 8, lowerNum % 8 || 8),
    lines
  };
};

const getHuGua = (benGua: Hexagram): Hexagram => {
  // Hu Gua (Mutual Hexagram) uses lines 2,3,4 as lower and 3,4,5 as upper (1-indexed)
  // Our lines are 0 to 5 (bottom to top)
  // Mutual Lower: 1, 2, 3
  // Mutual Upper: 2, 3, 4
  const l2 = benGua.lines[1];
  const l3 = benGua.lines[2];
  const l4 = benGua.lines[3];
  const l5 = benGua.lines[4];

  const lowerLines = [l2, l3, l4];
  const upperLines = [l3, l4, l5];

  const findTrigramByLines = (lines: number[]) => {
    return Object.values(TRIGRAMS).find(t => t.lines.every((l, i) => l === lines[i])) || TRIGRAMS[1];
  };

  const lower = findTrigramByLines(lowerLines);
  const upper = findTrigramByLines(upperLines);
  
  const upperKey = Object.keys(TRIGRAMS).find(k => TRIGRAMS[Number(k)] === upper);
  const lowerKey = Object.keys(TRIGRAMS).find(k => TRIGRAMS[Number(k)] === lower);

  return {
    upper,
    lower,
    name: GET_HEXAGRAM_NAME(Number(upperKey), Number(lowerKey)),
    lines: [...lowerLines, ...upperLines]
  };
};

const getBianGua = (benGua: Hexagram, movingLine: number): Hexagram => {
  const lines = [...benGua.lines];
  const idx = movingLine - 1; // 1-indexed to 0-indexed
  lines[idx] = lines[idx] === 1 ? 0 : 1;

  const lowerLines = lines.slice(0, 3);
  const upperLines = lines.slice(3, 6);

  const findTrigramByLines = (lines: number[]) => {
    return Object.values(TRIGRAMS).find(t => t.lines.every((l, i) => l === lines[i])) || TRIGRAMS[1];
  };

  const lower = findTrigramByLines(lowerLines);
  const upper = findTrigramByLines(upperLines);

  const upperKey = Object.keys(TRIGRAMS).find(k => TRIGRAMS[Number(k)] === upper);
  const lowerKey = Object.keys(TRIGRAMS).find(k => TRIGRAMS[Number(k)] === lower);

  return {
    upper,
    lower,
    name: GET_HEXAGRAM_NAME(Number(upperKey), Number(lowerKey)),
    lines
  };
};

export const calculateByTime = (question: string): DivinationResult => {
  const now = new Date();
  // Simplified Mei Hua formula for demo:
  // Upper = (Year + Month + Day) % 8
  // Lower = (Year + Month + Day + Hour) % 8
  // Changing Line = (Year + Month + Day + Hour) % 6
  // (In real practice, Year is the Zodiac number, Month is lunar month, etc. We'll simulate with current date components)
  const y = now.getFullYear() % 12 + 1;
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const h = Math.floor(now.getHours() / 2) + 1; // Zodiac hour 1-12

  const upperVal = y + m + d;
  const lowerVal = y + m + d + h;
  let movingLine = (y + m + d + h) % 6;
  if (movingLine === 0) movingLine = 6;

  const benGua = constructHexagram(upperVal, lowerVal);
  const huGua = getHuGua(benGua);
  const bianGua = getBianGua(benGua, movingLine);

  return { question, benGua, huGua, bianGua, changingLine: movingLine };
};

export const calculateByNumbers = (question: string, n1: number, n2: number, n3: number): DivinationResult => {
  const benGua = constructHexagram(n1, n2);
  let movingLine = n3 % 6;
  if (movingLine === 0) movingLine = 6;

  const huGua = getHuGua(benGua);
  const bianGua = getBianGua(benGua, movingLine);

  return { question, benGua, huGua, bianGua, changingLine: movingLine };
};
