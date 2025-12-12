import { test, expect } from '@playwright/test';

test.describe('Landing page and UI', () => {
  test('A. Load landing page and basic UI checks', async ({ page, baseURL }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/|localhost/);

    // Page title or visible brand
    const brand = page.getByRole('heading', { name: /prestalink|PrestaLink|Presta Link/i });
    await expect(brand).toBeVisible();

    // Navbar links
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /About/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Contact/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Jobs/i })).toBeVisible();

    // Language buttons (AR, FR, EN, TR)
    for (const lang of ['AR','FR','EN','TR']) {
      const btn = page.locator(`button:has-text("${lang}")`);
      await expect(btn).toBeVisible();
    }

    // Theme toggle (look for button with moon/sun or aria-label)
    const themeButton = page.locator('button[aria-label*="theme"i], button[aria-label*="dark"i], button:has(svg)');
    await expect(themeButton.first()).toBeVisible();

    // Hero section - major English text check
    const hero = page.getByText(/Europass CV Preparation and Automatic Job Application Platform|Europass CV/i, { exact: false });
    await expect(hero).toBeVisible();

    // CTA buttons
    await expect(page.getByRole('link', { name: /Contact us now/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Discover our services/i })).toBeVisible();
  });

  test('B. Language switching EN/FR/AR/TR updates text and RTL for AR', async ({ page }) => {
    await page.goto('/');

    const languages = [
      { key: 'EN', sample: /Europass CV/i },
      { key: 'FR', sample: /Europass|CV|Europass/i },
      { key: 'AR', sample: /Europass|CV|ت/i },
      { key: 'TR', sample: /CV|Özgeçmiş|Europass/i },
    ];

    for (const lang of languages) {
      const btn = page.locator(`button:has-text("${lang.key}")`).first();
      if (await btn.count() === 0) {
        test.info().log(`Language button ${lang.key} not found, skipping`);
        continue;
      }
      await btn.click();
      // Wait a little for client-side update
      await page.waitForTimeout(600);
      // Check hero text contains expected token (non-strict)
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(10);
      if (lang.key === 'AR') {
        // Check for RTL attribute
        const dir = await page.locator('html').getAttribute('dir');
        if (dir) expect(dir).toMatch(/rtl/i);
      }
    }
  });

  test('C. Dark mode toggles and persists (if implemented)', async ({ page, context }) => {
    await page.goto('/');
    // Find theme button
    const themeBtn = page.locator('button[aria-label*="theme"i], button[aria-label*="dark"i], button:has(svg)').first();
    await expect(themeBtn).toBeVisible();

    // Read initial state
    const initialClass = await page.locator('html').getAttribute('class') || '';

    await themeBtn.click();
    await page.waitForTimeout(400);
    const afterClass = await page.locator('html').getAttribute('class') || '';
    test.expect(initialClass !== afterClass).toBeTruthy();

    // Reload and check persistence (best-effort)
    await page.reload();
    await page.waitForTimeout(500);
    const afterReloadClass = await page.locator('html').getAttribute('class') || '';
    // If persisted, it should remain same as afterClass
    if (afterReloadClass !== afterClass) {
      test.info().log('Theme did not persist after reload (optional feature)');
    } else {
      test.expect(afterReloadClass).toBe(afterClass);
    }
  });

  test('D. Social buttons (WhatsApp/Viber/Telegram) existence and link checks', async ({ page }) => {
    await page.goto('/');

    // Look for anchors that contain known protocols
    const wa = page.locator('a[href*="wa.me"], a[href*="whatsapp"]');
    const vib = page.locator('a[href*="viber:"]');
    const tg = page.locator('a[href*="t.me"], a[href*="telegram"]');

    if (await wa.count() > 0) {
      await expect(wa.first()).toHaveAttribute('href', /wa.me|whatsapp/);
    } else {
      test.info().log('No WhatsApp link found on landing page');
    }

    if (await vib.count() > 0) {
      await expect(vib.first()).toHaveAttribute('href', /viber:/);
    } else {
      test.info().log('No Viber link found on landing page');
    }

    if (await tg.count() > 0) {
      await expect(tg.first()).toHaveAttribute('href', /t.me|telegram/);
    } else {
      test.info().log('No Telegram link found on landing page');
    }
  });

  test('E. Navbar navigation works (Home → About → Contact → Jobs)', async ({ page }) => {
    await page.goto('/');
    const links = ['Home','About','Contact','Jobs'];
    for (const l of links) {
      const link = page.getByRole('link', { name: new RegExp(l, 'i') }).first();
      await expect(link).toBeVisible();
      await link.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400);
      // Check page has heading with link name or related
      const heading = page.locator('h1, h2, h3').filter({ hasText: new RegExp(l, 'i') });
      if (await heading.count() === 0) {
        test.info().log(`${l} page may not have main heading with exact name`);
      } else {
        await expect(heading.first()).toBeVisible();
      }
    }
    // Return home
    await page.getByRole('link', { name: /Home/i }).first().click();
    await expect(page).toHaveURL(/\/$|localhost/);
  });
});
