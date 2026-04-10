import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;

// Collect all HTML files
const files = [];
function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (f.endsWith('.html')) files.push(full);
  });
}
walk(root);

files.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).split(path.sep).join('/');
  const inExpansion = rel.startsWith('pages/expansion/');

  let expPrefix;
  const depth = rel.split('/').length - 1;
  if (depth === 0) expPrefix = 'pages/expansion/';
  else if (inExpansion) expPrefix = '';
  else expPrefix = '../expansion/';

  const sba   = expPrefix + 'sba-loans.html';
  const equip = expPrefix + 'equipment-financing.html';
  const mca   = expPrefix + 'mca.html';

  const desktopNew = `<a href="${sba}"><span class="drop-icon">🏛</span> SBA Loans</a>` +
                     `<a href="${equip}"><span class="drop-icon">⚙️</span> Equipment Financing</a>` +
                     `<a href="${mca}"><span class="drop-icon">⚡</span> Merchant Cash Advance</a>`;

  const mobileNew = `<a href="${sba}">SBA Loans</a>` +
                    `<a href="${equip}">Equipment Financing</a>` +
                    `<a href="${mca}">Merchant Cash Advance</a>`;

  // 1. Rename Funding -> Business Financing (desktop nav-link)
  html = html.replace(/(class="nav-link(?:\s+active)?)">Funding (<svg)/g, '$1">Business Financing $2');

  // 2. Remove Credit Stacking from desktop dropdown
  html = html.replace(/<a href="[^"]*credit-stacking\.html"><span class="drop-icon">🗂<\/span> Credit Stacking<\/a>/g, '');

  // 3. Add expansion items after Term Loans in desktop dropdown
  html = html.replace(/(<a href="[^"]*term-loans\.html"><span class="drop-icon">📋<\/span> Term Loans<\/a>)(<\/div><\/li>)/g,
    '$1' + desktopNew + '$2');

  // 4. Remove Expansion desktop li block
  html = html.replace(/<li class="nav-item"><a href="#" class="nav-link(?:\s+active)?">Expansion <svg[^>]*><polyline[^/]*\/><\/svg><\/a><div class="dropdown">.*?<\/div><\/li>/g, '');

  // 5. Rename Funding -> Business Financing in mobile toggle
  html = html.replace(/>Funding <span class="toggle-arrow">/g, '>Business Financing <span class="toggle-arrow">');

  // 6. Remove Credit Stacking from mobile
  html = html.replace(/<a href="[^"]*credit-stacking\.html">Credit Stacking<\/a>/g, '');

  // 7. Add expansion items after Term Loans in mobile
  html = html.replace(/(<a href="[^"]*term-loans\.html">Term Loans<\/a>)(<\/div>)/g,
    '$1' + mobileNew + '$2');

  // 8. Remove Expansion mobile toggle + content
  html = html.replace(/<div class="mobile-dropdown-toggle">Expansion <span class="toggle-arrow">▾<\/span><\/div><div class="mobile-dropdown-content">.*?<\/div>/g, '');

  fs.writeFileSync(file, html, 'utf8');
  console.log('Updated:', rel);
});

console.log('\nDone! Total files processed:', files.length);
