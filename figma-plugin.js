(async () => {

  // ─── TOKENS ───────────────────────────────────────
  function hex(h) {
    return {
      r: parseInt(h.slice(1,3),16)/255,
      g: parseInt(h.slice(3,5),16)/255,
      b: parseInt(h.slice(5,7),16)/255
    };
  }
  const C = {
    bg:     hex('060D07'),
    bgAlt:  hex('0A1A0C'),
    accent: hex('E1BD37'),
    white:  hex('FFFFFF'),
    muted:  hex('7A9B7C'),
    dim:    hex('3A5A3C'),
    black:  hex('000000'),
  };
  const W = 1440;
  const PAD = 80;

  // ─── LOAD FONTS ───────────────────────────────────
  const fontFamilies = [
    { family: "Inter", style: "Regular"   },
    { family: "Inter", style: "Medium"    },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold"      },
  ];
  await Promise.all(fontFamilies.map(f => figma.loadFontAsync(f)));

  // ─── HELPERS ──────────────────────────────────────
  function solid(color, opacity = 1) {
    return [{ type: 'SOLID', color, opacity }];
  }

  function mkFrame(name, w, h, fill) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = fill ? solid(fill) : [];
    f.clipsContent = true;
    return f;
  }

  function mkRect(name, w, h, color, opacity = 1) {
    const r = figma.createRectangle();
    r.name = name;
    r.resize(w, h);
    r.fills = solid(color, opacity);
    return r;
  }

  function mkText(str, size, style, color, opts = {}) {
    const t = figma.createText();
    t.fontName = { family: "Inter", style };
    t.fontSize = size;
    t.fills = solid(color);
    if (opts.width) { t.textAutoResize = "HEIGHT"; t.resize(opts.width, 20); }
    if (opts.ls !== undefined) t.letterSpacing = { value: opts.ls, unit: "PERCENT" };
    if (opts.lh !== undefined) t.lineHeight = { value: opts.lh, unit: "PERCENT" };
    t.characters = str;
    return t;
  }

  function place(node, parent, x, y) {
    parent.appendChild(node);
    node.x = x;
    node.y = y;
  }

  function hRule(parent, x, y, w = W - PAD*2) {
    const r = mkRect("divider", w, 1, C.white, 0.07);
    place(r, parent, x, y);
  }

  function label(str, parent, x, y) {
    const t = mkText(str.toUpperCase(), 10, "Medium", C.accent, { ls: 15 });
    place(t, parent, x, y);
  }

  // ─── BUILD PAGE ───────────────────────────────────
  const page = figma.currentPage;

  // Root frame (full page)
  const totalH = 900 + 620 + 560 + 620 + 520;
  const root = mkFrame("FFINN — Site (1440px)", W, totalH, C.bg);
  page.appendChild(root);

  let Y = 0; // running Y offset for sections

  // ═══════════════════════════════════════════
  // HERO (900px)
  // ═══════════════════════════════════════════
  const HERO_H = 900;
  const hero = mkFrame("Hero", W, HERO_H, C.bg);
  place(hero, root, 0, Y);

  // Dark green gradient effect
  const grad = mkRect("gradient", W, HERO_H, C.bgAlt, 0.6);
  place(grad, hero, 0, 0);

  // Image placeholder
  const imgBox = mkRect("[ hero.jpg — replace with photo ]", W - PAD*2, 700, C.white, 0.03);
  place(imgBox, hero, PAD, 80);
  const imgLabel = mkText("[ Hero image: drop hero.jpg here ]", 14, "Regular", C.dim, { width: 600 });
  place(imgLabel, hero, W/2 - 200, 420);

  // Header socials
  const socialStr = "Instagram  ✦  Mixcloud  ✦  Soundcloud";
  const socials = mkText(socialStr, 10, "Medium", C.muted, { ls: 10 });
  place(socials, hero, W/2 - 120, 28);

  // Hero bottom content
  const eyebrow = mkText("DJ WORKSHOPS WITH FFINN — BRISTOL, UK", 10, "Medium", C.muted, { ls: 20 });
  place(eyebrow, hero, PAD, HERO_H - 108);

  // Book button
  const btn = mkFrame("CTA — Book a Session", 220, 50, C.accent);
  place(btn, hero, PAD, HERO_H - 76);
  const btnTxt = mkText("BOOK A SESSION", 11, "Medium", C.black, { ls: 12 });
  place(btnTxt, btn, 24, 17);

  Y += HERO_H;

  // ═══════════════════════════════════════════
  // ABOUT (620px)
  // ═══════════════════════════════════════════
  const ABOUT_H = 620;
  const about = mkFrame("About", W, ABOUT_H, C.bg);
  place(about, root, 0, Y);

  // Left col
  label("About FFINN", about, PAD, 80);
  const aboutH2 = mkText("aka Fiona (they/she)", 38, "Bold", C.white, { width: 560 });
  place(aboutH2, about, PAD, 108);

  // Badges
  const badgeDefs = ["Professional DJ — 10+ years", "DJ Tutor — 5 years", "Enhanced DBS Checked"];
  let bx = PAD;
  badgeDefs.forEach(bd => {
    const bFrame = mkFrame(`badge: ${bd}`, 0, 28, null);
    bFrame.fills = [];
    bFrame.strokes = [{ type: "SOLID", color: C.white }];
    bFrame.strokeWeight = 1;
    bFrame.opacity = 0.3;
    const bTxt = mkText(bd.toUpperCase(), 8, "Medium", C.muted, { ls: 7 });
    // Simple badge as text with border approximation (use rect)
    const badgeRect = mkRect(bd, bTxt.width + 24, 26, C.white, 0.04);
    place(badgeRect, about, bx, 172);
    const btLabel = mkText(bd, 8, "Medium", C.muted, { ls: 7 });
    place(btLabel, about, bx + 10, 178);
    bx += badgeRect.width + 10;
  });

  const aboutBody = mkText(
    "My unique skill lies in multi-genre musical journeys which have the ability to soundtrack a variety of environments. I enjoy an eclectic list of genres including Dubstep/140, DnB/Halftime, Jungle, Juke/Footwork, Garage, Electro, Breaks, House/Techno, Trance, IDM/Electronica, Hip Hop, Post-Rock, Indie, Metal and all kinds of Pop music.",
    15, "Regular", C.white, { width: 560, lh: 175 }
  );
  place(aboutBody, about, PAD, 224);

  const mixLink = mkText("Check out my mixes →", 14, "Medium", C.accent);
  place(mixLink, about, PAD, 420);

  // Right col
  const RX = W/2 + 40;
  label("About the Workshops", about, RX, 80);

  const workshopBullets = [
    "CDJ-oriented DJ workshops",
    "Beginner and Intermediate skill levels",
    "1-on-1 and small groups",
    "In-person at Pirate Studios – Bristol, UK",
  ];
  workshopBullets.forEach((b, i) => {
    hRule(about, RX, 108 + i * 52);
    const bt = mkText("— " + b, 13, "Regular", C.muted, { width: 580 });
    place(bt, about, RX, 118 + i * 52);
  });
  hRule(about, RX, 108 + 4 * 52);

  const workshopDesc = mkText(
    "My workshops are informed by my experience as a neurodiverse, queer, femme-presenting selector and technician for over a decade. I'll be working with your personal goals and access needs — a safe, informal, playful space where mistakes are the best learning points.",
    14, "Regular", C.white, { width: 580, lh: 175 }
  );
  place(workshopDesc, about, RX, 340);

  Y += ABOUT_H;

  // ═══════════════════════════════════════════
  // TOPICS (560px)
  // ═══════════════════════════════════════════
  const TOPICS_H = 560;
  const topics = mkFrame("Topics I Cover", W, TOPICS_H, C.bgAlt);
  place(topics, root, 0, Y);

  label("Topics I Cover", topics, PAD, 72);
  const topicSub = mkText("but not limited to:", 12, "Regular", C.dim, { ls: 0 });
  place(topicSub, topics, PAD, 96);

  const topicsLeft = [
    "Anatomy of a song",
    "Counting bars",
    "Rekordbox 101 Pt.1 — Essentials for CDJs",
    "Rekordbox 101 Pt.2 — Advanced features",
    "Equipment 101 Pt.1 — Standard CDJ setup",
    "Equipment 101 Pt.2 — Advanced use",
    "Lining up tracks / track cueing",
  ];
  const topicsRight = [
    "Beat matching",
    "Mixing with EQs",
    "Finding the right cue point(s)",
    "Mixing nuances & flairs",
    "Recovering from mistakes",
    "Curating a mixtape / multi-genre journey",
    "DJ etiquette",
    "Insights from a neurodiverse, queer,\nfemme-presenting industry veteran",
  ];

  topicsLeft.forEach((item, i) => {
    hRule(topics, PAD, 138 + i * 46, 580);
    const t = mkText("↳  " + item, 12, "Regular", C.muted, { width: 580 });
    place(t, topics, PAD, 148 + i * 46);
  });

  topicsRight.forEach((item, i) => {
    hRule(topics, W/2 + 40, 138 + i * 46, 580);
    const t = mkText("↳  " + item, 12, "Regular", C.muted, { width: 580 });
    place(t, topics, W/2 + 40, 148 + i * 46);
  });

  hRule(topics, PAD, 138 + 7 * 46, W - PAD*2);
  const footnote = mkText("Lessons held in-person at Pirate Studios, Bristol, UK. Prices include studio hire.", 11, "Regular", C.dim, { width: W - PAD*2 });
  place(footnote, topics, PAD, 148 + 7 * 46);

  Y += TOPICS_H;

  // ═══════════════════════════════════════════
  // PACKAGES (620px)
  // ═══════════════════════════════════════════
  const PKGS_H = 620;
  const pkgs = mkFrame("Packages", W, PKGS_H, C.bg);
  place(pkgs, root, 0, Y);

  // Big yellow heading
  const pkgHeading = mkText("Packages", 42, "Bold", C.accent, { width: W - PAD*2 });
  place(pkgHeading, pkgs, PAD, 72);

  hRule(pkgs, PAD, 140, W - PAD*2);

  const accordionRows = [
    { title: "Crash Course — Beginner",    price: "£130  /  3 hrs" },
    { title: "Crash Course — Intermediate",price: "£130  /  3 hrs" },
    { title: "The Full Monty",             price: "£600  /  15 hrs" },
    { title: "Bespoke Tuition",            price: "£45 / hr  ·  £130 / 3 hrs" },
    { title: "Mentorship",                 price: "£20 / hr  ·  £50 / month" },
  ];

  const ROW_H = 68;
  accordionRows.forEach((row, i) => {
    const ry = 140 + i * ROW_H;

    // Row hover bg
    const rowBg = mkRect("row bg", W - PAD*2, ROW_H - 1, C.white, 0.02);
    place(rowBg, pkgs, PAD, ry);

    // Title
    const rtitle = mkText(row.title, 17, "Medium", C.white);
    place(rtitle, pkgs, PAD + 16, ry + 22);

    // Price
    const rprice = mkText(row.price, 13, "Regular", C.accent);
    place(rprice, pkgs, W - PAD - 380, ry + 24);

    // Toggle
    const toggle = mkText("+", 18, "Regular", C.accent);
    place(toggle, pkgs, W - PAD - 16, ry + 22);

    hRule(pkgs, PAD, ry + ROW_H, W - PAD*2);
  });

  Y += PKGS_H;

  // ═══════════════════════════════════════════
  // BOOKING (520px)
  // ═══════════════════════════════════════════
  const BOOK_H = 520;
  const booking = mkFrame("Booking Policy", W, BOOK_H, C.bgAlt);
  place(booking, root, 0, Y);

  label("Booking Policy", booking, PAD, 72);

  const policies = [
    "→  Sessions available on the hour from 10am–7pm on Tuesdays, Fridays, and Saturdays.",
    "→  Personal sessions: 50% non-refundable deposit upfront; remainder after the session.",
    "→  Gift sessions: full payment required upfront.",
    "→  Your deposit or full payment is valid for one year from payment date.",
    "→  Sessions can be rescheduled with at least 24 hours' notice.",
    "→  Bookings are subject to availability.",
  ];

  policies.forEach((p, i) => {
    hRule(booking, PAD, 100 + i * 46, W - PAD*2);
    const pt = mkText(p, 14, "Regular", C.white, { width: 840, lh: 175 });
    place(pt, booking, PAD, 110 + i * 46);
  });
  hRule(booking, PAD, 100 + 6 * 46, W - PAD*2);

  // CTA centred
  const bookBtn2 = mkFrame("CTA — Book 3hr", 300, 52, C.accent);
  place(bookBtn2, booking, W/2 - 150, BOOK_H - 100);
  const bookBtn2Txt = mkText("BOOK YOUR 3-HOUR SESSION", 11, "Medium", C.black, { ls: 12 });
  place(bookBtn2Txt, bookBtn2, 24, 18);

  const orTxt = mkText("— or —", 11, "Regular", C.dim, { ls: 10 });
  place(orTxt, booking, W/2 - 28, BOOK_H - 36);

  // Resize root to actual height
  root.resize(W, Y + BOOK_H);

  // ─── DONE ─────────────────────────────────
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("✅ FFINN site generated in Figma!", { timeout: 4000 });

})().catch(err => { figma.notify("❌ Error: " + err.message, { error: true }); console.error(err); });
