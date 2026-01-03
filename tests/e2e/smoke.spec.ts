import { test, expect } from '@playwright/test';
import path from 'path';

// Helper to make a nice file name from the test title
function safeFileName(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

test('home page loads and shows navigation', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByText('Hotel Logistics')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Locations' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Movements' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Suppliers' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Purchase Orders' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Maintenance' })).toBeVisible();

  // Screenshot evidence for this test
  const fileName = safeFileName(testInfo.title);
  await page.screenshot({
    path: path.join('tests', 'evidence', `${fileName}.png`),
    fullPage: true,
  });
});

test('supplier scorecard page loads', async ({ page }, testInfo) => {
  await page.goto('/');

  // click on Supplier Scorecard in the sidebar
  await page.getByRole('link', { name: 'Supplier Scorecard' }).click();

  // Verify the heading and table
  await expect(
    page.getByRole('heading', { name: 'Supplier Scorecard' }),
  ).toBeVisible();
  await expect(page.getByText('Supplier Name')).toBeVisible();

  // Screenshot evidence for this test
  const fileName = safeFileName(testInfo.title);
  await page.screenshot({
    path: path.join('tests', 'evidence', `${fileName}.png`),
    fullPage: true,
  });
});
