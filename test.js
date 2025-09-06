const { DiceException, getRandom, compare } = require('./lib/utils');

console.log('=== 测试 Yumu Dice 插件功能 ===\n');

// 测试随机数生成
console.log('1. 测试随机数生成:');
console.log('getRandom():', getRandom());
console.log('getRandom(6):', getRandom(6));
console.log('getRandom(100):', getRandom(100));
console.log();

// 测试简单选择
console.log('2. 测试简单选择:');
try {
  console.log('选A还是B:', compare('选A还是B'));
  console.log('吃苹果还是香蕉:', compare('吃苹果还是香蕉'));
  console.log('今天天气怎么样:', compare('今天天气怎么样'));
} catch (e) {
  console.log('选择测试错误:', e.message);
}
console.log();

// 测试时间相关
console.log('3. 测试时间相关:');
try {
  console.log('多久:', compare('多久'));
  console.log('几点:', compare('几点'));
  console.log('多少年:', compare('多少年'));
} catch (e) {
  console.log('时间测试错误:', e.message);
}
console.log();

// 测试概率
console.log('4. 测试概率:');
try {
  console.log('概率是多少:', compare('概率是多少'));
  console.log('可能性:', compare('可能性'));
} catch (e) {
  console.log('概率测试错误:', e.message);
}
console.log();

// 测试是否问题
console.log('5. 测试是否问题:');
try {
  console.log('今天会下雨吗:', compare('今天会下雨吗'));
  console.log('你喜欢编程吗:', compare('你喜欢编程吗'));
} catch (e) {
  console.log('是否测试错误:', e.message);
}
console.log();

// 测试异常
console.log('6. 测试异常处理:');
try {
  throw DiceException.TooLarge();
} catch (e) {
  console.log('异常测试:', e.message);
}

console.log('\n=== 测试完成 ===');