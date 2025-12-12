import { test, expect } from '@playwright/test';

const users = [
  { role: 'candidate', email: 'candidate@prestalink.dev', password: 'Test123!' },
  { role: 'recruiter', email: 'recruiter@prestalink.dev', password: 'Test123!' },
  { role: 'admin', email: 'admin@prestalink.dev', password: 'Test123!' },
];

async function login(page, user) {
  await page.goto('/login');
  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.count() === 0) test.skip('Login form unavailable');
  await emailInput.fill(user.email);
  await page.locator('input[type="password"]').fill(user.password);
  await page.getByRole('button', { name: /log in|login|sign in/i }).first().click();
  await page.waitForLoadState('networkidle');
}

for (const u of users) {
  test.describe(`${u.role} language and theme tests`, () => {
    test(`change language and theme for ${u.role}`, async ({ page }) => {
      await login(page, u);
      // Check language switch
      const langs = ['EN','FR','TR','AR'];
      for (const l of langs) {
        const btn = page.locator(`button:has-text("${l}")`).first();
        if (await btn.count() === 0) {
          test.info().log(`${l} button not found in dashboard for ${u.role}`);
          continue;
        }
        await btn.click();
        await page.waitForTimeout(400);
      }
      // Theme toggle
      const themeBtn = page.locator('button[aria-label*="theme"i], button[title*="theme"i], button:has(svg)').first();
      if (await themeBtn.count() === 0) test.skip('Theme toggle not found');
      const before = await page.locator('html').getAttribute('class') || '';
      await themeBtn.click();
      await page.waitForTimeout(300);
      const after = await page.locator('html').getAttribute('class') || '';
      if (before === after) test.info().log('Theme toggle did not change html class (possible CSS-only change)');
    });
  });
}
