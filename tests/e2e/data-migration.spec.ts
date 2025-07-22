import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Data Migration E2E Test', () => {
  test('should migrate old verification field to initialsYearOne and initialsYearTwo', async ({ page }) => {
    // Intercept the log.json request and serve the mock old data
    await page.route('**/log.json', route => {
      const mockDataPath = path.resolve(__dirname, 'mock-data/old-verification-data.json');
      const mockData = fs.readFileSync(mockDataPath, 'utf-8');
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: mockData,
      });
    });

    // Navigate to the application
    await page.goto('http://localhost:5174/teacher-induction-log/');
    await page.waitForURL('http://localhost:5174/teacher-induction-log/');

    page.on('console', msg => console.log('Browser console:', msg.text()));
    await page.pause();

    // Wait for the application to load and process the data
    await expect(page.locator('[data-testid="induction-log"]')).toBeVisible({ timeout: 10000 });

    // Verify that the migrated data is displayed in the initialsYearOne and initialsYearTwo fields
    // For Summer Academy, Day 1
    const summerAcademyDay1Row = page.locator('#summerAcademy-section tbody tr').nth(0);
    const yearOneInitialsInput = summerAcademyDay1Row.locator('.field-type-initialsYearOne input');
    const yearTwoInitialsInput = summerAcademyDay1Row.locator('.field-type-initialsYearTwo input');

    await expect(yearOneInitialsInput).toHaveValue('Old Verification 1');
    await expect(yearTwoInitialsInput).toHaveValue('Old Verification 1');

    // You can add more assertions for other sections if needed
    // For Induction Seminars, Seminar 1
    const inductionSeminarsRow = page.locator('#inductionSeminars-section tbody tr').nth(0);
    const inductionYearOneInitialsInput = inductionSeminarsRow.locator('.field-type-initialsYearOne input');
    const inductionYearTwoInitialsInput = inductionSeminarsRow.locator('.field-type-initialsYearTwo input');

    await expect(inductionYearOneInitialsInput).toHaveValue('Old Verification 2');
    await expect(inductionYearTwoInitialsInput).toHaveValue('Old Verification 2');
  });
});