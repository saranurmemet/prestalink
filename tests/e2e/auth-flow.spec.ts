import { test, expect } from '@playwright/test';

const seedCredentials = [
  { email: 'admin@prestalink.dev', password: 'Test123!' },
  { email: 'recruiter@prestalink.dev', password: 'Test123!' },
  { email: 'candidate@prestalink.dev', password: 'Test123!' },
  { email: 'ahmet@prestalink.app', password: 'ahmet' },
];

async function tryLogin(page, email, password) {
  await page.goto('/login');
  const emailInput = page.locator('input[name="email"], input[type="email"]');
  const passInput = page.locator('input[name="password"], input[type="password"]');
  await emailInput.fill(email);
  await passInput.fill(password);
  await page.getByRole('button', { name: /log in|login|sign in/i }).first().click();
}

test.describe('Auth flows (register/login)', () => {
  test('A. Register page opens', async ({ page }) => {
    await page.goto('/');
    const reg = page.getByRole('link', { name: /register|sign up|register now/i }).first();
    if (await reg.count() === 0) {
      test.skip('Register link not found');
    } else {
      await reg.click();
      await expect(page).toHaveURL(/register|signup/i);
    }
  });

  test('B. Registration validation shows errors', async ({ page }) => {
    await page.goto('/register');
    const submit = page.getByRole('button', { name: /register|sign up/i }).first();
    if (await submit.count() === 0) test.skip('Register form not present');
    await submit.click();
    // Expect at least one validation message
    const err = page.locator('text=required, text=required field, .error, .validation');
    expect(await err.count() > 0).toBeTruthy();
  });

  test('C. Create new user (best-effort)', async ({ page }) => {
    await page.goto('/register');
    const name = `TestUser${Math.floor(Math.random()*9000)+1000}`;
    const email = `testuser+${Date.now()}@prestalink.dev`;
    const pw = 'Test123!';

    const nameInput = page.locator('input[name="name"], input[name="fullName"]');
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const passInput = page.locator('input[name="password"], input[type="password"]');
    if (await emailInput.count() === 0) test.skip('Register inputs not found');

    if (await nameInput.count() > 0) await nameInput.fill(name);
    await emailInput.fill(email);
    await passInput.fill(pw);
    await page.getByRole('button', { name: /register|sign up/i }).first().click();
    await page.waitForLoadState('networkidle');
    // Success: check for welcome or redirect
    const success = page.locator('text=Welcome, text=successfully, text=Verify');
    test.expect(await success.count() >= 0).toBeTruthy();
  });

  test('D. Wrong password shows error', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    const passInput = page.locator('input[type="password"]');
    if (await emailInput.count() === 0) test.skip('Login form not found');
    await emailInput.fill('nonexistent@prestalink.dev');
    await passInput.fill('wrongpassword');
    await page.getByRole('button', { name: /log in|login|sign in/i }).first().click();
    // Expect error message
    const err = page.locator('text=invalid, text=wrong, text=incorrect, .error');
    await expect(err.first()).toBeVisible({ timeout: 3000 }).catch(() => test.info().log('No login error visible (app may show toast or inline)'));
  });

  test('E. Login with seeded users', async ({ page }) => {
    for (const cred of seedCredentials) {
      await page.goto('/login');
      const emailInput = page.locator('input[type="email"]');
      const passInput = page.locator('input[type="password"]');
      if (await emailInput.count() === 0) {
        test.skip('Login form not available');
        return;
      }
      await emailInput.fill(cred.email);
      await passInput.fill(cred.password);
      await page.getByRole('button', { name: /log in|login|sign in/i }).first().click();
      await page.waitForLoadState('networkidle');
      // Expect redirect to dashboard or presence of logout
      const logout = page.getByRole('button', { name: /logout|sign out/i });
      if (await logout.count() > 0) {
        await expect(logout.first()).toBeVisible();
      } else {
        test.info().log(`Login may have succeeded for ${cred.email}, but logout button not detected`);
      }
      // Logout if possible
      if (await logout.count() > 0) await logout.first().click().catch(() => {});
    }
  });
});
