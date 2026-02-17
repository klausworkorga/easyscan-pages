/**
 * Lightweight client-side i18n (~1KB).
 * - Reads preference from localStorage
 * - Falls back to navigator.language
 * - Swaps all [data-t] elements
 * - Language switch without reload
 */

import en from './en.json';
import de from './de.json';

export type Lang = 'en' | 'de';
const dicts: Record<Lang, typeof en> = { en, de };

function resolve(obj: unknown, path: string): string | undefined {
  return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj) as string | undefined;
}

export function detectLang(): Lang {
  const stored = localStorage.getItem('lang');
  if (stored === 'en' || stored === 'de') return stored;
  return (navigator.language || '').startsWith('de') ? 'de' : 'en';
}

export function setLang(lang: Lang) {
  localStorage.setItem('lang', lang);
  applyLang(lang);
}

export function applyLang(lang: Lang) {
  const dict = dicts[lang];
  document.documentElement.lang = lang;

  // Swap text content
  document.querySelectorAll<HTMLElement>('[data-t]').forEach(el => {
    const key = el.dataset.t!;
    const val = resolve(dict, key);
    if (val) el.textContent = val;
  });

  // Swap innerHTML (for elements with links/strong)
  document.querySelectorAll<HTMLElement>('[data-th]').forEach(el => {
    const key = el.dataset.th!;
    const val = resolve(dict, key);
    if (val) el.innerHTML = val;
  });

  // Update meta
  const title = resolve(dict, 'meta.title');
  if (title) document.title = title;
  const desc = document.querySelector('meta[name="description"]');
  const descVal = resolve(dict, 'meta.description');
  if (desc && descVal) desc.setAttribute('content', descVal);

  // Update language switcher
  document.querySelectorAll<HTMLElement>('[data-lang-switch]').forEach(btn => {
    const isActive = btn.dataset.langSwitch === lang;
    if (isActive) {
      btn.classList.add('lang-active');
      btn.removeAttribute('role');
      btn.style.cursor = '';
    } else {
      btn.classList.remove('lang-active');
      btn.setAttribute('role', 'button');
      btn.style.cursor = 'pointer';
    }
  });
}

export function initI18n() {
  const lang = detectLang();
  applyLang(lang);

  // Wire up language switcher clicks
  document.querySelectorAll<HTMLElement>('[data-lang-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.langSwitch as Lang;
      if (target !== detectLang()) setLang(target);
    });
  });
}
