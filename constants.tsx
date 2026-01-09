
import { Trigram } from './types';

export const TRIGRAMS: Record<number, Trigram> = {
  1: { name: '乾', symbol: '☰', lines: [1, 1, 1], attribute: '健', nature: '天' },
  2: { name: '兑', symbol: '☱', lines: [1, 1, 0], attribute: '悦', nature: '泽' },
  3: { name: '离', symbol: '☲', lines: [1, 0, 1], attribute: '丽', nature: '火' },
  4: { name: '震', symbol: '☳', lines: [1, 0, 0], attribute: '动', nature: '雷' },
  5: { name: '巽', symbol: '☴', lines: [0, 1, 1], attribute: '入', nature: '风' },
  6: { name: '坎', symbol: '☵', lines: [0, 1, 0], attribute: '陷', nature: '水' },
  7: { name: '艮', symbol: '☶', lines: [0, 0, 1], attribute: '止', nature: '山' },
  8: { name: '坤', symbol: '☷', lines: [0, 0, 0], attribute: '顺', nature: '地' },
};

export const LUNAR_ZODIAC = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const HEXAGRAM_DATA: Record<string, { name: string; meaning: string }> = {
  '11': { name: '乾为天', meaning: '大哉乾元，万物资始。象征纯阳刚健，自强不息。' },
  '12': { name: '天泽履', meaning: '履虎尾，不咥人。象征如履薄冰，讲究礼仪规范。' },
  '13': { name: '天火同人', meaning: '同人于野，亨。象征志同道合，团结克难。' },
  '14': { name: '天雷无妄', meaning: '天下雷行，物与无妄。象征顺应自然，不可妄行。' },
  '15': { name: '天风姤', meaning: '天下有风。象征不期而遇，须防阴长阳消。' },
  '16': { name: '天水讼', meaning: '上刚下险。象征争讼纷争，宜和不宜斗。' },
  '17': { name: '天山遁', meaning: '天下有山。象征退避隐居，保存实力。' },
  '18': { name: '天地否', meaning: '天地不交。象征闭塞不通，万物不长，时运不济。' },
  '21': { name: '泽天夬', meaning: '泽上于天。象征决断排除，去邪扶正。' },
  '22': { name: '兑为泽', meaning: '两泽相依。象征喜悦和乐，朋友讲习。' },
  '23': { name: '泽火革', meaning: '泽中有火。象征变革改制，去旧布新。' },
  '24': { name: '泽雷随', meaning: '泽中有雷。象征顺其自然，随机应变。' },
  '25': { name: '泽风大过', meaning: '泽灭木。象征负担过重，阳刚过盛，面临转折。' },
  '26': { name: '泽水困', meaning: '泽无水。象征穷困艰辛，坚守正道可亨。' },
  '27': { name: '泽山咸', meaning: '山上有泽。象征感应交流，男女情感。' },
  '28': { name: '泽地萃', meaning: '泽上于地。象征荟萃聚集，人才辈出。' },
  '31': { name: '火天大有', meaning: '火在天上。象征大有收获，富足丰登。' },
  '32': { name: '火泽睽', meaning: '火上泽下。象征背道而驰，异中求同。' },
  '33': { name: '离为火', meaning: '明两作。象征光明美丽，附丽而生。' },
  '34': { name: '火雷噬嗑', meaning: '雷电交合。象征严明治罪，除掉障碍。' },
  '35': { name: '火风鼎', meaning: '木上有火。象征稳重革新，三足鼎立。' },
  '36': { name: '火水未济', meaning: '火在水上。象征事业尚未成功，充满希望与挑战。' },
  '37': { name: '火山旅', meaning: '山上有火。象征羁旅在外，不安定之象。' },
  '38': { name: '火地晋', meaning: '明出地上。象征加官进爵，事业上升。' },
  '41': { name: '雷天大壮', meaning: '雷行天上。象征声势浩大，刚健有力。' },
  '42': { name: '雷泽归妹', meaning: '泽上有雷。象征由于冲动而结合，非长久之计。' },
  '43': { name: '雷火丰', meaning: '雷电皆至。象征盛大丰满，宜在此时成就大事。' },
  '44': { name: '震为雷', meaning: '震惊百里。象征奋发向上，虽有惊扰但不失节。' },
  '45': { name: '雷风恒', meaning: '雷动风散。象征持之以恒，长久之道。' },
  '46': { name: '雷水解', meaning: '险以动。象征缓解危难，解除冰冻。' },
  '47': { name: '雷山小过', meaning: '山上有雷。象征小有过度，宜下不宜上。' },
  '48': { name: '雷地豫', meaning: '雷出于地。象征愉悦欢乐，顺时而动。' },
  '51': { name: '风天小畜', meaning: '风行天上。象征力量微弱，宜积蓄实力。' },
  '52': { name: '风泽中孚', meaning: '泽上有风。象征诚信待人，感通万物。' },
  '53': { name: '风火家人', meaning: '火生于风。象征治家有道，各安其位。' },
  '54': { name: '风雷益', meaning: '风雷交加。象征增益进步，损上益下。' },
  '55': { name: '巽为风', meaning: '随风而入。象征谦逊柔顺，无孔不入。' },
  '56': { name: '风水涣', meaning: '风行水上。象征涣散消解，亦有重组之机。' },
  '57': { name: '风山渐', meaning: '山上有木。象征循序渐进，平稳发展。' },
  '58': { name: '风地观', meaning: '风行地上。象征观察思考，瞻仰圣德。' },
  '61': { name: '水天需', meaning: '云上于天。象征守正待时，饮食宴乐。' },
  '62': { name: '水泽节', meaning: '泽上有水。象征节制约束，适可而止。' },
  '63': { name: '水火既济', meaning: '水火交融。象征功成名就，须防盛极而衰。' },
  '64': { name: '水雷屯', meaning: '云雷屯。象征草创之艰，万事开头难。' },
  '65': { name: '水风井', meaning: '木欣水。象征井德无穷，惠及于民。' },
  '66': { name: '坎为水', meaning: '习坎重险。象征艰难险阻，常怀警惕。' },
  '67': { name: '水山蹇', meaning: '山上有水。象征艰难险阻，宜见大人，利西南。' },
  '68': { name: '水地比', meaning: '地上有水。象征亲近比附，团结相亲。' },
  '71': { name: '山天大畜', meaning: '天在山中。象征积蓄才德，大有作为。' },
  '72': { name: '山泽损', meaning: '损下益上。象征克制私欲，减损以修德。' },
  '73': { name: '山火贲', meaning: '山下有火。象征修饰文美，礼仪修养。' },
  '74': { name: '山雷颐', meaning: '山下有雷。象征颐养天年，谨慎言语饮食。' },
  '75': { name: '山风蛊', meaning: '山下有风。象征整治腐败，挽救危机。' },
  '76': { name: '山水蒙', meaning: '山下有水。象征启蒙教育，果行育德。' },
  '77': { name: '艮为山', meaning: '两山重叠。象征静止安定，动静得宜。' },
  '78': { name: '山地剥', meaning: '山附于地。象征小人得势，正气被剥。' },
  '81': { name: '地天泰', meaning: '天地交泰。象征平稳安定，万事亨通。' },
  '82': { name: '地泽临', meaning: '泽上于地。象征领导亲民，好运将至。' },
  '83': { name: '地火明夷', meaning: '明入地中。象征光明受损，宜晦迹韬光。' },
  '84': { name: '地雷复', meaning: '雷在地下。象征生机复萌，循环往复。' },
  '85': { name: '地风升', meaning: '地中生木。象征稳步上升，仕途通达。' },
  '86': { name: '地水师', meaning: '地中有水。象征兴师动众，讲究纪律。' },
  '87': { name: '地山谦', meaning: '地中有山。象征谦虚受益，卑以自牧。' },
  '88': { name: '坤为地', meaning: '至哉坤元。象征厚德载物，柔顺包容。' }
};

export const GET_HEXAGRAM_NAME = (upper: number, lower: number): string => {
  return HEXAGRAM_DATA[`${upper}${lower}`]?.name || '未知卦';
};

export const GET_HEXAGRAM_MEANING = (upper: number, lower: number): string => {
  return HEXAGRAM_DATA[`${upper}${lower}`]?.meaning || '暂无解析';
};
