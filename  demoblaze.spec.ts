import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.demoblaze.com/';
const USERNAME = 'testuser123';
const PASSWORD = 'testpassword123';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

// 1️⃣ Title verification
test('Home page has correct title', async ({ page }) => {
  await expect(page).toHaveTitle(/STORE/);
});

// 2️⃣ Open Login modal
test('Open Log in modal', async ({ page }) => {
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page.locator('#logInModal')).toBeVisible();
  await expect(page.locator('#logInModalLabel')).toHaveText('Log in');
});

// 3️⃣ Log in (negative test example)
test('Try to log in with invalid credentials', async ({ page }) => {
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.fill('#loginusername', USERNAME);
  await page.fill('#loginpassword', PASSWORD);
  await page.click('button:has-text("Log in")');

  // Expect an alert for wrong credentials
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Wrong password.');
    await dialog.dismiss();
  });
});

// 4️⃣ Add first product to cart
test('Add first product to cart', async ({ page }) => {
  await page.locator('.hrefch').first().click();
  await expect(page.locator('.name')).toBeVisible();

  await page.click('text=Add to cart');

  // Expect alert
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Product added');
    await dialog.accept();
  });
});

// 5️⃣ Contact form opens correctly
test('Open Contact form', async ({ page }) => {
  await page.getByRole('link', { name: 'Contact' }).click();
  await expect(page.locator('#exampleModal')).toBeVisible();
  await page.fill('#recipient-email', 'qa@test.com');
  await page.fill('#recipient-name', 'QA User');
  await page.fill('#message-text', 'This is an automated test message.');
  await expect(page.getByText('Send message')).toBeVisible();
});
