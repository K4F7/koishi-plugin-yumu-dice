// 定义 DiceParam
export interface DiceParam {
  dice: number | null;
  number: number | null;
  text: string | null;
}

// 定义 DiceException
export class DiceException extends Error {
  type: DiceExceptionType;
  data?: any;

  constructor(type: DiceExceptionType, message?: string, data?: any) {
    super(message || type);
    this.name = 'DiceException';
    this.type = type;
    this.data = data;
    Object.setPrototypeOf(this, DiceException.prototype);
  }

  static ForWhat() { return new DiceException(DiceExceptionType.FOR_WHAT, "你问我，我问谁？"); }
  static JerkOff() { return new DiceException(DiceExceptionType.JERK_OFF, "你不对劲。"); }
  static Exceed() { return new DiceException(DiceExceptionType.EXCEED, "超出范围了。"); }
  static TooSmall() { return new DiceException(DiceExceptionType.TOO_SMALL, "太小了。"); }
  static DiceTooMany(d: number) { return new DiceException(DiceExceptionType.DICE_TOO_MANY, `骰子太多了，不能超过100个。你扔了${d}个。`); }
  static Negative() { return new DiceException(DiceExceptionType.NEGATIVE, "不能是负数。"); }
  static TooLarge() { return new DiceException(DiceExceptionType.TOO_LARGE, "太大了。"); }
  static NoDifferenceEveryday(left: string, right: string) { return new DiceException(DiceExceptionType.NO_DIFFERENCE_EVERYDAY, `你俩都一样，天天都一样，没区别。`); }
  static NoDifference() { return new DiceException(DiceExceptionType.NO_DIFFERENCE, "没区别。"); }
  static NotMatched() { return new DiceException(DiceExceptionType.NOT_MATCHED, "我不知道该怎么回应你。"); }
  static All() { return new DiceException(DiceExceptionType.ALL, "都一样。"); }
  static Tie() { return new DiceException(DiceExceptionType.TIE, "平局。"); }
  static Unexpected() { return new DiceException(DiceExceptionType.UNEXPECTED, "发生了一些意想不到的错误。"); }
}

export enum DiceExceptionType {
  FOR_WHAT = "FOR_WHAT",
  JERK_OFF = "JERK_OFF",
  EXCEED = "EXCEED",
  TOO_SMALL = "TOO_SMALL",
  DICE_TOO_MANY = "DICE_TOO_MANY",
  NEGATIVE = "NEGATIVE",
  TOO_LARGE = "TOO_LARGE",
  NO_DIFFERENCE_EVERYDAY = "NO_DIFFERENCE_EVERYDAY",
  NO_DIFFERENCE = "NO_DIFFERENCE",
  NOT_MATCHED = "NOT_MATCHED",
  ALL = "ALL",
  TIE = "TIE",
  UNEXPECTED = "UNEXPECTED",
}

/**
 * 获取随机数。
 *
 * @param range 范围
 * @return 如果范围是 1，返回 1。如果范围大于 1，返回 1-范围内的数（Double 的整数），其他则返回 0-1。
 */
export function getRandom(range: number = 0): number {
  if (range > 1) {
    return Math.floor(Math.random() * range) + 1;
  } else if (range === 1) {
    return 1;
  } else {
    return Math.random();
  }
}

/**
 * 改变主宾格，删除语气助词，和谐违禁词
 *
 * @param str 未和谐
 * @return 和谐
 */
