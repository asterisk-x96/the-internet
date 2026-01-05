import { test, expect } from '@playwright/test';

test.describe('Broken Images', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/broken_images', { 
            waitUntil: 'commit' 
        });
        await page.getByRole('heading', { name: 'Broken Images' }).waitFor();
    });

    test('should display the correct number of images', async ({page }) => {
        const images = page.locator('.example img');
        const num_images = await images.count()
        expect(num_images).toBe(3)
    })

    test('detect broken images using natural width', async ({ page }) => {
        const images = page.locator('.example img');
        const num_images = await images.count();
        let brokenCount = 0;
        for (let i = 0; i < num_images; i++) {
            const isBroken = await images.nth(i).evaluate(
                (img: HTMLImageElement) => img.naturalWidth === 0
            );
            if (isBroken) {
                brokenCount++;
            }
        }
        expect(brokenCount).toBeGreaterThan(0);
    })

    
})