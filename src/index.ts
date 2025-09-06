import { Context, Schema, h } from 'koishi';
import { DiceParam, DiceException, getRandom, compare } from './utils';

export const name = 'yumu-dice';

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

// 指令正则表达式
const DICE_PATTERN = /^(?:(?<dice>\d+)d)?(?<number>\d+)?(?<text>.*)$/i;
const EASTER_WHAT = /你问我，我问谁？/;
const EASTER_AYACHI_NENE = /(绫地宁宁|ayachi.*nene)/i;

/**
 * 判断是否处理该消息并解析参数
 */
function isHandle(messageText: string): { shouldHandle: boolean; param?: DiceParam } {
  // 检查彩蛋
  if (EASTER_WHAT.test(messageText)) {
    throw DiceException.ForWhat();
  }

  if (EASTER_AYACHI_NENE.test(messageText)) {
    throw DiceException.JerkOff();
  }

  const match = DICE_PATTERN.exec(messageText.trim());
  if (!match) return { shouldHandle: false };

  const { dice, number, text } = match.groups || {};

  if (text && text.trim()) {
    // 如果有文本但骰子数大于1，忽略
    if (dice && parseInt(dice) > 1) {
      return { shouldHandle: false };
    } else if (number) {
      return {
        shouldHandle: true,
        param: { dice: null, number: null, text: (number + text).trim() }
      };
    } else if (/^[0-9]+\.?[0-9]*$/.test(text.trim())) {
      // 纯数字，如 "!roll 4"
      return {
        shouldHandle: true,
        param: { dice: 1, number: parseInt(text.trim()) || 100, text: null }
      };
    } else {
      return {
        shouldHandle: true,
        param: { dice: null, number: null, text: text.trim() }
      };
    }
  } else if (dice) {
    const d = parseInt(dice);
    if (d < 1) {
      throw DiceException.TooSmall();
    } else if (d > 100) {
      throw DiceException.DiceTooMany(d);
    }

    const n = number ? (() => {
      if (number.includes('-')) {
        throw DiceException.Negative();
      }
      const parsed = parseInt(number);
      if (isNaN(parsed)) {
        throw DiceException.Exceed();
      }
      return parsed;
    })() : 100;

    return {
      shouldHandle: true,
      param: { dice: d, number: n, text: null }
    };
  } else if (number) {
    const n = parseInt(number);
    if (isNaN(n)) {
      throw DiceException.Exceed();
    }
    if (n < 0) {
      throw DiceException.Negative();
    }

    return {
      shouldHandle: true,
      param: { dice: 1, number: n, text: null }
    };
  } else {
    return {
      shouldHandle: true,
      param: { dice: 1, number: 100, text: null }
    };
  }
}

/**
 * 处理骰子消息
 */
function handleMessage(param: DiceParam): string {
  try {
    if (param.number !== null) {
      if (param.number >= Number.MAX_SAFE_INTEGER) {
        throw DiceException.TooLarge();
      }

      if (param.number < 1) {
        throw DiceException.TooSmall();
      }

      // 单次匹配
      if (param.number === 1) {
        const r = getRandom(param.number);
        const format = r < 1 ? r.toFixed(2) : r.toFixed(0);
        
        // 容易被识别成 QQ 号的数字需要延时撤回（在实际应用中可以通过其他方式处理）
        if (r >= 1000000 && r < 1000000000) {
          return `${format} (此消息将在60秒后自动撤回)`;
        }
        return format;
      } else {
        // 多次投掷
        const results: string[] = [];
        const diceCount = param.dice || 1;
        
        for (let i = 0; i < diceCount; i++) {
          const r = getRandom(param.number);
          const format = r < 1 ? r.toFixed(2) : r.toFixed(0);
          results.push(format);
        }
        
        return results.join(', ');
      }
    }

    if (param.text && param.text.trim()) {
      const message = compare(param.text);
      
      // 检查是否被和谐
      const harmonyPattern = /○|(\[和谐])/;
      if (harmonyPattern.test(message)) {
        return `${message} (此消息将在60秒后自动撤回)`;
      } else {
        return message;
      }
    }

    return '未知错误';
  } catch (e) {
    if (e instanceof DiceException) {
      throw e;
    }
    console.error('扔骰子：处理失败', e);
    throw DiceException.Unexpected();
  }
}

export function apply(ctx: Context) {
  ctx.command('dice [expression:text]', '掷骰子和进行趣味互动')
    .alias('d', 'roll')
    .action(({ session }, expression) => {
      if (!expression) {
        return '请输入掷骰子表达式或互动文本。\n例如：\n- dice 1d100 (投掷1个100面骰子)\n- dice 3d6 (投掷3个6面骰子)\n- dice 选A还是B (智能选择)\n- dice 今天天气怎么样 (趣味互动)';
      }

      try {
        const { shouldHandle, param } = isHandle(expression);
        
        if (!shouldHandle || !param) {
          return '无法理解您的输入，请检查格式。';
        }

        return handleMessage(param);
      } catch (e) {
        if (e instanceof DiceException) {
          return e.message;
        }
        console.error('Dice plugin error:', e);
        return '发生了未知错误。';
      }
    });
}