// RoastPlusの画面スライダー：矢印・ドット・自動切り替え
(() => {
  const root = document.querySelector(".carousel");
  if (!root) return;
  const track = root.querySelector(".track");
  const slides = [...track.children];
  const dotsBox = root.querySelector(".dots");
  let index = 0;
  let timer = null;

  // ドットを作る
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `${i + 1}枚目を表示`);
    b.addEventListener("click", () => { go(i); stop(); });
    dotsBox.append(b);
    return b;
  });

  function render() {
    dots.forEach((d, i) => d.setAttribute("aria-current", String(i === index)));
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    render();
  }

  // スワイプで動いたときも現在位置を追従させる。
  // スクロール中の途中経過で上書きしないよう、止まってから判定する
  let settle = null;
  track.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      index = Math.round(track.scrollLeft / track.clientWidth);
      render();
    }, 120);
  }, { passive: true });

  root.querySelector(".prev").addEventListener("click", () => { go(index - 1); stop(); });
  root.querySelector(".next").addEventListener("click", () => { go(index + 1); stop(); });

  // 自動切り替え（操作・ホバー・フォーカス中は止める。動きを減らす設定の人には動かさない）
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  function start() {
    if (reduce.matches || timer) return;
    timer = setInterval(() => go(index + 1), 5000);
  }
  function stop() { clearInterval(timer); timer = null; }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  render();
  start();
})();

// スクロールで要素をふわっと表示する（動きを減らす設定の人には何もしない）
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll(".work .inner > *, .about > *");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
})();
