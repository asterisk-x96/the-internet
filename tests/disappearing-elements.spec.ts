import { test, expect } from '@playwright/test';

test.describe('disappearing elements', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/disappearing_elements', {
            waitUntil: 'commit'
        })
    })

    test('should display all core menu items', async ({ page }) => {
        const coreItems = ['Home', 'About', 'Contact Us', 'Portfolio']
        for (const item of coreItems) {
            await expect(page.getByRole('link', {name: item, exact: true})).toBeVisible()
        }
    })

    test('should have a valid menu count (4 or 5 items)', async ({ page }) => {
            const menuItems = page.locator('ul li');
            await expect(page.getByRole('link', { name: 'Portfolio'})).toBeVisible();

            const count = await menuItems.count();
            console.log(`Current menu count: ${count}`);
            
            expect([4, 5]).toContain(count);
    });
})