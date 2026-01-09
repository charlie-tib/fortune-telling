
export type Trigram = {
  name: string;
  symbol: string;
  lines: number[]; // 1 for Yang, 0 for Yin (bottom to top)
  attribute: string;
  nature: string;
};

export type Hexagram = {
  upper: Trigram;
  lower: Trigram;
  name: string;
  lines: number[]; // 6 lines total
};

export type DivinationResult = {
  question: string;
  benGua: Hexagram;
  huGua: Hexagram;
  bianGua: Hexagram;
  changingLine: number; // 1 to 6
  interpretation?: string;
};

export enum DivinationMethod {
  TIME = 'TIME',
  NUMBERS = 'NUMBERS'
}
