/**
 * 故意制造失败的测试文件（用于任务四演示）
 * 运行命令: node tests/run-tests-broken.js
 * 
 * 用途：演示CI流水线检测到测试失败时的行为
 */

const fs = require('fs');
const path = require('path');

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
    }
  };
}

const ROOT = path.join(__dirname, '..');

console.log('\n💥 故意失败的测试（用于演示CI失败场景）\n');

// ❌ 故意写错的断言 —— 700分排名不可能是1名
test('[故意失败] 700分排名是第1名（断言错误）', () => {
  function calculateRank(score) {
    if (score >= 700) return 2000; // 实际返回2000
    return 50000;
  }
  const rank = calculateRank(700);
  expect(rank).toBe(1); // 故意断言成1，必然失败
});

// ❌ 故意检查不存在的文件
test('[故意失败] 检查不存在的文件 backend.jar', () => {
  const exists = fs.existsSync(path.join(ROOT, 'backend.jar'));
  expect(exists).toBeTrue(); // 该文件不存在，必然失败
});

// ✅ 这个能过
test('[正常] 首页文件存在', () => {
  const exists = fs.existsSync(path.join(ROOT, 'index.html'));
  expect(exists).toBeTrue();
});

console.log('\n' + '─'.repeat(50));
console.log(`测试结果: 通过 ${passed}，失败 ${failed}`);
console.log('─'.repeat(50));

if (failed > 0) {
  console.log('\n💥 存在失败的测试！CI流水线将标记此次构建为 FAILED');
  console.log('   后续的"构建打包"阶段将被跳过（质量门禁生效）');
  process.exit(1);
}
