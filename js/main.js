// main.js - 全站公共逻辑

// 获取URL参数
function getParam(key) {
  return new URLSearchParams(location.search).get(key) || '';
}

// 格式化数字
function fmt(n) {
  return n?.toLocaleString('zh-CN') ?? '-';
}

// 工具：防抖
function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 工具：深拷贝
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 本地存储工具
const Storage = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// 显示 Toast 提示
function showToast(msg, type = 'success', duration = 3000) {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%) translateY(-20px)',
    background: type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '500',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    zIndex: '9999',
    opacity: '0',
    transition: 'all 0.3s ease',
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(-10px)';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// 导航栏高亮当前页
function highlightNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path);
  });
}
highlightNav();

// 导航滚动效果（所有页面通用）
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
});

// 移动端菜单样式补丁
const style = document.createElement('style');
style.textContent = `
.nav-links.mobile-open,
.nav-actions.mobile-open {
  display: flex !important;
  position: fixed;
  top: 68px; left: 0; right: 0;
  background: #fff;
  flex-direction: column;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  z-index: 999;
}
.nav-links.mobile-open { gap: 4px; }
.nav-actions.mobile-open {
  top: auto;
  position: relative;
  border: none;
  box-shadow: none;
  padding: 8px 0 0;
  flex-direction: row;
  gap: 12px;
}
.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