export function changeCase(str: string | null): string {
  let s = recoveryApostrophe(str || "");

  return s.trim()
    .replace(/你们?/g, "雨沐")
    .replace(/\s yours?\s/gi, " yumu's ")
    .replace(/\s you\s/gi, " yumu ")
    .replace(/我们/g, "你们")
    .replace(/我/g, "你")
    .replace(/\s([Ii]|me)\s/gi, " you ")
    .replace(/\smy\s/gi, " your ")
    .replace(/\smine\s/gi, " yours ")
    .replace(
      /[啊呃欸呀哟欤呕噢呦嘢哦吧呗啵啦嘞哩咧咯啰喽吗嘛嚜呢呐呵兮噻哉矣焉]|[罢否乎][?？!！。.\\s]?$/g,
      ""
    )
    .replace(/[?？!！。.\\s]$/g, "")
    .replace(
      /[习習]近平|[习習]?总书记|主席|国家|政治|反动|反?共(产党)?|[国國]民[党黨]|天安[門门]|极[左右](主义)?|革命|(社会)?主义|自由|解放|中[華华]民[国國]|情趣|迪克|高潮|色[诱情欲色]|擦边|露出|[蛇射受授吞]精|潮喷|成人|性交|小?男娘|小?南梁|做爱|后入|药娘|怀孕|生殖器|寄吧|几把|鸡[鸡巴]|[精卵]子|[精爱]液|子宫|阴[茎蒂唇囊道]|[逼Bb阴吊叼批肛]毛|搞基|出?脚本|[Rr]-?18|18\s?禁|LGBT/g,
      "[和谐]"
    )
    .replace(/[黨党吊批逼操肏肛杀穴屁萎猥]/g, "○")
    .replace(/((电?[棍昆滚])|otto)\s*的?\s*((老?[木母]亲?)|([妈老]?妈)|(mom)|(mother))/g, "    ");
}


