import { test, expect } from '@playwright/test';

test.describe('Cover Letter Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000/cover-letter');
  });

  test('should show validation error if required fields are missing', async ({ page }) => {
    await page.click('button.generate-button');

    // Wait for validation errors to appear
    await expect(page.locator('#validation-errors')).toBeVisible({ timeout: 5000 });

    const errorList = page.locator('#error-list li');
    await expect(errorList.first()).toBeVisible();
    const firstError = await errorList.first().textContent();
    expect(firstError).toContain('required');
  });

  test('should generate cover letter with valid inputs', async ({ page }) => {
    // Fill required fields
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="jobTitle"]', 'Software Engineer');
    await page.fill('input[name="company"]', 'Tech Corp');
    await page.fill('input[name="skills"]', 'JavaScript, Node.js, React');
    await page.fill('textarea[name="experience"]', 'I have 5 years of experience in software development, specializing in JavaScript, Node.js, and React. I have successfully led multiple projects and delivered high-quality solutions.');

    await page.click('button.generate-button');

    // Wait for cover letter output
    await expect(page.locator('#output')).toBeVisible({ timeout: 10000 });
    const coverLetterText = await page.locator('#coverLetterOutput').textContent();
    expect(coverLetterText.length).toBeGreaterThan(50);
    expect(coverLetterText).toContain('John Doe');
  });
});
