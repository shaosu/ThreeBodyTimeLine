/* 回到顶部 / 底部按钮
   --------------------------------------------------------------------------
   - 点击「滚动到底部」/「滚动到顶部」：平滑滚动到目标位置
   - 滚动过程中按钮切换为「停止滚动」，再次点击立即停下
   - 期间用户自己滚轮 / 触摸滑动，也会中断动画
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  var topBtn = document.getElementById('scroll-to-top-btn');
  var bottomBtn = document.getElementById('scroll-to-bottom-btn');
  if (!topBtn || !bottomBtn) { return; }

  var LABEL = {
    top: '滚动到顶部',
    bottom: '滚动到底部',
    stop: '停止滚动'
  };

  var SHOW_TOP_AFTER = 240;   // 向下滚过这个距离才显示「滚动到顶部」

  // 恒定滚动速度（像素 / 毫秒），数值越小越慢
  var SPEED = 0.2;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var rafId = 0;              // 非 0 表示动画进行中
  var direction = 0;          // 1 向下，-1 向上
  var maxScroll = 0;
  var lastKey = '';

  function refreshMax() {
    maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function render() {
    var running = rafId !== 0;
    var showTop = window.scrollY > SHOW_TOP_AFTER;
    var showBottom = window.scrollY < maxScroll - 4;
    var key = running ? 'run' + direction : 'idle' + showTop + showBottom;

    if (key === lastKey) { return; }   // 状态没变化就不碰 DOM
    lastKey = key;

    document.body.classList.toggle('is-scrolling', running);

    if (running) {
      // 滚动中只保留发起滚动的那个按钮，并切换为「停止滚动」
      topBtn.textContent = LABEL.stop;
      bottomBtn.textContent = LABEL.stop;
      topBtn.style.display = direction < 0 ? 'block' : 'none';
      bottomBtn.style.display = direction > 0 ? 'block' : 'none';
      return;
    }

    topBtn.textContent = LABEL.top;
    bottomBtn.textContent = LABEL.bottom;
    topBtn.style.display = showTop ? 'block' : 'none';
    bottomBtn.style.display = showBottom ? 'block' : 'none';
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    direction = 0;
    render();
  }

  function animateTo(target, dir) {
    if (rafId) { stop(); return; }     // 滚动中再次点击 = 停止

    var start = window.scrollY;
    var distance = target - start;
    if (Math.abs(distance) < 1) { return; }

    if (reduced) {
      window.scrollTo(0, target);
      return;
    }

    // 恒定速度：总时长完全由距离决定，不缓动、不限幅
    var duration = Math.abs(distance) / SPEED;
    var startTime = 0;
    direction = dir;

    function step(now) {
      if (!startTime) { startTime = now; }

      var progress = Math.min(1, (now - startTime) / duration);

      // 线性推进 → 全程速度恒定
      window.scrollTo(0, Math.round(start + distance * progress));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
        direction = 0;
        render();
      }
    }

    rafId = requestAnimationFrame(step);
    render();
  }

  bottomBtn.addEventListener('click', function () { animateTo(maxScroll, 1); });
  topBtn.addEventListener('click', function () { animateTo(0, -1); });

  // 动画期间用户主动滚动 → 立刻让出控制权
  ['wheel', 'touchmove'].forEach(function (type) {
    window.addEventListener(type, function () {
      if (rafId) { stop(); }
    }, { passive: true });
  });

  window.addEventListener('scroll', render, { passive: true });
  window.addEventListener('resize', function () { refreshMax(); render(); });
  window.addEventListener('load', function () { refreshMax(); render(); });

  refreshMax();
  render();
})();
