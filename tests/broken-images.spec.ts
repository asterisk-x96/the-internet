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

    test('Verify HTTP 404 Status for Broken Images', async ({ page }) => {
        const brokenImage1Promise = page.waitForResponse(response => 
            response.url().includes('asdf.jpg') && response.status() === 404
        );

        const brokenImage2Promise = page.waitForResponse(response => 
            response.url().includes('hjkl.jpg') && response.status() === 404
        );

        await page.reload();

        const [response1, response2] = await Promise.all([
            brokenImage1Promise,
            brokenImage2Promise
        ]);

        console.log(`Verified 404 for: ${response1.url()}`);
        console.log(`Verified 404 for: ${response2.url()}`);
    });

    test('Verify HTTP 200 Status for Valid Image', async ({ page }) => {
        const validImagePromise = page.waitForResponse(response => 
            response.url().includes('avatar-blank.jpg') && response.status() === 200
        );
        await page.reload()
        const response = await validImagePromise;
        console.log(`Verified 200 for: ${response.url()}`);
    })

    
})

