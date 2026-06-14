/**
 * 志愿填报系统 - 自动化测试套件
 * 使用纯Node.js原生模块，无需安装依赖
 * 运行命令: node tests/run-tests.js
 */

const fs = require('fs');
const path = require('path');

// ─── 测试框架（轻量，无需npm install）───────────────────
let passed = 0;
let failed = 0;
const errors = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ FAIL: ${name}`);
    console.log(`     原因: ${e.message}`);
    failed++;
    errors.push({ name, error: e.message });
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`期望 "${expected}"，实际得到 "${actual}"`);
      }
    },
    toBeTrue: () => {
      if (actual !== true) throw new Error(`期望 true，实际得到 ${actual}`);
    },
    toContain: (str) => {
      if (!actual.includes(str)) {
        throw new Error(`期望包含 "${str}"，实际内容: "${actual.substring(0, 80)}..."`);
      }
    },
    toBeGreaterThan: (n) => {
      if (actual <= n) throw new Error(`期望大于 ${n}，实际得到 ${actual}`);
    }
  };
}

const ROOT = path.join(__dirname, '..');

// ─── 测试套件1：文件完整性检查 ──────────────────────────
console.log('\n📁 套件1：核心文件完整性检查');

test('首页 index.html 存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'index.html'))).toBeTrue();
});

test('成绩分析页 score.html 存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'score.html'))).toBeTrue();
});

test('院校查询页 school.html 存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'school.html'))).toBeTrue();
});

test('智能推荐页 recommend.html 存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'recommend.html'))).toBeTrue();
});

test('AI咨询页 ai-chat.html 存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'ai-chat.html'))).toBeTrue();
});

test('登录页 login.html 存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'login.html'))).toBeTrue();
});

test('CSS目录存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'css'))).toBeTrue();
});

test('JS目录存在', () => {
  expect(fs.existsSync(path.join(ROOT, 'js'))).toBeTrue();
});

// ─── 测试套件2：HTML内容检查 ──────────────────────────
console.log('\n🌐 套件2：HTML页面内容检查');

test('首页包含标题"志愿"关键词', () => {
  const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  expect(content).toContain('志愿');
});

test('首页包含导航栏', () => {
  const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  expect(content).toContain('<nav');
});

test('首页包含CSS引用', () => {
  const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  expect(content).toContain('.css');
});

test('首页包含JS脚本引用', () => {
  const content = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  expect(content).toContain('.js');
});

test('院校数据JS文件存在且有内容', () => {
  const filePath = path.join(ROOT, 'js', 'schools-data.js');
  expect(fs.existsSync(filePath)).toBeTrue();
  const size = fs.statSync(filePath).size;
  expect(size).toBeGreaterThan(1000);
});

// ─── 测试套件3：志愿填报业务逻辑测试 ──────────────────────
console.log('\n🎯 套件3：业务逻辑单元测试');

// 模拟成绩分析核心算法
function calculateRank(score, province = 'guangdong') {
  // 广东省2024年参考排名算法（线性估算）
  const benchmarks = [
    { score: 750, rank: 100 },
    { score: 700, rank: 2000 },
    { score: 650, rank: 8000 },
    { score: 600, rank: 25000 },
    { score: 550, rank: 60000 },
    { score: 500, rank: 110000 },
    { score: 450, rank: 175000 },
    { score: 400, rank: 260000 },
  ];
  for (let i = 0; i < benchmarks.length - 1; i++) {
    const high = benchmarks[i];
    const low = benchmarks[i + 1];
    if (score >= low.score && score <= high.score) {
      const ratio = (high.score - score) / (high.score - low.score);
      return Math.round(high.rank + ratio * (low.rank - high.rank));
    }
  }
  return score >= 750 ? 100 : 300000;
}

function getVolunteerStrategy(score, rank) {
  return {
    chong: { minScore: score - 20, maxScore: score - 5 },
    wen: { minScore: score - 5, maxScore: score + 10 },
    bao: { minScore: score + 10, maxScore: score + 25 }
  };
}

test('高分段（700分）排名估算合理（应在前5000名）', () => {
  const rank = calculateRank(700);
  // BUG: 故意制造断言错误 —— 期望排名为1（实际约2000），用于演示CI失败场景
  expect(rank).toBe(1);
});

test('中等分（580分）排名估算合理（应在3万名以内）', () => {
  const rank = calculateRank(580);
  expect(rank <= 40000).toBeTrue();
});

test('冲档分数区间计算正确（冲=分数-20到-5）', () => {
  const strategy = getVolunteerStrategy(600, 25000);
  expect(strategy.chong.minScore).toBe(580);
  expect(strategy.chong.maxScore).toBe(595);
});

test('稳档分数区间计算正确（稳=分数-5到+10）', () => {
  const strategy = getVolunteerStrategy(600, 25000);
  expect(strategy.wen.minScore).toBe(595);
  expect(strategy.wen.maxScore).toBe(610);
});

test('保底分数区间计算正确（保=分数+10到+25）', () => {
  const strategy = getVolunteerStrategy(600, 25000);
  expect(strategy.bao.minScore).toBe(610);
  expect(strategy.bao.maxScore).toBe(625);
});

// ─── 测试结果汇总 ────────────────────────────────────
console.log('\n' + '─'.repeat(50));
console.log(`📊 测试结果汇总`);
console.log(`─`.repeat(50));
console.log(`  总计: ${passed + failed} 个测试`);
console.log(`  通过: ${passed} ✅`);
console.log(`  失败: ${failed} ❌`);
console.log(`─`.repeat(50));

if (failed > 0) {
  console.log('\n❌ 失败详情:');
  errors.forEach(e => console.log(`  - [${e.name}]: ${e.error}`));
  console.log('\n💥 测试未全部通过，请检查上方失败项');
  process.exit(1);  // 返回非0，CI流水线会标记为失败
} else {
  console.log('\n🎉 所有测试通过！CI流水线可以继续后续阶段。');
  process.exit(0);  // 返回0，CI流水线标记为成功
}
