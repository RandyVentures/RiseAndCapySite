/* Rise & Capy motion reel.
   One paused GSAP timeline, 32s long, scrubbed every frame from a master clock: the soundtrack's currentTime when
   sound is on, a wall clock when it's muted. Cue times match reel/tools/mix_audio.py, so edit them together.
   Stage is a 1600x900 SVG; everything that matters stays inside x 350..1250 so a square mobile crop still reads. */
(function () {
  const DUR = 35;
  const NS = "http://www.w3.org/2000/svg";
  const CX = 800, GROUND = 768;
  const INK = "#4A342A", MUTED = "#8A6F5C", CORAL = "#FF8B6B", CREAM = "#FFF8F0", MINT = "#A8CBB7";
  const FONT = "Fredoka, ui-rounded, 'SF Pro Rounded', system-ui, sans-serif";

  const CHAPTERS = [
    { t: 0, label: "Mornings" }, { t: 5.25, label: "Sunrise" }, { t: 8.45, label: "Real alarms" },
    { t: 11.0, label: "Missions" }, { t: 15.05, label: "Personalities" }, { t: 23.1, label: "Free + Pro" },
    { t: 27.1, label: "App Store" },
  ];

  const SKY = {
    night: ["#17142F", "#3A2D5C", "#6E4B6E"],
    dawn: ["#FFB48F", "#FFD6B5", "#FFF1E2"],
    day: ["#FFD9BF", "#FFEBDA", "#FFF8F0"],
    sleepy: ["#CFE6D8", "#EAF4EE", "#FFF8F0"],
    sunny: ["#FFD08A", "#FFE9C8", "#FFF8F0"],
    chill: ["#E2D8CB", "#F2ECE4", "#FFF8F0"],
    motivated: ["#FFB3A0", "#FFDCD1", "#FFF8F0"],
    end: ["#FFA77D", "#FFD2B0", "#FFF3E6"],
  };

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildSVG(asset) {
    const rand = rng(7);
    const stars = Array.from({ length: 70 }, () => {
      const r = 1 + rand() * 2.4;
      return `<circle class="r-star" cx="${(rand() * 1600).toFixed(1)}" cy="${(rand() * 560).toFixed(1)}" r="${r.toFixed(2)}" fill="#FFF6E0" opacity="${(0.35 + rand() * 0.6).toFixed(2)}"/>`;
    }).join("");
    const rays = Array.from({ length: 18 }, (_, i) =>
      `<path d="M0,0 L-70,-1100 L70,-1100 Z" transform="rotate(${i * 20})" fill="#fff" opacity=".22"/>`).join("");
    const sunRays = Array.from({ length: 12 }, (_, i) =>
      `<rect x="-7" y="-185" width="14" height="44" rx="7" transform="rotate(${i * 30})" fill="#FFC27A"/>`).join("");
    const cloud = (x, y, s, id) => `<g transform="translate(${x},${y}) scale(${s})"><g class="r-cloud" id="${id}">
      <rect x="-110" y="-30" width="220" height="60" rx="30" fill="#fff"/><circle cx="-30" cy="-34" r="44" fill="#fff"/><circle cx="34" cy="-22" r="34" fill="#fff"/></g></g>`;
    const capy = window.Capy.capySVG;
    const persona = ["sleepy", "sunny", "chill", "motivated"];
    const personaX = [485, 695, 905, 1115];
    const missionX = [485, 695, 905, 1115];
    const dots = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) dots.push(`<circle class="r-dot" cx="${(c - 1) * 44}" cy="${(r - 1) * 44 - 20}" r="13" fill="#F1E2D2"/>`);

    const apple = "M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-2.99-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.39-.92-2.41-3.66zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.1 1.76-.96 2.8 1.01.08 2.05-.52 2.68-1.28z";

    return `
<svg class="reel-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="${NS}" role="img"
  aria-label="Animated reel: a sleepy capybara is woken by a friendly alarm at sunrise, then Rise & Capy's features, four personalities, free start with a one-time Pro upgrade, and App Store availability." font-family="${FONT}">
  <defs>
    <linearGradient id="rSky" x1="0" y1="0" x2="0" y2="1">
      <stop id="rSky0" offset="0" stop-color="${SKY.night[0]}"/><stop id="rSky1" offset=".58" stop-color="${SKY.night[1]}"/><stop id="rSky2" offset="1" stop-color="${SKY.night[2]}"/>
    </linearGradient>
    <radialGradient id="rSunGlow"><stop offset="0" stop-color="#FFD08A" stop-opacity=".95"/><stop offset=".45" stop-color="#FFC07A" stop-opacity=".35"/><stop offset="1" stop-color="#FFC07A" stop-opacity="0"/></radialGradient>
    <radialGradient id="rMoonGlow"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".45"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>
    <linearGradient id="rScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB48F"/><stop offset=".55" stop-color="#FFD6B5"/><stop offset="1" stop-color="#FFF1E2"/></linearGradient>
    <linearGradient id="rPriceGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8C5A34"/><stop offset=".55" stop-color="${CORAL}"/><stop offset="1" stop-color="#FF9F5A"/></linearGradient>
    <clipPath id="rIconClip"><rect x="-110" y="-110" width="220" height="220" rx="50"/></clipPath>
    <clipPath id="rCardIconClip"><rect x="-104" y="-26" width="48" height="48" rx="12"/></clipPath>
    <mask id="rIris" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
      <rect width="1600" height="900" fill="#fff"/><circle id="rIrisHole" cx="${CX}" cy="450" r="0" fill="#000"/>
    </mask>
    <filter id="rShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#4A342A" flood-opacity=".22"/></filter>
  </defs>

  <rect width="1600" height="900" fill="url(#rSky)"/>
  <g id="rWorld">
    <g transform="translate(${CX},300)"><g id="rBurst" opacity="0">${rays}</g></g>
    <g id="rStars">${stars}</g>
    <g transform="translate(1300,150)"><g id="rMoon">
      <circle r="160" fill="url(#rMoonGlow)"/><circle r="58" fill="#FFF3DA"/>
      <circle cx="-18" cy="-12" r="11" fill="#F2E0BE"/><circle cx="16" cy="14" r="8" fill="#F2E0BE"/><circle cx="20" cy="-20" r="5" fill="#F2E0BE"/>
    </g></g>
    <g transform="translate(${CX},1000)"><g id="rSun">
      <circle r="330" fill="url(#rSunGlow)"/><g id="rSunRays">${sunRays}</g><circle r="118" fill="#FFB766"/><circle r="96" fill="#FFC47E"/>
    </g></g>
    <g id="rClouds" opacity=".12">${cloud(260, 190, 0.9, "rCloud1")}${cloud(1330, 300, 0.7, "rCloud2")}${cloud(640, 110, 0.55, "rCloud3")}</g>
    <path id="rHillBack" d="M-60,690 C250,600 500,640 800,660 C1100,680 1350,590 1660,640 L1660,960 L-60,960Z" fill="#2A2547"/>
    <path id="rHillFront" d="M-60,775 C300,722 600,750 800,752 C1050,755 1300,722 1660,762 L1660,960 L-60,960Z" fill="#221E3B"/>

    <!-- night: bedside alarm clock -->
    <g transform="translate(1100,${GROUND})"><g id="rClock">
      <g id="rRingL" fill="none" stroke="${CORAL}" stroke-width="8" stroke-linecap="round" opacity="0">
        <path d="M-150,-130 Q-172,-90 -150,-50"/><path d="M-178,-150 Q-210,-90 -178,-30"/></g>
      <g id="rRingR" fill="none" stroke="${CORAL}" stroke-width="8" stroke-linecap="round" opacity="0">
        <path d="M150,-130 Q172,-90 150,-50"/><path d="M178,-150 Q210,-90 178,-30"/></g>
      <rect x="-86" y="-24" width="20" height="26" rx="8" fill="#2B2445"/><rect x="66" y="-24" width="20" height="26" rx="8" fill="#2B2445"/>
      <line x1="-78" y1="-160" x2="78" y2="-160" stroke="#2B2445" stroke-width="8" stroke-linecap="round"/>
      <circle cx="-78" cy="-160" r="28" fill="${CORAL}"/><circle cx="78" cy="-160" r="28" fill="${CORAL}"/>
      <rect x="-122" y="-160" width="244" height="142" rx="40" fill="#463C6B"/>
      <rect x="-98" y="-138" width="196" height="96" rx="20" fill="#1A1630"/>
      <text id="rClockA" x="0" y="-70" text-anchor="middle" font-size="64" font-weight="600" fill="${CORAL}">6:59</text>
      <text id="rClockB" x="0" y="-70" text-anchor="middle" font-size="64" font-weight="600" fill="#FFD08A" opacity="0">7:00</text>
    </g></g>

    <g id="rZzz" font-weight="700" fill="#E8DFFF">
      <text class="r-z" x="715" y="420" font-size="40" opacity="0">z</text>
      <text class="r-z" x="715" y="420" font-size="52" opacity="0">z</text>
      <text class="r-z" x="715" y="420" font-size="64" opacity="0">Z</text>
    </g>

    <!-- real alarms: phone + silent-mode badge -->
    <g transform="translate(1040,500) scale(.9)"><g id="rPhone">
      <rect x="-152" y="-292" width="304" height="584" rx="52" fill="#2B211C" filter="url(#rShadow)"/>
      <rect x="-140" y="-280" width="280" height="560" rx="42" fill="url(#rScreen)"/>
      <rect x="-46" y="-264" width="92" height="27" rx="13.5" fill="#120D0A"/>
      <text x="0" y="-150" text-anchor="middle" font-size="96" font-weight="600" fill="#fff">7:00</text>
      <text x="0" y="-108" text-anchor="middle" font-size="24" font-weight="500" fill="#fff" opacity=".9">Good morning</text>
      <g id="rAlarmCard">
        <rect x="-122" y="-46" width="244" height="96" rx="26" fill="#fff" opacity=".94"/>
        <image href="${asset}icon.png" x="-104" y="-26" width="48" height="48" clip-path="url(#rCardIconClip)"/>
        <text x="-44" y="-4" font-size="23" font-weight="600" fill="${INK}">Rise &amp; Capy</text>
        <text x="-44" y="24" font-size="19" font-weight="500" fill="${MUTED}">Time to rise ☀</text>
      </g>
      <rect x="-110" y="190" width="220" height="56" rx="28" fill="#fff" opacity=".55"/>
      <text x="0" y="226" text-anchor="middle" font-size="22" font-weight="600" fill="${INK}">slide to rise</text>
    </g></g>
    <g transform="translate(790,330)"><g id="rBell">
      <circle r="54" fill="#fff" filter="url(#rShadow)"/>
      <g id="rBellIcon" fill="${CORAL}">
        <path d="M0,-28 C-17,-28 -24,-14 -24,0 L-24,10 L-31,20 L31,20 L24,10 L24,0 C24,-14 17,-28 0,-28Z"/><circle cy="27" r="7"/>
      </g>
      <line id="rBellSlash" x1="-30" y1="-30" x2="30" y2="30" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-dasharray="85" stroke-dashoffset="0"/>
      <g id="rBellWaves" fill="none" stroke="${CORAL}" stroke-width="5" stroke-linecap="round" opacity="0">
        <path d="M38,-20 Q48,0 38,20"/><path d="M-38,-20 Q-48,0 -38,20"/></g>
      <text id="rBellLabel" y="88" text-anchor="middle" font-size="22" font-weight="600" fill="${INK}" opacity="0">Silent? Still rings.</text>
    </g></g>

    <!-- missions -->
    ${["Tap", "Pattern", "Shake", "Question"].map((label, i) => `
    <g transform="translate(${missionX[i]},520)"><g class="r-card" id="rCard${i}">
      <rect x="-98" y="-140" width="196" height="256" rx="34" fill="#fff" filter="url(#rShadow)"/>
      <rect class="r-card-ring" x="-98" y="-140" width="196" height="256" rx="34" fill="none" stroke="${CORAL}" stroke-width="5" opacity="0"/>
      <text x="0" y="88" text-anchor="middle" font-size="30" font-weight="600" fill="${INK}">${label}</text>
      ${i === 0 ? `<g transform="translate(0,46) scale(.34)">${capy({ id: "rTapCapy", personality: "sleepy", mood: "sleepy" })}</g>
        <g id="rTouch" transform="translate(4,-36)" opacity="0"><circle r="20" fill="${CORAL}" opacity=".55"/><circle class="r-touch-ring" r="20" fill="none" stroke="${CORAL}" stroke-width="4"/></g>` : ""}
      ${i === 1 ? `<polyline id="rPatternLine" points="-44,-64 0,-20 44,24 44,-20 44,-64" fill="none" stroke="${CORAL}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="230" stroke-dashoffset="230"/>${dots.join("")}` : ""}
      ${i === 2 ? `<g id="rShakePhone" transform="translate(0,-20)"><rect x="-36" y="-62" width="72" height="124" rx="16" fill="${INK}"/><rect x="-29" y="-54" width="58" height="108" rx="11" fill="#FFB48F"/></g>
        <g id="rShakeLines" fill="none" stroke="${CORAL}" stroke-width="6" stroke-linecap="round" opacity="0"><path d="M-58,-50 Q-70,-20 -58,10"/><path d="M58,-50 Q70,-20 58,10"/></g>` : ""}
      ${i === 3 ? `<text x="0" y="-52" text-anchor="middle" font-size="40" font-weight="600" fill="${INK}">3 + 4 =</text>
        <rect x="-44" y="-30" width="88" height="70" rx="20" fill="#F7EDE3"/>
        <text id="rQ" x="0" y="20" text-anchor="middle" font-size="46" font-weight="700" fill="${MUTED}">?</text>
        <text id="rA" x="0" y="20" text-anchor="middle" font-size="46" font-weight="700" fill="#5FA27C" opacity="0">7</text>
        <g id="rCheck" transform="translate(48,-28)" opacity="0"><circle r="18" fill="#5FA27C"/><path d="M-8,0 L-2,6 L9,-6" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></g>` : ""}
    </g></g>`).join("")}

    <!-- personalities -->
    ${persona.map((p, i) => `
    <g transform="translate(${personaX[i]},${GROUND})"><g class="r-persona" id="rPersona${i}">
      ${capy({ personality: p, mood: { sleepy: "sleepy", sunny: "cheerful", chill: "calm", motivated: "excited" }[p] })}
    </g></g>
    <text class="r-persona-name" id="rPersonaName${i}" x="${personaX[i]}" y="838" text-anchor="middle" font-size="30" font-weight="600" fill="${INK}" opacity="0">${p[0].toUpperCase() + p.slice(1)}</text>`).join("")}
    <g id="rBubbles"></g>

    <!-- price -->
    <text id="rPrice" x="${CX}" y="380" text-anchor="middle" font-size="230" font-weight="700" fill="url(#rPriceGrad)" opacity="0">Free</text>
    <g id="rChips"></g>

    <!-- hero capy -->
    <g transform="translate(${CX},${GROUND})"><g id="rCapy">${capy({ id: "rCapyInner", personality: "sunny", mood: "sleepy" })}</g></g>

    <!-- end card -->
    <g transform="translate(${CX},290)"><g id="rIcon" opacity="0">
      <rect x="-110" y="-104" width="220" height="220" rx="50" fill="#4A342A" opacity=".18"/>
      <image href="${asset}icon.png" x="-110" y="-110" width="220" height="220" clip-path="url(#rIconClip)"/>
    </g></g>
    <g id="rConfetti"></g>
    <g id="rEndTitle"></g>
    <text id="rEndLine" x="${CX}" y="580" text-anchor="middle" font-size="42" font-weight="500" fill="${INK}" opacity="0">Now on the App Store</text>
    <g transform="translate(${CX},672)"><g id="rBadge" opacity="0">
      <rect x="-156" y="-44" width="312" height="88" rx="22" fill="#111"/>
      <path d="${apple}" fill="#fff" transform="translate(-136,-26) scale(2.1)"/>
      <text x="-74" y="-6" font-size="18" font-weight="500" fill="#fff" font-family="-apple-system, system-ui, sans-serif">Download on the</text>
      <text x="-76" y="30" font-size="38" font-weight="600" fill="#fff" font-family="-apple-system, system-ui, sans-serif">App Store</text>
    </g></g>

    <g id="rCaptions"></g>
  </g>
  <rect width="1600" height="900" fill="#17142F" mask="url(#rIris)" pointer-events="none"/>
</svg>`;
  }

  function createReel(root, opts = {}) {
    const gsap = window.gsap;
    const asset = opts.assetBase || "";
    const stage = root.querySelector(".reel-stage");
    stage.innerHTML = buildSVG(asset);
    const svg = stage.querySelector("svg");
    const q = (s) => svg.querySelector(s);
    const qa = (s) => [...svg.querySelectorAll(s)];
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    };
    const measurer = el("text", { "font-family": FONT, opacity: 0 }, svg);
    const measure = (str, size, weight) => {
      measurer.setAttribute("font-size", size);
      measurer.setAttribute("font-weight", weight);
      measurer.textContent = str;
      return measurer.getComputedTextLength();
    };

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    const ambient = [];

    // ---------- helpers ----------
    const sky = (name, t, d = 1.2) => SKY[name].forEach((c, i) => tl.to(`#rSky${i}`, { attr: { "stop-color": c }, duration: d, ease: "sine.inOut" }, t));
    const hills = (back, front, t, d = 1.2) => {
      tl.to("#rHillBack", { attr: { fill: back }, duration: d, ease: "sine.inOut" }, t);
      tl.to("#rHillFront", { attr: { fill: front }, duration: d, ease: "sine.inOut" }, t);
    };
    const face = (capyEl, t, { eyes, mouth }) => {
      const set = (sel, on) => tl.set(capyEl.querySelector(sel), { opacity: on ? 1 : 0 }, t);
      if (eyes) { set(".c-eyes-open", eyes === "open"); set(".c-eyes-closed", eyes === "closed"); }
      if (mouth) {
        ["sleepy", "calm", "cheerful", "excited", "yawn"].forEach((m) => set(".c-mouth-" + m, m === mouth));
        set(".c-blush", mouth === "excited");
      }
    };
    const hop = (capyEl, t, h = 60, d = 0.55) => {
      const bob = capyEl.querySelector(".c-bob");
      const o = { transformOrigin: "50% 100%" };
      tl.to(bob, { ...o, scaleY: 0.84, scaleX: 1.12, duration: 0.1, ease: "power2.out" }, t)
        .to(bob, { ...o, scaleY: 1.1, scaleX: 0.92, duration: d * 0.4, ease: "power2.out" }, t + 0.1)
        .to(bob, { y: -h, duration: d * 0.45, ease: "power2.out" }, t + 0.1)
        .to(bob, { ...o, scaleY: 1, scaleX: 1, duration: d * 0.4, ease: "sine.inOut" }, t + 0.1 + d * 0.4)
        .to(bob, { y: 0, duration: d * 0.4, ease: "power2.in" }, t + 0.1 + d * 0.45)
        .to(bob, { ...o, scaleY: 0.9, scaleX: 1.08, duration: 0.07, ease: "power1.out" }, t + 0.1 + d * 0.85)
        .to(bob, { ...o, scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1,0.4)" }, t + 0.17 + d * 0.85);
    };
    const paw = (capyEl, side, t, lift, d = 0.35, ease = "back.out(2)") =>
      tl.to(capyEl.querySelector(".c-paw-" + side), { y: -lift, duration: d, ease }, t);

    const captions = q("#rCaptions");
    function caption(lines, { y = 150, size = 72, weight = 600, fill = INK } = {}) {
      const g = el("g", {}, captions);
      const space = measure("a a", size, weight) - measure("aa", size, weight);
      const words = [];
      lines.forEach((line, li) => {
        const parts = line.split(" ");
        const widths = parts.map((w) => measure(w, size, weight));
        const total = widths.reduce((a, b) => a + b, 0) + space * (parts.length - 1);
        let x = CX - total / 2;
        parts.forEach((w, i) => {
          const t = el("text", { x: (x + widths[i] / 2).toFixed(1), y: y + li * size * 1.12, "text-anchor": "middle", "font-size": size, "font-weight": weight, fill }, g);
          t.textContent = w;
          words.push(t);
          x += widths[i] + space;
        });
      });
      return words;
    }
    const capIn = (words, t, stagger = 0.09) =>
      tl.fromTo(words, { opacity: 0, y: 46, scale: 0.6, transformOrigin: "50% 100%" },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2.4)", stagger }, t);
    const capOut = (words, t) => tl.to(words, { opacity: 0, y: -36, duration: 0.24, ease: "power2.in", stagger: 0.02 }, t);

    // ---------- initial states ----------
    const capyEl = q("#rCapyInner");
    gsap.set("#rCapy", { transformOrigin: "50% 100%" });
    gsap.set(capyEl.querySelector(".c-head"), { rotation: 3, y: 6, transformOrigin: "50% 100%" });
    gsap.set(["#rPhone", "#rBell"], { opacity: 0 });
    gsap.set("#rClock", { transformOrigin: "50% 100%" });
    gsap.set("#rBellIcon", { transformOrigin: "50% 10%" });
    gsap.set("#rShakePhone", { transformOrigin: "50% 50%" });
    gsap.set(".r-card", { opacity: 0 });
    gsap.set(".r-persona", { scale: 0, transformOrigin: "50% 100%" });

    // ---------- 0 – 5.25  night ----------
    tl.to("#rIrisHole", { attr: { r: 1000 }, duration: 0.9, ease: "power2.inOut" }, 0);
    // sleepy breathing + Zzz
    tl.to(capyEl.querySelector(".c-bob"), { scaleY: 0.96, scaleX: 1.03, transformOrigin: "50% 100%", duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0.1);
    qa(".r-z").forEach((z, i) => {
      tl.to(z, { keyframes: { x: [0, -30, -60], y: [0, -70, -150], opacity: [0, 1, 0] }, duration: 1.7, ease: "none", repeat: 1 }, 0.3 + i * 0.45);
    });
    const c1 = caption(["Mornings… are hard."], { y: 175, size: 80, fill: CREAM });
    capIn(c1, 0.9, 0.16);
    capOut(c1, 3.05);
    // the alarm
    tl.set("#rClockA", { opacity: 0 }, 2.85).set("#rClockB", { opacity: 1 }, 2.85);
    tl.to("#rClock", { keyframes: { rotation: [0, -7, 7, -7, 7, -6, 6, -5, 5, -3, 3, 0] }, duration: 2.3, ease: "none" }, 2.85);
    tl.fromTo(["#rRingL", "#rRingR"], { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1.15, duration: 0.28, ease: "power1.out", yoyo: true, repeat: 7 }, 2.85);
    tl.to(["#rRingL", "#rRingR"], { opacity: 0, duration: 0.2 }, 5.1);
    face(capyEl, 2.95, { eyes: "open", mouth: "yawn" });
    tl.to(capyEl.querySelector(".c-head"), { rotation: 0, y: 0, duration: 0.2, ease: "back.out(3)" }, 2.95);
    hop(capyEl, 2.95, 90, 0.5);
    tl.to("#rCapy", { keyframes: { x: [0, -6, 6, -5, 5, -3, 3, 0] }, duration: 0.8, ease: "none" }, 3.55);
    face(capyEl, 4.35, { eyes: "closed", mouth: "sleepy" });
    tl.to(capyEl.querySelector(".c-head"), { rotation: 3, y: 6, duration: 0.6, ease: "sine.inOut" }, 4.35);
    const c2 = caption(["But what if your alarm", "actually cared?"], { y: 140, size: 70, fill: CREAM });
    capIn(c2, 3.35, 0.13);
    capOut(c2, 5.15);

    // ---------- 5.25 – 8.45  sunrise + title ----------
    sky("dawn", 5.25, 1.4);
    hills("#BFDCC9", MINT, 5.25, 1.4);
    tl.to(".r-star", { opacity: 0, duration: 0.8, stagger: { each: 0.006, from: "random" } }, 5.25);
    tl.to("#rMoon", { x: 160, y: 240, opacity: 0, duration: 1.4, ease: "power2.in" }, 5.25);
    tl.to("#rSun", { y: -420, duration: 1.8, ease: "power3.out" }, 5.3);
    tl.to("#rClouds", { opacity: 0.85, duration: 1.4 }, 5.3);
    tl.to("#rZzz", { opacity: 0, duration: 0.3 }, 5.25);
    tl.to("#rClock", { x: 800, opacity: 0, duration: 0.7, ease: "power3.in" }, 5.3);
    // the yawn + stretch
    face(capyEl, 5.6, { mouth: "yawn" });
    tl.to(capyEl.querySelector(".c-head"), { rotation: -4, duration: 0.5, ease: "sine.inOut" }, 5.6);
    tl.to(capyEl.querySelector(".c-bob"), { scaleY: 1.1, scaleX: 0.94, transformOrigin: "50% 100%", duration: 0.6, ease: "sine.inOut" }, 5.6);
    paw(capyEl, "l", 5.6, 78, 0.5, "power2.out");
    paw(capyEl, "r", 5.6, 78, 0.5, "power2.out");
    tl.to(capyEl.querySelector(".c-bob"), { scaleY: 1, scaleX: 1, duration: 0.3, ease: "power2.inOut" }, 6.25);
    paw(capyEl, "l", 6.25, 0, 0.3, "power2.inOut");
    paw(capyEl, "r", 6.25, 0, 0.3, "power2.inOut");
    tl.to(capyEl.querySelector(".c-head"), { rotation: 0, y: 0, duration: 0.3 }, 6.25);
    face(capyEl, 6.3, { eyes: "open", mouth: "cheerful" });
    face(capyEl, 6.6, { mouth: "excited" });
    hop(capyEl, 6.55, 70, 0.55);
    // title slam
    const titleWords = caption(["Rise & Capy"], { y: 250, size: 150, weight: 700, fill: "#8C5A34" });
    tl.fromTo(titleWords, { opacity: 0, y: -260, scale: 1.4, transformOrigin: "50% 100%" },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "bounce.out", stagger: 0.12 }, 6.55);
    const sparkles = el("g", {}, captions);
    const sparkleAt = [[430, 120], [1170, 140], [520, 300], [1100, 290], [800, 70]];
    sparkleAt.forEach(([x, y]) => {
      const s = el("path", { d: "M0,-22 Q3,-3 22,0 Q3,3 0,22 Q-3,3 -22,0 Q-3,-3 0,-22Z", fill: "#FFB766", transform: `translate(${x},${y})` }, sparkles);
      tl.fromTo(s, { scale: 0, rotation: -90, transformOrigin: "50% 50%" },
        { keyframes: { scale: [0, 1.3, 0], rotation: [-90, 0, 90] }, duration: 0.9, ease: "none" }, 6.65 + Math.random() * 0.4);
    });
    tl.to(titleWords, { opacity: 0, y: -120, duration: 0.35, ease: "power2.in", stagger: 0.05 }, 8.35);

    // ---------- 8.45 – 11  real alarms ----------
    sky("day", 8.45, 1);
    tl.to("#rSun", { x: 540, y: -830, scale: 0.55, duration: 1, ease: "power3.inOut" }, 8.45);
    tl.to("#rCapy", { x: -270, scale: 0.9, duration: 0.6, ease: "power3.inOut" }, 8.45);
    tl.fromTo("#rPhone", { opacity: 0, x: 500, rotation: 14, transformOrigin: "50% 50%" }, { opacity: 1, x: 0, rotation: 0, duration: 0.7, ease: "back.out(1.4)" }, 8.5);
    tl.fromTo("#rAlarmCard", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(2)" }, 9.1);
    tl.fromTo("#rBell", { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, 9.0);
    tl.to("#rBellSlash", { attr: { "stroke-dashoffset": 85 }, duration: 0.35, ease: "power2.in" }, 9.55);
    tl.to("#rBellIcon", { keyframes: { rotation: [0, -18, 16, -14, 12, -8, 6, 0] }, duration: 1.1, ease: "none" }, 9.65);
    tl.fromTo("#rBellWaves", { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1.15, duration: 0.25, yoyo: true, repeat: 3 }, 9.65);
    tl.fromTo("#rBellLabel", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 9.75);
    tl.to("#rPhone", { keyframes: { x: [0, -5, 5, -5, 5, -4, 4, 0] }, duration: 0.7, ease: "none" }, 9.65);
    face(capyEl, 9.7, { mouth: "excited" });
    hop(capyEl, 9.7, 40, 0.45);
    const c4 = caption(["Real alarms that ring", "through Silent mode."], { y: 128, size: 62 });
    capIn(c4, 8.7, 0.1);
    capOut(c4, 10.85);

    // ---------- 11 – 15.05  missions ----------
    sky("day", 11, 0.6);
    tl.to("#rPhone", { x: 900, rotation: 12, opacity: 0, duration: 0.5, ease: "power3.in" }, 10.95);
    tl.to("#rBell", { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(2)" }, 10.95);
    tl.to("#rCapy", { y: 640, duration: 0.45, ease: "back.in(1.6)" }, 10.95);
    const cards = qa(".r-card");
    tl.fromTo(cards, { opacity: 0, y: 340, rotation: (i) => [-8, 6, -5, 7][i], transformOrigin: "50% 50%" },
      { opacity: 1, y: 0, rotation: 0, duration: 0.6, ease: "back.out(1.5)", stagger: 0.08 }, 11.1);
    const activate = (i, t) => {
      tl.to(cards[i], { scale: 1.08, y: -14, duration: 0.25, ease: "back.out(3)" }, t)
        .to(cards[i].querySelector(".r-card-ring"), { opacity: 1, duration: 0.2 }, t)
        .to(cards[i], { scale: 1, y: 0, duration: 0.35, ease: "power2.out" }, t + 0.7)
        .to(cards[i].querySelector(".r-card-ring"), { opacity: 0, duration: 0.3 }, t + 0.7);
    };
    // tap
    activate(0, 11.45);
    const tapCapy = q("#rTapCapy");
    [11.55, 11.8].forEach((t) => {
      tl.fromTo("#rTouch", { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, t)
        .fromTo("#rTouch .r-touch-ring", { scale: 1, opacity: 1, transformOrigin: "50% 50%" }, { scale: 2.4, opacity: 0, duration: 0.3, immediateRender: false }, t)
        .to("#rTouch", { opacity: 0, duration: 0.1 }, t + 0.18);
    });
    face(tapCapy, 11.95, { eyes: "open", mouth: "excited" });
    hop(tapCapy, 11.95, 50, 0.45);
    // pattern
    activate(1, 12.4);
    const dotsEl = qa("#rCard1 .r-dot");
    [0, 4, 8, 5, 2].forEach((d, k) => tl.to(dotsEl[d], { attr: { fill: CORAL }, scale: 1.25, transformOrigin: "50% 50%", duration: 0.15, ease: "back.out(3)" }, 12.5 + k * 0.12));
    tl.to("#rPatternLine", { attr: { "stroke-dashoffset": 0 }, duration: 0.6, ease: "power1.inOut" }, 12.5);
    // shake
    activate(2, 13.25);
    tl.to("#rShakePhone", { keyframes: { rotation: [0, -22, 22, -22, 22, -14, 14, 0] }, duration: 0.8, ease: "none" }, 13.35);
    tl.fromTo("#rShakeLines", { opacity: 0 }, { opacity: 1, duration: 0.12, yoyo: true, repeat: 5 }, 13.35);
    // question
    activate(3, 14.15);
    tl.set("#rQ", { opacity: 0 }, 14.3).set("#rA", { opacity: 1 }, 14.3);
    tl.fromTo("#rA", { scale: 0.4, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false }, 14.3);
    tl.fromTo("#rCheck", { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, 14.35);
    const c5 = caption(["Playful missions that", "actually get you up."], { y: 128, size: 62 });
    capIn(c5, 11.3, 0.1);
    capOut(c5, 14.95);
    tl.to(cards, { y: 420, opacity: 0, rotation: (i) => [6, -6, 5, -7][i], duration: 0.45, ease: "back.in(1.4)", stagger: 0.05 }, 14.95);

    // ---------- 15.05 – 23.1  personalities ----------
    const personas = qa(".r-persona");
    const names = qa(".r-persona-name");
    [15.45, 15.7, 15.95, 16.2].forEach((t, i) => {
      tl.to(personas[i], { scale: 0.5, duration: 0.6, ease: "elastic.out(1,0.5)" }, t);
      tl.fromTo(names[i], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, t + 0.1);
    });
    const c6a = caption(["Four capybaras."], { y: 170, size: 80 });
    capIn(c6a, 15.3, 0.14);
    capOut(c6a, 16.8);
    // Each capy says her ringing headline from the app, in her own app voice (cue times match mix_audio.py).
    const quotes = ["Mmm... good morning.", "Good morning, sunshine!", "Hey. Morning.", "RISE AND SHINE!"];
    const tints = ["sleepy", "sunny", "chill", "motivated"];
    const bubbles = q("#rBubbles");
    const spot = [16.75, 18.6, 20.0, 21.6];
    const spotEnd = [18.5, 19.9, 21.5, 23.0];
    spot.forEach((t, i) => {
      const w = measure(quotes[i], 30, 600) + 52;
      const px = [485, 695, 905, 1115][i];
      const bx = Math.min(Math.max(px, 350 + w / 2), 1250 - w / 2);
      const g = el("g", { transform: `translate(${bx},430)` }, bubbles);
      el("rect", { x: -w / 2, y: -36, width: w, height: 68, rx: 34, fill: "#fff", filter: "url(#rShadow)" }, g);
      el("path", { d: `M${px - bx - 12},30 L${px - bx},50 L${px - bx + 12},30 Z`, fill: "#fff" }, g);
      const txt = el("text", { x: 0, y: 10, "text-anchor": "middle", "font-size": 30, "font-weight": 600, fill: i === 3 ? CORAL : INK }, g);
      txt.textContent = quotes[i];
      sky(tints[i], t, 0.4);
      tl.fromTo(g, { opacity: 0, scale: 0.4, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.6)" }, t);
      tl.to(g, { opacity: 0, scale: 0.8, duration: 0.15 }, spotEnd[i] - 0.05);
      tl.to(personas[i], { scale: 0.64, opacity: 1, duration: 0.3, ease: "back.out(3)" }, t);
      tl.to(personas.filter((_, k) => k !== i), { opacity: 0.45, scale: 0.47, duration: 0.25 }, t);
      hop(personas[i], t, i === 3 ? 70 : 34, 0.5);
      // talking: the mouth bobs while she speaks
      tl.to(personas[i].querySelector(".c-head"), { y: -9, duration: 0.12, yoyo: true, repeat: Math.round((spotEnd[i] - t - 0.4) / 0.12), ease: "sine.inOut" }, t + 0.15);
      if (i === 3) tl.fromTo(personas[i].querySelector(".c-badge"), { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.5, duration: 0.18, yoyo: true, repeat: 3, ease: "power2.out" }, t + 0.05);
      if (i === 0) tl.fromTo(personas[i].querySelector(".c-head"), { rotation: 0, transformOrigin: "50% 100%" }, { rotation: 5, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, t);
    });
    tl.to(personas, { opacity: 1, scale: 0.5, duration: 0.2 }, 22.9);
    tl.to(personas, { y: 360, duration: 0.45, ease: "back.in(1.6)", stagger: 0.05 }, 23.0);
    tl.to(names, { opacity: 0, duration: 0.2 }, 23.0);

    // ---------- 23.1 – 27.1  pay once ----------
    sky("day", 23.1, 0.5);
    tl.to("#rCapy", { x: 0, scale: 0.6, duration: 0.01 }, 23.05);
    tl.fromTo("#rCapy", { y: 640 }, { y: 0, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, 23.15);
    tl.fromTo("#rPrice", { opacity: 0, scale: 2.6, transformOrigin: "50% 60%" }, { opacity: 1, scale: 1, duration: 0.4, ease: "expo.in" }, 23);
    tl.to("#rWorld", { keyframes: { x: [0, -10, 9, -6, 4, 0], y: [0, 7, -6, 4, -2, 0] }, duration: 0.35, ease: "none" }, 23.4);
    paw(capyEl, "l", 23.45, 60, 0.3);
    paw(capyEl, "r", 23.45, 60, 0.3);
    const chips = q("#rChips");
    const chipText = ["Pay once for Pro", "No subscription", "No account"];
    const chipW = chipText.map((s) => measure(s, 30, 600) + 96);
    const gap = 22;
    let cx = CX - (chipW.reduce((a, b) => a + b) + gap * 2) / 2;
    [23.45, 24.27, 25.25].forEach((t, i) => {
      const g = el("g", { transform: `translate(${(cx + chipW[i] / 2).toFixed(1)},470)` }, chips);
      cx += chipW[i] + gap;
      const gi = el("g", {}, g);
      el("rect", { x: -chipW[i] / 2, y: -35, width: chipW[i], height: 70, rx: 35, fill: "#fff", filter: "url(#rShadow)" }, gi);
      el("circle", { cx: -chipW[i] / 2 + 38, cy: 0, r: 18, fill: "#5FA27C" }, gi);
      el("path", { d: `M${-chipW[i] / 2 + 30},0 l6,6 l11,-12`, fill: "none", stroke: "#fff", "stroke-width": 4.5, "stroke-linecap": "round", "stroke-linejoin": "round" }, gi);
      const tx = el("text", { x: -chipW[i] / 2 + 66, y: 10, "font-size": 30, "font-weight": 600, fill: INK }, gi);
      tx.textContent = chipText[i];
      tl.fromTo(gi, { opacity: 0, scale: 1.8, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2)" }, t);
      hop(capyEl, t, 36, 0.4);
    });
    tl.to(["#rPrice", chips], { opacity: 0, y: -60, duration: 0.3, ease: "power2.in" }, 26.9);
    paw(capyEl, "l", 26.9, 0, 0.3, "power2.inOut");
    paw(capyEl, "r", 26.9, 0, 0.3, "power2.inOut");

    // ---------- 27.1 – 32  App Store end card ----------
    sky("end", 27.1, 0.8);
    tl.fromTo("#rBurst", { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.9 }, 27.2);
    tl.fromTo("#rBurst", { rotation: 0 }, { rotation: 60, duration: 7.8, ease: "none" }, 27.2);
    tl.to("#rCapy", { x: 330, duration: 0.6, ease: "power3.inOut" }, 27.1);
    tl.fromTo("#rIcon", { opacity: 0, scale: 0, rotation: -25, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: "elastic.out(1,0.55)" }, 27.5);
    const endTitle = q("#rEndTitle");
    const letters = [];
    {
      const s = "Rise & Capy", size = 108;
      const total = measure(s, size, 700);
      let x = CX - total / 2;
      for (const ch of s) {
        const w = measure(ch === " " ? "a a" : ch, size, 700) - (ch === " " ? measure("aa", size, 700) : 0);
        if (ch !== " ") {
          const t = el("text", { x: (x + w / 2).toFixed(1), y: 505, "text-anchor": "middle", "font-size": size, "font-weight": 700, fill: INK }, endTitle);
          t.textContent = ch;
          letters.push(t);
        }
        x += w;
      }
    }
    tl.fromTo(letters, { opacity: 0, y: 70, rotation: (i) => (i % 2 ? 14 : -14), transformOrigin: "50% 100%" },
      { opacity: 1, y: 0, rotation: 0, duration: 0.5, ease: "back.out(2.6)", stagger: 0.045 }, 27.55);
    tl.fromTo("#rEndLine", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45 }, 28.75);
    tl.fromTo("#rBadge", { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2.4)" }, 28.85);
    tl.fromTo("#rBadge", { y: 0 }, { y: -8, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 5, immediateRender: false }, 29.6);
    // confetti
    const conf = q("#rConfetti");
    const crand = rng(42);
    const palette = [CORAL, "#FF9F5A", MINT, "#FFD08A", "#B98255", "#fff"];
    for (let i = 0; i < 46; i++) {
      const a = crand() * Math.PI * 2, dist = 180 + crand() * 420;
      const piece = crand() > 0.5
        ? el("rect", { x: -7, y: -10, width: 14, height: 20, rx: 3, fill: palette[i % palette.length] }, conf)
        : el("circle", { r: 7 + crand() * 4, fill: palette[i % palette.length] }, conf);
      piece.setAttribute("transform", `translate(${CX},290)`);
      const dx = Math.cos(a) * dist, dy = Math.sin(a) * dist * 0.7;
      tl.fromTo(piece, { x: 0, y: 0, opacity: 0, rotation: 0 }, { x: dx, y: dy, opacity: 1, rotation: crand() * 720 - 360, duration: 0.7, ease: "expo.out" }, 27.55);
      tl.to(piece, { y: dy + 520, x: dx * 1.15, rotation: "+=" + (crand() * 540 - 270), duration: 2.4 + crand(), ease: "power1.in" }, 28.25);
      tl.to(piece, { opacity: 0, duration: 0.6 }, 30.2 + crand() * 0.8);
    }
    // the wave goodbye
    face(capyEl, 27.6, { mouth: "excited" });
    hop(capyEl, 27.6, 60, 0.5);
    const pawR = capyEl.querySelector(".c-paw-r");
    tl.to(pawR, { y: -150, x: 40, rotation: -20, transformOrigin: "50% 50%", duration: 0.3, ease: "back.out(2)" }, 29.2)
      .to(pawR, { rotation: 22, x: 58, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 7 }, 29.5)
      .to(pawR, { y: 0, x: 0, rotation: 0, duration: 0.4, ease: "power2.inOut" }, 31.3);
    tl.to(capyEl.querySelector(".c-head"), { rotation: -6, duration: 0.25, yoyo: true, repeat: 7, ease: "sine.inOut" }, 29.5);
    hop(capyEl, 32.4, 40, 0.45);
    // iris out, back to night for a seamless loop
    tl.to("#rIrisHole", { attr: { r: 0 }, duration: 0.75, ease: "power2.in" }, DUR - 0.75);
    tl.set({}, {}, DUR);
    tl.progress(1).progress(0);

    // ---------- ambient life (not on the master clock) ----------
    ambient.push(gsap.to("#rSunRays", { rotation: 360, transformOrigin: "50% 50%", duration: 40, ease: "none", repeat: -1 }));
    qa(".r-cloud").forEach((c, i) => ambient.push(gsap.to(c, { x: [60, -50, 40][i], duration: 9 + i * 3, ease: "sine.inOut", yoyo: true, repeat: -1 })));
    qa(".r-star").forEach((s, i) => { if (i % 3 === 0) ambient.push(gsap.to(s, { scale: 0.3, transformOrigin: "50% 50%", duration: 0.8 + (i % 7) * 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" })); });
    [capyEl, ...personas.map((p) => p.querySelector(".capy")), tapCapy].forEach((c) => ambient.push(...window.Capy.capyIdle(c, gsap)));

    return { tl, ambient, DUR, CHAPTERS };
  }

  // ---------- player: clock, sound, controls ----------
  function mountReel(root, opts = {}) {
    const gsap = window.gsap;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { tl, ambient } = createReel(root, opts);
    const audio = new Audio((opts.assetBase || "") + "reel/reel.mp3");
    audio.preload = "auto";
    audio.loop = true;

    const ui = {
      play: root.querySelector("[data-reel-play]"),
      sound: root.querySelector("[data-reel-sound]"),
      soundPill: root.querySelector("[data-reel-pill]"),
      bar: root.querySelector("[data-reel-bar]"),
      fill: root.querySelector("[data-reel-fill]"),
      time: root.querySelector("[data-reel-time]"),
      chapter: root.querySelector("[data-reel-chapter]"),
      full: root.querySelector("[data-reel-full]"),
      big: root.querySelector("[data-reel-big]"),
    };
    CHAPTERS.forEach((c) => {
      if (!c.t) return;
      const tick = document.createElement("span");
      tick.className = "reel-tick";
      tick.style.left = (c.t / DUR) * 100 + "%";
      ui.bar.appendChild(tick);
    });

    const s = { t: reduce ? 26.6 : 0, playing: !reduce, sound: false, userMuted: false, visible: true, last: performance.now() };
    const fmt = (t) => `0:${String(Math.floor(t)).padStart(2, "0")}`;

    function render() {
      tl.time(s.t);
      ui.fill.style.transform = `scaleX(${s.t / DUR})`;
      ui.time.textContent = `${fmt(s.t)} / ${fmt(DUR)}`;
      let ch = CHAPTERS[0];
      for (const c of CHAPTERS) if (s.t >= c.t) ch = c;
      if (ui.chapter.textContent !== ch.label) ui.chapter.textContent = ch.label;
    }

    function syncUI() {
      root.classList.toggle("is-playing", s.playing);
      root.classList.toggle("has-sound", s.sound);
      ui.play.setAttribute("aria-label", s.playing ? "Pause reel" : "Play reel");
      ui.sound.setAttribute("aria-label", s.sound ? "Mute sound" : "Turn sound on");
      ui.sound.setAttribute("aria-pressed", String(s.sound));
      ambient.forEach((a) => (s.playing && s.visible ? a.resume() : a.pause()));
    }

    function startAudio() {
      audio.currentTime = s.t;
      return audio.play().then(() => { s.sound = true; syncUI(); });
    }
    function setSound(on, fromUser) {
      if (fromUser) s.userMuted = !on;
      if (on) {
        if (!s.playing) { s.playing = true; }
        startAudio().catch(() => { s.sound = false; syncUI(); });
      } else {
        s.sound = false;
        audio.pause();
      }
      syncUI();
    }
    function setPlaying(on) {
      s.playing = on;
      if (!on) audio.pause();
      else if (s.sound && s.visible) startAudio().catch(() => {});
      s.last = performance.now();
      syncUI();
    }
    function seek(t) {
      s.t = Math.max(0, Math.min(DUR - 0.01, t));
      if (s.sound) audio.currentTime = s.t;
      render();
    }

    gsap.ticker.add(() => {
      const now = performance.now();
      if (s.playing && s.visible) {
        if (s.sound && !audio.paused) s.t = audio.currentTime % DUR;
        else s.t = (s.t + (now - s.last) / 1000) % DUR;
        render();
      }
      s.last = now;
    });

    ui.play.addEventListener("click", () => setPlaying(!s.playing));
    ui.sound.addEventListener("click", () => setSound(!s.sound, true));
    ui.soundPill.addEventListener("click", () => setSound(true, true));
    if (ui.big) ui.big.addEventListener("click", () => { seek(0); setPlaying(true); setSound(true, true); });
    ui.full.addEventListener("click", () => {
      const el = root;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    });
    let dragging = false;
    const scrub = (e) => {
      const r = ui.bar.getBoundingClientRect();
      seek(((e.clientX - r.left) / r.width) * DUR);
    };
    ui.bar.addEventListener("pointerdown", (e) => { dragging = true; ui.bar.setPointerCapture(e.pointerId); scrub(e); });
    ui.bar.addEventListener("pointermove", (e) => dragging && scrub(e));
    ui.bar.addEventListener("pointerup", () => (dragging = false));
    ui.bar.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { seek(s.t + 2); e.preventDefault(); }
      if (e.key === "ArrowLeft") { seek(s.t - 2); e.preventDefault(); }
    });
    root.querySelector(".reel-stage").addEventListener("click", () => {
      if (!s.sound && !s.userMuted) setSound(true, true);
      else setPlaying(!s.playing);
    });
    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input,textarea,select,button,a,summary,[contenteditable]")) return;
      const r = root.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (e.key === " " || e.key === "k") { setPlaying(!s.playing); e.preventDefault(); }
      if (e.key === "m") setSound(!s.sound, true);
    });

    // Sound starts with the first interaction anywhere on the page (browsers block unmuted autoplay until then),
    // as long as the reel is on screen and the visitor hasn't muted it.
    const unlock = (e) => {
      if (e.target.closest && e.target.closest(".reel")) return; // the reel's own controls handle themselves
      if (!s.sound && !s.userMuted && s.playing && s.visible) setSound(true, false);
      ["pointerdown", "keydown"].forEach((t) => document.removeEventListener(t, unlock, true));
    };
    ["pointerdown", "keydown"].forEach((t) => document.addEventListener(t, unlock, true));

    // Pause everything while the reel is off screen or the tab is hidden.
    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.intersectionRatio > 0.2;
      if (!s.visible) audio.pause();
      else if (s.playing && s.sound) startAudio().catch(() => {});
      s.last = performance.now();
      syncUI();
    }, { threshold: [0, 0.2, 0.5] });
    io.observe(root);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) audio.pause();
      else if (s.playing && s.sound && s.visible) startAudio().catch(() => {});
      s.last = performance.now();
    });

    root.reel = { seek, setPlaying, setSound, state: s }; // handy for debugging and for capturing stills
    render();
    syncUI();
    if (reduce) root.classList.add("is-reduced");
    else startAudio().catch(() => {}); // succeeds only where the browser allows unmuted autoplay
    root.classList.add("is-ready");
  }

  window.mountReel = function (root, opts) {
    const go = () => mountReel(root, opts);
    if (document.fonts && document.fonts.load) {
      Promise.race([
        Promise.all([document.fonts.load("600 64px Fredoka"), document.fonts.load("700 64px Fredoka"), document.fonts.load("500 64px Fredoka")]),
        new Promise((r) => setTimeout(r, 2000)),
      ]).then(go, go);
    } else go();
  };
})();
