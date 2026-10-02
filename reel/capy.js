/* Capy: the rigged SVG capybara shared by the reel and the page.
   A 1:1 port of the app's CapybaraMascotView.swift + CapyPersonalityBadge.swift (400x460 viewBox), shifted so the
   feet's ground line sits on y=0 and the body is centered on x=0: placing a capy is just translate(x, groundY).
   Animatable parts have classes for GSAP: c-bob (squash/stretch), c-breath, c-head, c-paw-l / c-paw-r,
   c-eyes-open / c-eyes-closed, c-blush, c-badge, and one mouth per mood: c-mouth-{sleepy,calm,cheerful,excited,yawn}. */
(function () {
  const C = {
    brown: "#B98255", brownDark: "#8C5A34", muzzle: "#E8C9A6", ink: "#4A342A", coral: "#FF8B6B", bg: "#FFF8F0",
  };
  const ACCENT = { sleepy: "#A8CBB7", sunny: "#FF9F5A", chill: "#B9AC9A", motivated: "#FF8B6B" };

  // Badge glyphs, centered on 0,0 for a badge of radius 34 (CapyPersonalityBadge.swift).
  const R = 34;
  const glyph = {
    sleepy: (a) => `<circle r="${R * 0.52}" fill="#fff"/><circle cx="${R * 0.52 * 0.55}" cy="${-R * 0.52 * 0.2}" r="${R * 0.52 * 0.85}" fill="${a}"/>`,
    sunny: () => `<circle r="${R * 0.34}" fill="#fff"/><g stroke="#fff" stroke-width="${R * 0.16}" stroke-linecap="round">` +
      Array.from({ length: 8 }, (_, i) => {
        const t = (i / 8) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
        return `<line x1="${(R * 0.55 * c).toFixed(2)}" y1="${(R * 0.55 * s).toFixed(2)}" x2="${(R * 0.85 * c).toFixed(2)}" y2="${(R * 0.85 * s).toFixed(2)}"/>`;
      }).join("") + "</g>",
    chill: (a) => `<path d="M0,${-R * 0.6} Q${R * 0.55},0 0,${R * 0.6} Q${-R * 0.55},0 0,${-R * 0.6}Z" fill="#fff"/><line x1="0" y1="${-R * 0.6}" x2="0" y2="${R * 0.6}" stroke="${a}" stroke-width="${R * 0.07}"/>`,
    motivated: () => `<path d="M${R * 0.12},${-R * 0.62} L${-R * 0.32},${R * 0.08} L${-R * 0.02},${R * 0.08} L${-R * 0.12},${R * 0.62} L${R * 0.38},${-R * 0.1} L${R * 0.08},${-R * 0.1}Z" fill="#fff"/>`,
  };
  const BADGES = Object.fromEntries(Object.keys(ACCENT).map((p) => [p, { color: ACCENT[p], icon: glyph[p](ACCENT[p]) }]));

  /* opts.personality: sleepy | sunny | chill | motivated (tints the inner ears + badge)
     opts.mood: sleepy | calm | cheerful | excited (starting expression; the reel swaps parts later)
     opts.badge: false hides the badge */
  function capySVG(opts = {}) {
    const { id = "", cls = "", personality = "sunny", mood = "calm", badge = true } = opts;
    const a = ACCENT[personality];
    const on = (v) => (v ? "1" : "0");
    const eyeR = mood === "excited" ? 13 : mood === "cheerful" ? 11.5 : 11.5;
    const closed = mood === "sleepy";
    return `
<g ${id ? `id="${id}"` : ""} class="capy ${cls}" data-personality="${personality}">
 <g transform="translate(-200,-432)">
  <ellipse class="c-shadow" cx="200" cy="432" rx="108" ry="13" fill="${C.ink}" opacity=".09"/>
  <g class="c-bob">
   <g class="c-breath">
    <rect x="80" y="258" width="240" height="134" rx="54" fill="${C.brown}"/>
    <ellipse cx="200" cy="386" rx="90" ry="11" fill="${C.brownDark}" opacity=".1"/>
    <g class="c-head">
     <g class="c-ear-l"><circle cx="81" cy="220" r="29" fill="${C.brownDark}"/><circle cx="81" cy="220" r="17" fill="${a}" opacity=".85"/></g>
     <g class="c-ear-r"><circle cx="319" cy="220" r="29" fill="${C.brownDark}"/><circle cx="319" cy="220" r="17" fill="${a}" opacity=".85"/></g>
     <rect x="62" y="82" width="276" height="188" rx="44" fill="${C.brown}"/>
     <ellipse cx="200" cy="266" rx="104" ry="17" fill="${C.brownDark}" opacity=".08"/>
     <rect x="114" y="196" width="172" height="82" rx="32" fill="${C.muzzle}"/>
     <ellipse cx="200" cy="213" rx="20" ry="13" fill="${C.brownDark}"/>
     <ellipse cx="192" cy="214" rx="5" ry="4" fill="${C.ink}" opacity=".55"/><ellipse cx="208" cy="214" rx="5" ry="4" fill="${C.ink}" opacity=".55"/>
     <ellipse cx="196" cy="209" rx="4.5" ry="2.8" fill="#fff" opacity=".2"/>
     <g class="c-blush" opacity="${on(mood === "excited")}"><circle cx="134" cy="192" r="28" fill="${C.coral}" opacity=".19"/><circle cx="266" cy="192" r="28" fill="${C.coral}" opacity=".19"/></g>
     <g class="c-eyes-closed" opacity="${on(closed)}" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round">
      <path d="M151,149 Q165,140 179,149"/><path d="M221,149 Q235,140 249,149"/>
     </g>
     <g class="c-eyes-open" opacity="${on(!closed)}">
      <ellipse cx="165" cy="149" rx="${eyeR}" ry="${eyeR}" fill="${C.ink}"/><ellipse cx="235" cy="149" rx="${eyeR}" ry="${eyeR}" fill="${C.ink}"/>
      <circle cx="170" cy="143" r="3.5" fill="#fff"/><circle cx="240" cy="143" r="3.5" fill="#fff"/>
      <circle cx="172" cy="151" r="1.5" fill="#fff" opacity=".75"/><circle cx="242" cy="151" r="1.5" fill="#fff" opacity=".75"/>
     </g>
     <path class="c-mouth-sleepy" opacity="${on(mood === "sleepy")}" d="M186,254 Q200,258 214,254" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
     <path class="c-mouth-calm" opacity="${on(mood === "calm")}" d="M183,252 Q200,263 217,252" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
     <g class="c-mouth-cheerful" opacity="${on(mood === "cheerful")}">
      <path d="M181,251 Q200,265 219,251Z" fill="#fff" opacity=".5"/>
      <path d="M177,250 Q200,268 223,250" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
     </g>
     <g class="c-mouth-excited" opacity="${on(mood === "excited")}">
      <path d="M176,250 Q200,268 224,250Z" fill="${C.muzzle}" opacity=".6"/>
      <path d="M172,248 Q200,272 228,248" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="189" y="252" width="11" height="9" rx="2.5" fill="#fff"/><rect x="203" y="252" width="11" height="9" rx="2.5" fill="#fff"/>
     </g>
     <g class="c-mouth-yawn" opacity="0"><ellipse cx="200" cy="256" rx="20" ry="20" fill="${C.brownDark}"/><ellipse cx="200" cy="268" rx="9" ry="7" fill="${C.coral}" opacity=".7"/></g>
     ${badge ? `<g class="c-badge" transform="translate(348,96)"><circle r="${R * 1.12}" fill="${C.bg}"/><circle r="${R}" fill="${a}"/>${glyph[personality](a)}</g>` : ""}
    </g>
    <ellipse class="c-paw-l" cx="128" cy="382" rx="42" ry="25" fill="${C.brownDark}"/>
    <ellipse class="c-paw-r" cx="272" cy="382" rx="42" ry="25" fill="${C.brownDark}"/>
   </g>
  </g>
 </g>
</g>`;
  }

  // Idle life (CapyMotion in the app): breathing, blinks with an occasional double-blink, and an ear twitch.
  function capyIdle(el, gsap) {
    const breath = el.querySelector(".c-breath");
    const eyes = el.querySelector(".c-eyes-open");
    const ears = [el.querySelector(".c-ear-l"), el.querySelector(".c-ear-r")];
    const tweens = [
      gsap.to(breath, { scaleY: 1.016, scaleX: 0.994, transformOrigin: "50% 100%", duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 }),
    ];
    let n = 0;
    const blink = () => {
      const twice = ++n % 3 === 0;
      const t = gsap.timeline({ onComplete: () => el.isConnected && gsap.delayedCall(3 + Math.random() * 2.5, blink) })
        .to(eyes, { scaleY: 0.08, transformOrigin: "50% 50%", duration: 0.08, ease: "power1.in" })
        .to(eyes, { scaleY: 1, duration: 0.09, ease: "power1.out" });
      if (twice) t.to(eyes, { scaleY: 0.08, duration: 0.08, delay: 0.1 }).to(eyes, { scaleY: 1, duration: 0.09 });
    };
    gsap.delayedCall(1 + Math.random() * 2, blink);
    let side = 0;
    const twitch = () => {
      const ear = ears[side++ % 2];
      gsap.timeline({ onComplete: () => el.isConnected && gsap.delayedCall(4.5 + Math.random() * 2.5, twitch) })
        .to(ear, { y: -6, scaleY: 1.08, transformOrigin: "50% 100%", duration: 0.07 })
        .to(ear, { y: 0, scaleY: 1, duration: 0.45, ease: "elastic.out(1,0.3)" });
    };
    gsap.delayedCall(2 + Math.random() * 3, twitch);
    return tweens;
  }

  window.Capy = { capySVG, capyIdle, BADGES, ACCENT };
})();
