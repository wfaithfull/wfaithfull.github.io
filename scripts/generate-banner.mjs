import sharp from 'sharp';

const W = 1200;
const H = 630;

const bg = '#0a0a0a';
const heading = '#fafafa';
const muted = '#a1a1aa';
const accent = '#38bdf8';
const border = '#27272a';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#1a1a1a" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="${H - 1}" width="${W}" height="1" fill="${border}"/>

  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
    <text x="80" y="265" font-size="76" font-weight="800" fill="${heading}" letter-spacing="-1.5">
      Dr. Will Faithfull
    </text>
    <text x="80" y="330" font-size="34" font-weight="500" fill="${muted}">
      CEO @ ExaDev  ·  Investor @ ExaCap
    </text>
    <text x="80" y="380" font-size="22" font-weight="400" fill="${muted}">
      Engineer, builder, startup accelerator
    </text>

    <line x1="80" y1="490" x2="200" y2="490" stroke="${accent}" stroke-width="3"/>
    <text x="80" y="540" font-size="28" font-weight="600" fill="${accent}">
      faithfull.me
    </text>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(new URL('../public/banner.jpg', import.meta.url).pathname);

console.log('Wrote public/banner.jpg');
