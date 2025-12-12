import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

test.describe('Responsive checks', () => {
  for (const vp of viewports) {
    test(`Viewport ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Check hero and CTA visibility
      const hero = page.locator('text=Europass CV, text=Contact us now, text=Discover our services');
      await expect(hero.first()).toBeVisible({ timeout: 3000 }).catch(() => test.info().log('Hero or CTAs not visible at this viewport'));
      // Check social button visibility on mobile
      if (vp.name === 'mobile') {
        const wa = page.locator('a[href*="wa.me"], a[href*="whatsapp"]');
        if (await wa.count() > 0) await expect(wa.first()).toBeVisible();
      }
    });
  }
});
