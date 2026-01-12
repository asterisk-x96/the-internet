import { test, expect } from '@playwright/test';

test.describe('Broken Images', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dropdown', { 
            waitUntil: 'commit' 
        });
        await page.getByRole('heading', { name: 'Dropdown List'}).waitFor();
    });

    test('page loads', async ({ page }) => {
        await expect(page).toHaveURL('/dropdown');
        await expect(page.getByRole('heading', { name: 'Dropdown List' })).toBeVisible();
    });
})