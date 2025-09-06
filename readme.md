# koishi-plugin-yumu-dice

一个功能强大的 Koishi 插件，提供骰子投掷和智能中文语言交互功能。本插件从 DiceService.kt 移植而来，具有复杂的自然语言处理能力。

## 功能特性

### 🎲 骰子投掷
- 支持标准骰子语法：`1d100`、`3d6`、`20d20` 等
- 支持简化语法：`d100`、`100`
- 自动处理超大数字和异常情况

### 🤖 智能语言交互
- **选择决策**：`选A还是B`、`吃苹果还是香蕉`
- **时间询问**：`多久`、`几点`、`多少年`
- **概率计算**：`概率是多少`、`可能性`
- **是否判断**：`今天会下雨吗`、`你喜欢编程吗`
- **比较分析**：`A和B哪个更好`、`A比B厉害吗`

### 🎭 趣味功能
- 智能人称转换（你 ↔ 我）
- 语气助词处理
- 内容和谐化
- 特殊彩蛋和异常处理

## 安装

```bash
npm install koishi-plugin-yumu-dice
```

## 使用方法

### 基本命令

```
dice [表达式]    # 主命令
d [表达式]       # 简写
roll [表达式]    # 别名
```

### 使用示例

#### 骰子投掷
```
dice 1d100      # 投掷1个100面骰子
dice 3d6        # 投掷3个6面骰子
dice d20        # 投掷1个20面骰子
dice 100        # 投掷1个100面骰子
```

#### 智能选择
```
dice 选A还是B
dice 今天吃什么
dice 要不要去看电影
dice 学习还是游戏
```

#### 时间相关
```
dice 多久
dice 几点了
dice 多少年后
dice 什么时候
```

#### 概率询问
```
dice 概率是多少
dice 可能性有多大
dice 准确率
```

#### 是否判断
```
dice 今天会下雨吗
dice 你喜欢编程吗
dice 这个想法好吗
```

## 配置

本插件无需额外配置，安装后即可使用。

## 技术特性

- **TypeScript** 编写，类型安全
- **正则表达式** 驱动的语言解析
- **智能匹配** 算法，支持复杂中文语法
- **异常处理** 完善，用户体验友好
- **性能优化** 高效的文本处理

## API

### 主要函数

#### `getRandom(range?: number): number`
生成随机数
- `range = 0`: 返回 0-1 的小数
- `range = 1`: 返回 1
- `range > 1`: 返回 1-range 的整数

#### `compare(text: string): string`
智能文本分析和回复生成

#### `DiceException`
异常处理类，包含各种错误类型

## 开发

```bash
# 克隆项目
git clone https://github.com/your-username/koishi-plugin-yumu-dice.git

# 安装依赖
npm install

# 编译
npm run build

# 测试
npm test
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 更新日志

### v1.0.0
- 🎉 首次发布
- ✅ 完整移植 DiceService.kt 功能
- ✅ 支持复杂中文语言处理
- ✅ 完善的异常处理机制
- ✅ TypeScript 类型支持

## 致谢

本插件移植自原始的 DiceService.kt，感谢原作者的精彩设计。

---

**Made with ❤️ by Yumu Team**