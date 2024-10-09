// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Learn Jenkins/);
});

test('has Jenkins in the body', async ({ page }) => {
  await page.goto('/');

  const isVisible = await page.locator('a:has-text("Learn Jenkins on Udemy")').isVisible();
  expect(isVisible).toBeTruthy();
});

test('has expected app version', async ({ page }) => {
  await page.goto('/');

  const expectedAppVersion = process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : '1';
  
  console.log(`Expected App Version: ${expectedAppVersion}`);

  // Wait for the element to be present
  await page.waitForSelector(`p:has-text("Application version: ${expectedAppVersion}")`, { timeout: 5000 });

  // Take a screenshot for debugging if needed
  await page.screenshot({ path: 'screenshot.png' });

  // Check for the existence of the element first
  const elementCount = await page.locator(`p:has-text("Application version: ${expectedAppVersion}")`).count();
  expect(elementCount).toBeGreaterThan(0); // Ensure the element exists

  // Now check if the element is visible
  const isVisible = await page.locator(`p:has-text("Application version: ${expectedAppVersion}")`).isVisible();
  expect(isVisible).toBeTruthy();

  // Optionally log the entire page content if needed for debugging
  const pageContent = await page.content();
  console.log(pageContent);
});

