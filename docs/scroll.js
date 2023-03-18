
      // 获取按钮元素
      const scrollToBottomBtn = document.getElementById("scroll-to-bottom-btn");
      const scrollToTopBtn = document.getElementById("scroll-to-top-btn");

      // 添加单击事件监听器
      scrollToBottomBtn.addEventListener("click", () => {
        // 滚动到页面底部
        scrollToPosition(0, document.body.scrollHeight);
      });

      scrollToTopBtn.addEventListener("click", () => {
        // 滚动到页面顶部
        scrollToPosition(document.body.scrollHeight, 0);
      });

      // 监听窗口滚动事件
      window.addEventListener("scroll", () => {
        // 如果滚动高度超过页面高度的一半，显示按钮，否则隐藏按钮
        if (window.scrollY > document.body.scrollHeight / 2) {
          scrollToBottomBtn.style.display = "none";
        } else {
          scrollToBottomBtn.style.display = "block";
        }

        if (window.scrollY > document.body.scrollHeight / 2) {
          scrollToTopBtn.style.display = "block";
        } else {
          scrollToTopBtn.style.display = "none";
        }
      });

      // 滚动到指定位置
      function scrollToPosition(currentPosition, targetPosition) {
        const distance =( targetPosition - currentPosition); // Math.abs
        const duration = 3000; // 滚动时间（毫秒）
        const speed = 0.5; // 滚动速度（像素/毫秒）
        let currentTime = 0;

        if (distance <0)
             currentTime =200;

        function easeOutQuad(curtime, curpos, dis, dur) {

             console.log(dis * curtime / dur + curpos);
             return  dis * curtime / dur + curpos; //  linear   -12046*curtime/3000+12046
        }

        function animateScroll() {
          currentTime += 1;
          const newPosition = easeOutQuad(currentTime, currentPosition, distance, duration);
          window.scrollTo(0, newPosition);

          if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
          }
        }

        animateScroll();
      }
