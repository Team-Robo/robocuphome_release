(async () => {
  const hero = document.querySelector(".overview-hero");
  if (!hero) return;

  const canvas = hero.querySelector(".overview-hero__canvas");
  const copy = hero.querySelector(".overview-hero__copy");
  const logo = hero.querySelector(".overview-hero__logo");
  const pause = hero.querySelector(".overview-hero__pause");
  const ctx = canvas.getContext("2d");
  const source = document.createElement("canvas");
  const sourceCtx = source.getContext("2d");
  if (!ctx || !sourceCtx) {
    logo.style.visibility = "visible";
    return;
  }

  try {
    await logo.decode();
  } catch {
    logo.style.visibility = "visible";
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colours = ["#43dbfc", "#42f1c9", "#658cf5"];
  const outlineColours = ["#38e3ed", "#9cc6d9"];
  const samples = 128;
  const period = 8200;
  const sourceSize = 320;
  const crestRow = Math.round(sourceSize * 0.43);

  function smoothstep(low, high, value) {
    const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
    return t * t * (3 - 2 * t);
  }

  function markPoint(x, y) {
    // Keep the bend above the lettering, with a little more room for the beak.
    const beak = 0.08 * smoothstep(0.72, 0.76, x);
    const head = smoothstep(0.43, 0.69, x) * smoothstep(0.33, 0.49, y) *
      (1 - smoothstep(0.515 + beak, 0.59 + beak, y));
    return { x, y, head, crest: 1 - smoothstep(0.22, 0.52, y) };
  }

  // Each path starts at a terminal and follows the artwork into the brow or beak.
  const branches = [
    [[708, 262], [673, 294], [645, 335], [644, 387], [681, 429], [697, 482], [758, 528], [842, 563], [907, 618]],
    [[570, 332], [593, 358], [611, 393], [617, 449], [679, 506], [755, 546], [825, 583], [878, 627]],
    [[449, 410], [485, 431], [544, 431], [586, 467], [625, 507], [701, 535], [773, 564], [826, 614]],
    [[483, 499], [517, 528], [551, 548], [623, 549], [686, 568], [757, 590], [813, 623]],
    [[829, 382], [796, 414], [763, 452], [776, 469], [842, 510], [896, 565], [919, 622], [953, 681], [941, 752]],
  ].map(points => points.map(([x, y]) => markPoint(x / 1254, y / 1254)));

  function interpolate(a, b, c, d, t) {
    return b + 0.5 * t * (c - a + t * (2 * a - 5 * b + 4 * c - d + t * (3 * (b - c) - a + d)));
  }

  function sampleBranch(points) {
    const inside = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[Math.max(0, i - 1)];
      const b = points[i];
      const c = points[i + 1];
      const d = points[Math.min(points.length - 1, i + 2)];
      for (let step = 1; step <= 7; step++) {
        const t = step / 7;
        inside.push(markPoint(
          interpolate(a.x, b.x, c.x, d.x, t),
          interpolate(a.y, b.y, c.y, d.y, t)
        ));
      }
    }
    return inside.reverse();
  }

  const circuitBranches = branches.map(branch => ({
    terminal: branch[0],
    inside: sampleBranch(branch),
  }));

  source.width = source.height = sourceSize;
  sourceCtx.drawImage(logo, 0, 0, sourceSize, sourceSize);
  const pixels = sourceCtx.getImageData(0, 0, sourceSize, sourceSize).data;
  const tones = new Int8Array(sourceSize * sourceSize).fill(-1);
  for (let i = crestRow * sourceSize; i < tones.length; i++) {
    const red = pixels[4 * i];
    const cyan = Math.min(pixels[4 * i + 1], pixels[4 * i + 2]);
    if (Math.max(red, cyan) >= 62) tones[i] = cyan - red > 43 ? 0 : 1;
  }

  function traceOutlines(tone) {
    const stride = sourceSize + 1;
    const edges = new Map();
    const inside = (x, y) => x >= 0 && x < sourceSize && y >= crestRow && y < sourceSize
      && tones[y * sourceSize + x] === tone;

    function add(start, end) {
      if (!edges.has(start)) edges.set(start, []);
      edges.get(start).push(end);
    }

    // Follow the pixel boundaries, including the holes inside the lettering.
    for (let y = crestRow; y < sourceSize; y++) {
      for (let x = 0; x < sourceSize; x++) {
        if (!inside(x, y)) continue;
        const top = y * stride + x;
        const bottom = top + stride;
        if (!inside(x, y - 1)) add(top, top + 1);
        if (!inside(x + 1, y)) add(top + 1, bottom + 1);
        if (!inside(x, y + 1)) add(bottom + 1, bottom);
        if (!inside(x - 1, y)) add(bottom, top);
      }
    }

    const outlines = [];
    for (const [start, outgoing] of edges) {
      while (outgoing.length) {
        const vertices = [];
        let point = start;
        do {
          vertices.push(point);
          point = edges.get(point)?.pop();
        } while (point !== start && point !== undefined);

        if (point === start && vertices.length >= 9) {
          const length = vertices.length;
          const count = Math.max(6, Math.min(180, Math.floor(length / 2)));
          const smoothed = Array.from({ length: count }, (_, index) => {
            const i = Math.floor(index * length / count);
            const before = vertices[(i + length - 1) % length];
            const current = vertices[i];
            const after = vertices[(i + 1) % length];
            const x = (before % stride + 2 * (current % stride) + after % stride) / 4;
            const y = (Math.floor(before / stride) + 2 * Math.floor(current / stride) + Math.floor(after / stride)) / 4;
            return markPoint(x / sourceSize, y / sourceSize);
          });
          smoothed.push(smoothed[0]);
          outlines.push(smoothed);
        }
      }
    }
    return outlines;
  }

  const outlines = outlineColours.flatMap((colour, tone) =>
    traceOutlines(tone).map(points => ({ points, colour }))
  );

  let width = 0;
  let height = 0;
  let logoBounds;
  let trails = [];
  let visible = true;
  let frame = 0;
  let elapsed = 0;
  let last = 0;

  // Use the same deformation for the falcon, its circuit branches and the moving trail anchors.
  function project(point, pose) {
    const { x, y, head, crest } = point;
    const headMotion = head * 0.18;
    const bend = headMotion * pose.nod;
    const stretch = headMotion * pose.spread;
    const sway = crest * pose.sway;
    const motion = Math.max(headMotion, crest);
    const rippleX = Math.sin(pose.phase - y * 13) * (0.0015 + 0.0045 * motion + 0.013 * crest);
    const rippleY = Math.sin(pose.phase * 0.86 + x * 12) * (0.002 + 0.006 * motion + 0.014 * crest);
    const u = x - (y - 0.51) * bend + (x - 0.5) * stretch + (x - 0.53) * sway * 0.25 + rippleX;
    const v = y + (x - 0.5) * bend - (0.4 - y) * sway * 0.18 + rippleY;
    return {
      x: logoBounds.x + u * logoBounds.width,
      y: logoBounds.y + v * logoBounds.height,
    };
  }

  function tracePath(points, start, end) {
    ctx.beginPath();
    ctx.moveTo(points[start].x, points[start].y);
    for (let i = start + 1; i <= end; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
  }

  function drawFlow(points, colour, phase, tail, width) {
    const end = points.length - 1;
    tracePath(points, 0, end);
    ctx.strokeStyle = colour + "76";
    ctx.lineWidth = width * 0.72;
    ctx.stroke();

    const distance = phase * (end + tail);
    const head = Math.max(0, Math.floor(end - distance));
    const back = Math.min(end, Math.ceil(end - distance + tail));
    if (back <= head) return;

    tracePath(points, head, back);
    const tip = points[head];
    const rear = points[back];
    const light = ctx.createLinearGradient(rear.x, rear.y, tip.x, tip.y);
    light.addColorStop(0, colour + "00");
    light.addColorStop(0.62, colour + "b5");
    light.addColorStop(1, "#d6feff");
    const strength = Math.min(1, (end + tail - distance) / tail);
    ctx.strokeStyle = light;
    ctx.globalAlpha = 0.2 * strength;
    ctx.lineWidth = width * 3.6;
    ctx.stroke();
    ctx.globalAlpha = strength;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function circuitPoints(trail, pose) {
    const connection = project(trail.terminal, pose);
    const dx = connection.x - trail.outside[0].x;
    const dy = connection.y - trail.outside[0].y;
    const inside = trail.inside.map(point => project(point, pose));
    const outside = trail.outside.map(point => ({
      x: point.x + dx * point.follow,
      y: point.y + dy * point.follow,
    }));

    // Match the tangents on both sides so the trail curves into the circuit branch.
    const join = 16;
    const start = outside[0];
    const end = outside[join];
    const previous = inside[inside.length - 1];
    const next = outside[join + 1];
    const reach = Math.hypot(end.x - start.x, end.y - start.y) * 0.36;
    const entering = reach / Math.max(0.001, Math.hypot(start.x - previous.x, start.y - previous.y));
    const leaving = reach / Math.max(0.001, Math.hypot(next.x - end.x, next.y - end.y));
    const a = {
      x: start.x + (start.x - previous.x) * entering,
      y: start.y + (start.y - previous.y) * entering,
    };
    const b = {
      x: end.x - (next.x - end.x) * leaving,
      y: end.y - (next.y - end.y) * leaving,
    };
    for (let i = 1; i < join; i++) {
      const t = i / join;
      const s = 1 - t;
      outside[i] = {
        x: s ** 3 * start.x + 3 * s * s * t * a.x + 3 * s * t * t * b.x + t ** 3 * end.x,
        y: s ** 3 * start.y + 3 * s * s * t * a.y + 3 * s * t * t * b.y + t ** 3 * end.y,
      };
    }
    return inside.concat(outside);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const time = elapsed / 1000;
    const phases = trails.map(trail => (elapsed / period + trail.offset) % 1);
    const arrival = Math.max(...phases.map((phase, i) => {
      const distance = phase * (samples + trails[i].inside.length + 27);
      return Math.max(0, 1 - Math.abs(distance - samples) / 14);
    }));
    const pose = {
      phase: time * 1.75,
      nod: 0.26 * Math.sin(time * 1.25) + 0.095 * arrival,
      spread: 0.17 * Math.sin(time * 0.99 + 0.6),
      sway: Math.sin(time * 1.12 + 0.3),
    };
    const stroke = Math.max(0.92, logoBounds.width * 0.00225);

    outlines.forEach(({ points, colour }, i) => {
      const projected = points.map(point => project(point, pose));
      const phase = (elapsed / period + i * 0.173) % 1;
      drawFlow(projected, colour, phase, Math.max(3, Math.round(points.length * 0.32)), stroke);
    });
    trails.forEach((trail, i) => {
      drawFlow(circuitPoints(trail, pose), trail.colour, phases[i], 27, stroke * 1.12);
    });
  }

  function resize() {
    const field = canvas.getBoundingClientRect();
    const bounds = logo.getBoundingClientRect();
    width = field.width;
    height = field.height;
    if (!width || !height || !bounds.width) return;

    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    logoBounds = {
      x: bounds.left - field.left,
      y: bounds.top - field.top,
      width: bounds.width,
      height: bounds.height,
    };
    const centreX = logoBounds.x + bounds.width * 0.5;
    const centreY = logoBounds.y + bounds.height * 0.5;
    const reach = Math.max(width, height) * 0.79;
    const stretch = 0.78;

    trails = circuitBranches.map(({ terminal, inside }, index) => {
      const dx = (terminal.x - 0.5) * bounds.width;
      const dy = (terminal.y - 0.5) * bounds.height / stretch;
      const inner = Math.hypot(dx, dy);
      const direction = Math.atan2(dy, dx);
      const outside = Array.from({ length: samples + 1 }, (_, step) => {
        const fraction = step / samples;
        const radius = inner + reach * fraction * (0.27 + 0.73 * fraction);
        const angle = direction + fraction * (4.1 + 0.26 * index);
        return {
          x: centreX + Math.cos(angle) * radius,
          y: centreY + Math.sin(angle) * radius * stretch,
          follow: (1 - fraction) ** 2.4,
        };
      });
      return {
        terminal, outside, inside,
        colour: colours[index % colours.length],
        offset: (0.17 + index / branches.length) % 1,
      };
    });
    draw();
    hero.setAttribute("data-logo-rendered", "");
  }

  function tick(now) {
    if (last === 0) last = now;
    if (now - last >= 1000 / 30 - 1) {
      elapsed += now - last;
      last = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }

  function updateMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (logoBounds && visible && !document.hidden && !reduced.matches && !pause.checked) {
      frame = requestAnimationFrame(tick);
    }
  }

  resize();
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!frame) updateMotion();
  });
  resizeObserver.observe(canvas);
  resizeObserver.observe(copy);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateMotion();
  }).observe(hero);
  pause.addEventListener("change", updateMotion);
  reduced.addEventListener("change", updateMotion);
  document.addEventListener("visibilitychange", updateMotion);
})();
