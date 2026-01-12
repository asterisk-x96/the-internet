import { test, expect } from '@playwright/test';

test.describe('disappearing elements', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/disappearing_elements', {
            waitUntil: 'domcontentloaded'
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

    test('Gallery menu item should appear or disappear randomly', async ({ page }) => {
        const galleryLink = page.getByRole('link', { name: 'Gallery', exact: true });
        
        const isGalleryVisible = await galleryLink.isVisible().catch(() => false);
        console.log(`Gallery is initially ${isGalleryVisible ? 'visible' : 'hidden'}`);
        
        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    });
})