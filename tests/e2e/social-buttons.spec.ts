import { test, expect } from '@playwright/test';

const pagesToCheck = ['/', '/contact', '/jobs'];

test.describe('Social buttons across pages', () => {
  for (const p of pagesToCheck) {
    test(`Check social buttons on ${p}`, async ({ page }) => {
      await page.goto(p);
      await page.waitForLoadState('networkidle');

      const wa = page.locator('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp.com"]');
      const vib = page.locator('a[href*="viber:"]');
      const tg = page.locator('a[href*="t.me"], a[href*="telegram"]');

      if (await wa.count() > 0) {
        await expect(wa.first()).toHaveAttribute('href', /wa.me|whatsapp|api.whatsapp.com/);
      } else {
        test.info().log(`WhatsApp not found on ${p}`);
      }
      if (await vib.count() > 0) {
        await expect(vib.first()).toHaveAttribute('href', /viber:/);
      } else {
        test.info().log(`Viber not found on ${p}`);
      }
      if (await tg.count() > 0) {
        await expect(tg.first()).toHaveAttribute('href', /t.me|telegram/);
      } else {
        test.info().log(`Telegram not found on ${p}`);
      }

      // If floating/sticky buttons, ensure they persist after scroll
      if (await wa.count() > 0) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(300);
        await expect(wa.first()).toBeVisible();
      }
    });
  }
});
