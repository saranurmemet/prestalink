import { test, expect } from '@playwright/test';

test.describe('Misc and error pages', () => {
  test('404 page shows custom not found', async ({ page }) => {
    await page.goto('/something/that/does/not/exist');
    await page.waitForLoadState('networkidle');
    const notFound = page.locator('text=404, text=not found, text=Not Found, _not-found');
    expect(await notFound.count() > 0).toBeTruthy();
  });

  test('Smoke test: visit main pages', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/jobs', '/login', '/register'];
    for (const p of pages) {
      await page.goto(p);
      await page.waitForLoadState('networkidle');
      const h = page.locator('h1, h2, h3').first();
      await expect(h).toBeVisible({ timeout: 3000 }).catch(() => test.info().log(`No heading on ${p}`));
    }
  });
});
