(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var canvas = document.getElementById("hero-orbit");
    if (!canvas) return;

    var reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var points = [
      [-1, 1, 1], [1, 1, 1], [-1, -1, 1], [1, -1, 1],
      [-1, 1, -1], [1, 1, -1], [-1, -1, -1], [1, -1, -1],
      [0, 1.45, 0], [0, -1.45, 0], [1.45, 0, 0], [-1.45, 0, 0]
    ];
    var edges = [
      [0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7],
      [0, 4], [1, 5], [2, 6], [3, 7], [8, 0], [8, 1], [8, 4], [8, 5],
      [9, 2], [9, 3], [9, 6], [9, 7], [10, 1], [10, 3], [10, 5], [10, 7],
      [11, 0], [11, 2], [11, 4], [11, 6]
    ];
    var mouse = { x: 0, y: 0 };
    var angle = 0;

    function cssVar(name, fallback) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rotate(point, ax, ay) {
      var x = point[0], y = point[1], z = point[2];
      var cy = Math.cos(ay), sy = Math.sin(ay);
      var cx = Math.cos(ax), sx = Math.sin(ax);
      var x1 = x * cy - z * sy;
      var z1 = x * sy + z * cy;
      var y1 = y * cx - z1 * sx;
      var z2 = y * sx + z1 * cx;
      return [x1, y1, z2];
    }

    function project(point, width, height) {
      var scale = Math.min(width, height) * 0.28;
      var depth = 4.2;
      var perspective = depth / (depth - point[2]);
      return {
        x: width / 2 + point[0] * scale * perspective,
        y: height / 2 + point[1] * scale * perspective,
        z: point[2]
      };
    }

    function draw() {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      var accent = cssVar("--accent", "#1e6fa3");
      var ax = 0.45 + mouse.y * 0.18;
      var ay = angle + mouse.x * 0.22;
      var projected = points.map(function (point) {
        return project(rotate(point, ax, ay), width, height);
      });

      ctx.lineWidth = 1.2;
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.22;
      edges.forEach(function (edge) {
        var a = projected[edge[0]];
        var b = projected[edge[1]];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      ctx.globalAlpha = 0.28;
      projected.forEach(function (point) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      });

      if (!reducedMotion) {
        angle += 0.004;
        requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", function (event) {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    draw();
  });
})();