// 避免撇号影响结果，比如 It's time to go bed
export function transferApostrophe(s: string | null): string {
  return (s || "").trim().replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// 把撇号影响的结果转换回去，比如 It's time to go bed
export function recoveryApostrophe(s: string | null): string {
  return (s || "").trim().replace(/\\'/g, "'").replace(/\\"/g, '"');
}

export enum Split {
  TIME,
  RANK,
  TIMES,
  POSSIBILITY,
  ACCURACY,
  AGE,
  AMOUNT,
  BETTER,
  COMPARE,
  OR,
  WHETHER,
  AM,
  WHAT,
  WHY,
  WHO,
  IS,
  REAL,
  QUESTION,
  JUXTAPOSITION,
  PREFER,
  HESITATE,
  EVEN,
  COULD,
  RANGE,
  ASSUME,
  CONDITION,
  LIKE,
  THINK,
  NEST,
  MULTIPLE,
}

export const SplitPatterns: Record<Split, { pattern: RegExp; onlyC3: boolean }> = {
  [Split.TIME]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>多久|((几多?|多[少长]|什么|啥|哪个|何)(时[候间]|个?(年|月|周|日子?|天|分钟?|小?时|钟[头点]|柱香|时辰|[毫微纳]秒))|几点)(几?何|之?[后内])?)(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.RANK]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>(第几)[次个位件名只]?)(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.TIMES]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>(((?<![一两二三四五六七八九十百千万亿这那上下哪点排报成出提命匿爆真假实大小])(几多?|多少|什么|啥|哪个|何)?(频率|无数)[次个位件名只发层人枚字章节分指大小级科]数?)|第几[次个位件名只发层人枚字章节分指大小级科]?)(之?[后内])?)(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.POSSIBILITY]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>((有多[少大])?的?([概几]率是?|可能[是性]?))|\s(chance|possib(l[ey]|ility)(\sis)?)\s)(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.ACCURACY]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>((有多[少大])?的?((准确|概|几)率是?|[准精]度)|\s?(acc(uracy)?)(\sis)?)\s?)(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.AGE]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>(岁数?)|(年龄)|(?<!\w)age(?!\w))(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.AMOUNT]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>[是有]?多少[次个位件名只发层岁人枚字章节]?|数量(?!级)|(?<![一两二三四五六七八九十百千万亿这那上下哪点排报成出提命匿爆真假实])([次个位件名只发层人枚字章节分指大小级科]数))(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.BETTER]: {
    pattern: /\s*(?<m1>[\S\s]*)\s*(?<c2>(跟|和|与|并|\s(?<![A-Za-z])(and|or|with)(?![A-Za-z])\s))\s*(?<m2>[\S\s]*?)\s*(?<![叠面傻装牛菜想提分排开小对阿科此豆死伦攀反字])比?(比[，,\s]*?哪个|比[，,\s]*?谁|哪个|谁)更?(?<c3>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.COMPARE]: {
    pattern: /\s*(?<m1>[\S\s]*)[，,\s]*?(?<![叠面傻装牛菜想提分排开小对阿科此豆死伦攀反字])(?<c2>(比(?![赛如比拟重邻值及照目价例试上下肩方对分热画划类舍武翼意义喻作基利天推量年萨勒葫芦集速时势特体]|$)较?|(\scompare(\sto)?\s)))[，,\s]*?(?<m2>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.OR]: {
    pattern: /\s*(?<c1>(不?是|要么|是要?)(选?[择中好]?了?)?)?\s*(?<m1>[\S\s]*)[，,\s]*?(?<c2>([：:]|[还就而]是|and|(?<![A-Za-z])or(?![A-Za-z])|或|或者|要么)(选?[择中好]?了?)?)\s*(?<m2>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.WHETHER]: {
    pattern: /\s*(?<m1>[^不]*(?<!爱))?\s*(?<c2>[\S\s])(?<m3>[不没])(?<c3>[\S\s])[人个件位条匹颗根辆]?\s*(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.AM]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>你是谁?)(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.WHAT]: {
    pattern: /\s*(?<m1>[\S\s]*)?\s*(?<c3>(?<!你们?|[要还哪那就])[是吃做干看玩买唱喝打听抽](([你我他她它祂]们?|别人)?谁|哪[个里处位天日]|什么歌?|啥))\s*(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.WHY]: {
    pattern: /\s*(?<m1>[\S\s]*)?\s*(?<c3>为(什么|何|啥))\s*(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.WHO]: {
    pattern: /\s*(?<m1>[\S\s]*)?\s*(?<c3>谁是|是谁)\s*(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.IS]: {
    pattern: /\s*(?<m1>[\S\s]*?)?\s*?(?<c3>(?<![要还哪那就])((?<![一等开集机领误神社公工财理附利员法动应半倒标大相生体约庙云际照而融茶酒览话赴])(会不)?会|(?<![求只总如煞假利而熟皆老要凡既为倒先可])(是不)?是|(?<![摘纲刚重指打务六八提])(要不)?要|(可不)?可以)吗?|\sis\s)\s*?(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.REAL]: {
    pattern: /\s*(?<m1>[\S\s]*?)?\s*?(?<c3>真的吗?|\sreal(ly)?\s)\s*?(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.QUESTION]: {
    pattern: /\s*(?<m1>[\S\s]*?)?\s*?(?<c3>吗[?？]?)\s*?(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.JUXTAPOSITION]: {
    pattern: /\s*(?<c1>(不仅|一边|一方面|有时|既)(选?[择中好]?了?)?)\s*(?<m1>[\S\s]*)[，,\s]*?(?<c2>(而且|一边|一方面|有时|又)(选?[择中好]?了?)?)\s*(?<m2>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.PREFER]: {
    pattern: /\s*(?<c1>(宁[可愿]|尽管)(选?[择中好]?了?)?)?\s*(?<m1>[\S\s]*)[，,\s]*?(?<c2>(也不[要想]?(选?[择中好]?了?)?))\s*(?<m2>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.HESITATE]: {
    pattern: /\s*(?<c1>(与其|虽然|尽管)(选?[择中好]?了?)?)?\s*(?<m1>[\S\s]*)[，,\s]*?(?<c2>(还?不如|比不上|但是|可是|然而|却)(选?[择中好]?了?)?)\s*(?<m2>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.EVEN]: {
    pattern: /\s*(?<c1>(即使|\seven\sif\s)((选?[择中好]?了?)?[择中好])?)?\s*(?<m1>[\S\s]*)[，,\s]*?([你我他她它祂]们?|别人)?(?<c2>([也还]会?)(选?[择中好]?了?)?)\s*(?<m2>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.COULD]: {
    pattern: /\s*(?<m1>[\S\s]*?)\s*?(?<c2>不)?\s*?(?<c3>([想要]|想要|能[够否]?|可以|应该))\s*(?<m2>[\S\s]*)/i,
    onlyC3: true,
  },
  [Split.RANGE]: {
    pattern: /(?<m1>[大多高等小少低]于(等于)?|约等于?|超过|不足|[><]=?|[＞＜≥≤≡≈]|\s(more|less)\s(than)?\s)(?<c3>[\S\s]*?)?\s*(?<m2>\d+)/i,
    onlyC3: false,
  },
  [Split.ASSUME]: {
    pattern: /\s*(?<c1>(如果|假使|假设|要是|\s(if|assume)\s))\s*(?<m1>[\S\s]*?)[，,\s]*?(?<c2>(那?([你我他她它祂]们?|别人)?[会要想就便么才])|([想要]|想要|能够?|可以))\s*(?<m2>([你我他她它祂]们?|别人)?[\\S\\s]*)/i,
    onlyC3: false,
  },
  [Split.CONDITION]: {
    pattern: /\s*(?<c1>(只要|只有|无论|不管|忽略|忽视|不(去)?想|\sif\s))\s*(?<m1>[\S\s]*)[，,\s]*?(?<c2>(([你我他她它祂]们?|别人)?([就才都也还]能?|能)(够|是|可以)?|反正|依然))\s*(?<m2>[\S\s]*)/i,
    onlyC3: false,
  },
  [Split.LIKE]: {
    pattern: /\s*(?<m1>[\S\s]*?)?\s*?(?<c3>喜欢|((?<![可怜恋做被性])爱)|\s((dis)?like|love)\s)\s*?(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.THINK]: {
    pattern: /\s*(?<m1>[\S\s]*)?\s*(?<c2>[\S\s])(?<c3>(觉得|认为))\s*(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.NEST]: {
    pattern: /(?<m1>[\S\s]*)?(?<c3>[!！1]d)(?<m2>[\S\s]*)?/i,
    onlyC3: true,
  },
  [Split.MULTIPLE]: {
    pattern: /(?<m1>[\S\s]*)?(还是|或者?是?|与|\s+)(?<m2>[\S\s]*)?/i,
    onlyC3: false,
  },
};

export function isPerfectMatch(m: RegExpMatchArray | null, hasC3: boolean, onlyC3: boolean): boolean {
  if (!m) {
    return false;
  }

  const m1 = !!m.groups?.m1;
  const m2 = !!m.groups?.m2;
  const c3 = hasC3 && !!m.groups?.c3;

  if (onlyC3) return c3;
  if (hasC3) return m1 && m2 && c3;
  return m1 && m2;
}


/**
 * 多重选择
 *
 * @param str 字符串
 * @return 随机分配的结果
 * @throws DiceException 不知道该选什么
 */
export function chooseMultiple(str: string | null): string {
  let s = str || "";
  const m =
    /(?<m1>[\S\s]*)(?<c3>((?<![要还哪那就])是|喜欢|属于))(?<m2>[\S\s]*)?/i.exec(s);

  if (m && m.groups?.m2 != null) {
    s = m.groups.m2;
  }

  const strings = s.split(
    /还是|\s*(?<![A-Za-z])or(?![A-Za-z])\s*|或者?是?|[是或与,，.。/?!、？！:：]|\s+/
  ).filter(it => it.trim() !== '');

  if (strings.length === 0 || strings.length === 1) {
    throw DiceException.NotMatched();
  }

  // 多选择模式的去重
  const stringSet = new Set<string>();
  let same = 0;

  for (const l of strings) {
    if (!stringSet.has(l)) {
      stringSet.add(l);
    } else {
      same++;
    }
  }

  if (same === strings.length - 1 && strings.length > 1) { // 只有多个全部一样才抛错
    if (getRandom(100) < 30) {
      throw DiceException.NoDifferenceEveryday(strings[0], strings[0]);
    } else {
      throw DiceException.NoDifference();
    }
  }

  const r = Math.floor(getRandom(strings.length) - 1);
  return `当然${changeCase(strings[r])}啦！`;
}

/**
 * 超级复杂™的语言学选择器
 *
 * @param str 输入含有比较关系的文本
 * @return 返回随机一个子项
 * @throws DiceException 错
 */
export function compare(str: string | null): string {
  const s = transferApostrophe(str);

  const result = getRandom();
  let boundary: number;
  let left = "";
  let right = "";
  let num = 0.0;
  let iis = "";
  let not = "";
  let leftFormat: string;
  let rightFormat: string;
  let split: Split | null = null;

  for (const spKey in SplitPatterns) {
    const splitKey = parseInt(spKey) as Split;
    const sp = SplitPatterns[splitKey];
    const hasC3 = splitKey === Split.BETTER || sp.onlyC3;
    const matcher = sp.pattern.exec(s);

    if (isPerfectMatch(matcher, hasC3, sp.onlyC3)) {
      split = splitKey;

      left = matcher?.groups?.m1 || "";
      right = matcher?.groups?.m2 || "";

      switch (split) {
        case Split.RANGE: {
          const range = parseInt(right) || 100;
          if (range <= 0) {
            throw DiceException.TooSmall();
          } else if (range <= 100) {
            num = getRandom(100);
          } else if (range <= 10000) {
            num = getRandom(10000);
          } else if (range <= 1000000) {
            num = getRandom(1000000);
          } else {
            throw DiceException.TooLarge();
          }
          break;
        }

        case Split.AMOUNT:
        case Split.AGE:
          num = getRandom(120);
          break;

        case Split.TIME: {
          const c3 = matcher?.groups?.c3?.trim() || "";

          const cannot = [
            "不可能。",
            "永远不会。",
            "等鸡啄完了米，狗舔完了面，火烧断了锁...",
          ];

          if (getRandom(100) <= 4) {
            return cannot[Math.floor(getRandom(cannot.length) - 1)];
          }

          if (c3.includes("年")) {
            num = getRandom(100);
            iis = "年";
          } else if (c3.includes("月")) {
            num = getRandom(12);
            iis = "个月";
          } else if (c3.includes("周")) {
            num = getRandom(52);
            iis = "周";
          } else if (c3.includes("日") || c3.includes("天")) {
            num = getRandom(30);
            iis = "天";
          } else if (c3.includes("时辰")) {
            num = getRandom(12);
            iis = "时辰";
          } else if ((c3.includes("时") && !(c3.includes("时候") || c3.includes("时间"))) || c3.includes(
              "小时"
            )) {
            num = getRandom(24);
            iis = "小时";
          } else if (c3.includes("点")) {
            num = getRandom(24);
            iis = "点";
          } else if (c3.includes("柱香")) {
            num = getRandom(48);
            iis = "柱香";
          } else if (c3.includes("分")) {
            num = getRandom(60);
            iis = "分钟";
          } else if (c3.includes("毫秒")) {
            num = getRandom(1000);
            iis = "毫秒";
          } else if (c3.includes("微秒")) {
            num = getRandom(1000000);
            iis = "微秒";
          } else if (c3.includes("纳秒")) {
            num = getRandom(100000000);
            iis = "纳秒";
          } else if (c3.includes("秒")) {
            num = getRandom(60);
            iis = "秒";
          } else {
            const soon = [
              "马上。",
              "立刻。",
              "就现在。",
              "很久很久。",
              "一会儿。",
              "过不了多久。",
            ];

            if (getRandom(100) <= 4) {
              return soon[Math.floor(getRandom(soon.length) - 1)];
            }

            const timeList = ["年", "个月", "周", "天", "小时", "分钟", "秒"];
            num = getRandom(100);
            iis = timeList[Math.floor(getRandom(timeList.length) - 1)];
          }
          break;
        }

        case Split.RANK: {
          num = Math.floor(16.0 * (Math.pow(getRandom(), 2.0))) + 1.0;
          const i = getRandom();
          if (i > 0.98) num = 4294967295.0;
          else if (i > 0.95) num = 114514.0;
          iis = "第";
          break;
        }

        case Split.TIMES: {
          const c3 = matcher?.groups?.c3?.trim() || "";
          num = getRandom(100);
          const i = getRandom();
          if (i > 0.98) num = 2147483647.0;
          else if (i > 0.95) num = 114514.0;
          iis = c3.match(/[次个位件名只发层岁人枚字章节]/) ? c3 : "次";
          break;
        }

        case Split.WHETHER: {
          iis = matcher?.groups?.c3 || "";
          not = matcher?.groups?.m3 || "";
          const is2 = matcher?.groups?.c2 || "";
          if (is2 !== iis) {
            split = null;
            continue;
          }
          break;
        }

        case Split.COULD: {
          iis = matcher?.groups?.c3 || "";
          not = "不";
          if (!left) left = "...";
          if (!right) right = "";
          break;
        }

        case Split.POSSIBILITY: {
          num = (Math.round(getRandom(1) * 10800.0) / 100.0) - 4.0;
          iis = "";
          if (num >= 102.0) {
            num = 101.0;
            iis = "0000";
          }
          if (num >= 100) num = 100.0;
          if (num <= 0) num = 0.0;
          break;
        }

        case Split.ACCURACY: {
          num = getRandom() < 0.9 ? Math.round(getRandom(1) * 1400.0) / 100.0 + 90.0 : Math.sqrt(getRandom(1)) * 9000.0 / 100.0;
          iis = "";
          if (num >= 100.0) num = 100.0;
          if (num <= 0.0) num = 0.0;
          break;
        }

        case Split.LIKE:
          iis = matcher?.groups?.c3 || "";
          break;

        case Split.IS: {
          iis = matcher?.groups?.c3 || "";
          if (!right) return "我怎么知道。";
          break;
        }

        case Split.REAL:
        case Split.QUESTION: {
          if (getRandom(100) <= 10) return "我怎么知道。";
          break;
        }

        default:
          break;
      }

      if (left && right && num === 0.0) {
        const l = left.toLowerCase().trim();
        const r = right.toLowerCase().trim();

        const isSame = (l === r) || ((l.includes(r) || r.includes(l)) && l.length >= 3 && r.length >= 3);

        if (isSame) {
          if (getRandom(100) < 30) {
            throw DiceException.NoDifferenceEveryday(left.trim(), right.trim());
          } else {
            throw DiceException.NoDifference();
          }
        }
      }

      break;
    }
  }

  if (split != null && (SplitPatterns[split].onlyC3 || (left.trim() !== "" && right.trim() !== ""))) {
    // 设置左侧格式
    switch (split) {
      case Split.MULTIPLE:
        leftFormat = "要我选的话，我觉得，%s。";
        break;
      case Split.NEST:
        leftFormat = "你搁这搁这呢？";
        break;
      case Split.AM:
        leftFormat = "我是 Yumu 机器人。";
        break;
      case Split.POSSIBILITY:
        leftFormat = "概率是：%.2f%s%%";
        break;
      case Split.ACCURACY:
        leftFormat = "准确率是：%.2f%s%%";
        break;
      case Split.RANGE:
      case Split.AMOUNT:
        leftFormat = "您许愿的结果是：%.0f。";
        break;
      case Split.AGE:
        leftFormat = "您许愿的岁数是：%.0f。";
        break;
      case Split.TIME:
      case Split.TIMES:
        leftFormat = "您许愿的结果是：%.0f %s。";
        break;
      case Split.RANK:
        leftFormat = "您许愿的结果是：%s %.0f。";
        break;
      case Split.WHAT:
      case Split.WHY:
      case Split.WHO:
        leftFormat = "我怎么知道。我又不是 deepseek。";
        break;
      case Split.REAL:
        leftFormat = "我觉得，是真的。";
        break;
      case Split.BETTER:
      case Split.COMPARE:
      case Split.OR:
      case Split.JUXTAPOSITION:
      case Split.PREFER:
      case Split.HESITATE:
      case Split.EVEN:
        leftFormat = "当然%s啦！";
        break;
      case Split.ASSUME:
      case Split.LIKE:
      case Split.IS:
      case Split.QUESTION:
        leftFormat = "%s。";
        break;
      case Split.COULD:
      case Split.WHETHER:
        leftFormat = "%s%s%s。";
        break;
      case Split.CONDITION:
        leftFormat = "是的。";
        break;
      case Split.THINK:
        leftFormat = "嗯。";
        break;
      default:
        leftFormat = "%s。";
        break;
    }

    // 设置右侧格式
    switch (split) {
      case Split.MULTIPLE:
        rightFormat = "要我选的话，我觉得，%s。";
        break;
      case Split.NEST:
        rightFormat = "你搁这搁这呢？";
        break;
      case Split.AM:
        rightFormat = "别问了，我也想知道自己是谁。";
        break;
      case Split.POSSIBILITY:
        rightFormat = "概率是：%.2f%s%%";
        break;
      case Split.ACCURACY:
        rightFormat = "准确率是：%.2f%s%%";
        break;
      case Split.RANGE:
      case Split.AMOUNT:
        rightFormat = "您许愿的结果是：%.0f。";
        break;
      case Split.AGE:
        rightFormat = "您许愿的岁数是：%.0f。";
        break;
      case Split.TIME:
      case Split.TIMES:
        rightFormat = "您许愿的结果是：%.0f %s。";
        break;
      case Split.RANK:
        rightFormat = "您许愿的结果是：%s %.0f。";
        break;
      case Split.WHAT:
        rightFormat = "是哈基米。\n整个宇宙都是哈基米组成的。";
        break;
      case Split.WHY:
        rightFormat = "你不如去问问神奇海螺？";
        break;
      case Split.WHO:
        rightFormat = "我知道，芝士雪豹。";
        break;
      case Split.REAL:
        rightFormat = "我觉得，是假的。";
        break;
      case Split.BETTER:
      case Split.OR:
      case Split.JUXTAPOSITION:
      case Split.PREFER:
      case Split.HESITATE:
      case Split.COMPARE:
        rightFormat = "当然%s啦！";
        break;
      case Split.EVEN:
        rightFormat = "当然不%s啦！";
        break;
      case Split.ASSUME:
        rightFormat = "没有如果。";
        break;
      case Split.COULD:
      case Split.WHETHER:
        rightFormat = "%s%s%s%s。";
        break;
      case Split.CONDITION:
        rightFormat = "不是。";
        break;
      case Split.LIKE:
      case Split.IS:
        rightFormat = "不%s。";
        break;
      case Split.THINK:
        rightFormat = "也没有吧。";
        break;
      case Split.QUESTION:
        rightFormat = "不。";
        break;
      default:
        rightFormat = "%s。";
        break;
    }

    // 设置边界值
    boundary = 0.5; // Default
    switch (split) {
      case Split.PREFER:
        boundary = 0.35;
        break;
      case Split.HESITATE:
        boundary = 0.65;
        break;
      case Split.EVEN:
        boundary = 0.7;
        break;
      case Split.WHAT:
      case Split.AM:
      case Split.WHY:
        boundary = 0.8;
        break;
    }
  } else {
    try {
      return chooseMultiple(s);
    } catch (e) {
      if (e instanceof DiceException) {
        throw e;
      }
      // log.info(`扔骰子：${s} 匹配失败。`); // Need a logger
      throw DiceException.NotMatched();
    }
  }

  left = changeCase(left);
  right = changeCase(right);
  iis = changeCase(iis);

  const lm = /(?<m1>[\S\s]*)?(还是|或者?是?|与|\s+)(?<m2>[\S\s]*)?/i.exec(left);
  const rm = /(?<m1>[\S\s]*)?(还是|或者?是?|与|\s+)(?<m2>[\S\s]*)?/i.exec(right);

  const leftHas = lm && (!!lm.groups?.m1 || !!lm.groups?.m2);
  const rightHas = rm && (!!rm.groups?.m1 || !!rm.groups?.m2);

  if (split !== Split.TIME && split !== Split.COULD && (leftHas || rightHas)) {
    return chooseMultiple(s);
  }

  if (result < boundary - 0.002) {
    switch (split) {
      case Split.AM: {
        if (right.trim()) {
          const botMatcher = /((\s*Yumu\s*)|雨沐)\s*(机器人|Bot)?/i.exec(right);
          if (botMatcher) {
            if (getRandom(100) < 50) {
              return `不不不。你才是${right}。`;
            } else {
              return "我还以为你不知道呢。";
            }
          } else {
            return `${leftFormat}不是${right}。`;
          }
        }
        return leftFormat;
      }

      case Split.WHAT:
      case Split.WHY:
      case Split.WHO:
      case Split.CONDITION:
      case Split.THINK:
      case Split.NEST:
      case Split.REAL:
        return leftFormat;

      case Split.RANGE:
      case Split.AMOUNT:
      case Split.AGE:
        return leftFormat.replace('%.0f', num.toFixed(0));

      case Split.TIME:
      case Split.TIMES:
        return leftFormat.replace('%.0f', num.toFixed(0)).replace('%s', iis);
      
      case Split.POSSIBILITY:
      case Split.ACCURACY:
        return leftFormat.replace('%.2f', num.toFixed(2)).replace('%s', iis);

      case Split.RANK:
        return leftFormat.replace('%s', iis).replace('%.0f', num.toFixed(0));

      case Split.BETTER:
      case Split.COMPARE:
      case Split.JUXTAPOSITION:
      case Split.PREFER:
      case Split.HESITATE:
      case Split.QUESTION:
      case Split.MULTIPLE:
        return leftFormat.replace('%s', left);

      case Split.ASSUME:
      case Split.EVEN:
        return leftFormat.replace('%s', right);

      case Split.COULD:
      case Split.WHETHER:
        return leftFormat.replace(/%s/g, (match, offset) => {
          if (offset === leftFormat.indexOf('%s')) return left;
          if (offset === leftFormat.indexOf('%s', leftFormat.indexOf('%s') + 1)) return iis;
          return right;
        });

      case Split.LIKE:
      case Split.IS:
        return leftFormat.replace('%s', iis);

      case Split.OR: {
        if (left.includes("是")) {
          return `我觉得，${left}。`;
        }
        return leftFormat.replace('%s', left);
      }
    }
  } else if (result > boundary + 0.002) {
    switch (split) {
      case Split.WHAT:
      case Split.WHY:
      case Split.WHO:
      case Split.AM:
      case Split.ASSUME:
      case Split.CONDITION:
      case Split.THINK:
      case Split.NEST:
      case Split.REAL:
      case Split.QUESTION:
        return rightFormat;

      case Split.RANGE:
      case Split.AMOUNT:
      case Split.AGE:
        return rightFormat.replace('%.0f', num.toFixed(0));

      case Split.TIME:
      case Split.TIMES:
        return rightFormat.replace('%.0f', num.toFixed(0)).replace('%s', iis);
      
      case Split.POSSIBILITY:
      case Split.ACCURACY:
        return rightFormat.replace('%.2f', num.toFixed(2)).replace('%s', iis);

      case Split.RANK:
        return rightFormat.replace('%s', iis).replace('%.0f', num.toFixed(0));

      case Split.BETTER:
      case Split.COMPARE:
      case Split.JUXTAPOSITION:
      case Split.PREFER:
      case Split.HESITATE:
      case Split.EVEN:
      case Split.MULTIPLE:
        return rightFormat.replace('%s', right);

      case Split.OR: {
        if (right.includes("是")) {
          return `我觉得，${right}。`;
        }
        return rightFormat.replace('%s', right);
      }

      case Split.COULD:
      case Split.WHETHER:
        return rightFormat.replace(/%s/g, (match, offset) => {
          const indices = [];
          let index = rightFormat.indexOf('%s');
          while (index !== -1) {
            indices.push(index);
            index = rightFormat.indexOf('%s', index + 1);
          }
          const currentIndex = indices.indexOf(offset);
          if (currentIndex === 0) return left;
          if (currentIndex === 1) return not;
          if (currentIndex === 2) return iis;
          return right;
        });

      case Split.LIKE:
      case Split.IS:
        return rightFormat.replace('%s', iis);
    }
  } else {
    if (result > boundary + 0.001) {
      throw DiceException.All();
    } else {
      throw DiceException.Tie();
    }
  }
  throw DiceException.Unexpected();
}