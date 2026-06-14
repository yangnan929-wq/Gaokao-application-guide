// 全局公共 JS

// 导航栏滚动效果
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
});

// 移动端菜单
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks?.classList.toggle('mobile-open');
    navActions?.classList.toggle('mobile-open');
  });
}

// 数字动画计数器
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

// Intersection Observer 触发计数动画
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const target = parseInt(n.dataset.target);
        animateCounter(n, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

// 院校热门数据
const schoolData985 = [
  { name: '清华大学', type: '综合', city: '北京', li: 694, wen: 671, badge: 'red' },
  { name: '北京大学', type: '综合', city: '北京', li: 691, wen: 669, badge: 'red' },
  { name: '复旦大学', type: '综合', city: '上海', li: 669, wen: 648, badge: 'orange' },
  { name: '上海交通大学', type: '理工', city: '上海', li: 672, wen: '-', badge: 'orange' },
  { name: '浙江大学', type: '综合', city: '杭州', li: 662, wen: 635, badge: 'orange' },
  { name: '南京大学', type: '综合', city: '南京', li: 651, wen: 628, badge: 'orange' },
  { name: '武汉大学', type: '综合', city: '武汉', li: 642, wen: 618, badge: 'blue' },
  { name: '中山大学', type: '综合', city: '广州', li: 635, wen: 610, badge: 'blue' },
  { name: '华南理工大学', type: '理工', city: '广州', li: 619, wen: '-', badge: 'blue' },
  { name: '同济大学', type: '理工', city: '上海', li: 649, wen: '-', badge: 'orange' },
];

const schoolData211 = [
  { name: '暨南大学', type: '综合', city: '广州', li: 598, wen: 578, badge: 'blue' },
  { name: '华南师范大学', type: '师范', city: '广州', li: 587, wen: 572, badge: 'blue' },
  { name: '南方科技大学', type: '理工', city: '深圳', li: 621, wen: '-', badge: 'blue' },
  { name: '广州大学', type: '综合', city: '广州', li: 563, wen: 548, badge: 'green' },
  { name: '深圳大学', type: '综合', city: '深圳', li: 571, wen: 558, badge: 'green' },
  { name: '东北大学', type: '理工', city: '沈阳', li: 601, wen: '-', badge: 'purple' },
  { name: '西南大学', type: '综合', city: '重庆', li: 588, wen: 564, badge: 'purple' },
  { name: '苏州大学', type: '综合', city: '苏州', li: 594, wen: 572, badge: 'orange' },
];

function renderSchoolTable(data) {
  const tbody = document.getElementById('schoolTbody');
  if (!tbody) return;
  tbody.innerHTML = data.map(s => `
    <tr>
      <td><a class="school-link" href="school.html?name=${encodeURIComponent(s.name)}">${s.name}</a></td>
      <td><span class="badge badge-${s.badge}">${s.type}</span></td>
      <td>${s.city}</td>
      <td><strong>${s.li}</strong></td>
      <td>${s.wen}</td>
      <td>
        <button class="btn btn-ghost" style="padding:6px 14px;font-size:0.82rem;"
          onclick="location.href='school.html?name=${encodeURIComponent(s.name)}'">详情</button>
      </td>
    </tr>
  `).join('');
}

// 初始渲染985
if (document.getElementById('schoolTbody')) renderSchoolTable(schoolData985);

// 标签切换
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const tab = this.dataset.tab;
    if (tab === '985') renderSchoolTable(schoolData985);
    else if (tab === '211') renderSchoolTable(schoolData211);
    else renderSchoolTable([...schoolData985, ...schoolData211].sort((a,b) => b.li - a.li).slice(0,8));
  });
});

// 粒子背景
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 60 + 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 15}s;
      opacity: ${Math.random() * 0.15};
    `;
    container.appendChild(p);
  }
}
createParticles();

// 首页搜索跳转
function startQuery() {
  const province = document.getElementById('provinceSelect')?.value;
  const score = document.getElementById('scoreInput')?.value;
  const subject = document.getElementById('subjectSelect')?.value;

  if (!score) {
    alert('请输入高考分数');
    return;
  }
  const params = new URLSearchParams({ province, score, subject });
  location.href = `recommend.html?${params.toString()}`;
}

// 滚动进入动画
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .testimonial-card, .step').forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});
