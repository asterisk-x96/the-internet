import { test, expect, Locator } from '@playwright/test';

let dropdown: Locator;
let option1: Locator;
let option2: Locator;

test.beforeEach(async ({ page }) => {
    await page.goto('/dropdown', {
        waitUntil: 'domcontentloaded'
    });

    dropdown = page.locator('#dropdown');
    option1 = page.getByRole('option', { name: 'Option 1' });
    option2 = page.getByRole('option', { name: 'Option 2' });

    await expect(dropdown).toBeVisible();
    await expect(dropdown).toHaveValue('');
})

test.describe('basic tests', () => {
    test('should select option', async ({ page }) => {
        await dropdown.selectOption('Option 1');
        await expect(dropdown).toHaveValue('1');
        
        await dropdown.selectOption('Option 2');
        await expect(dropdown).toHaveValue('2');

    })
})

test.describe('edge cases', () => {
    test('should handle rapid selection', async ({ page }) => {
        let nextValue = '1'; 
        await dropdown.selectOption(nextValue);

        for (let i = 0; i < 10; i++) {
            nextValue = nextValue === '1' ? '2' : '1';

            await dropdown.selectOption(nextValue);
            await expect(dropdown).toHaveValue(nextValue);
        }
    });

    test('should not select the disabled default option', async ({ page }) => {
        
    })
})

test.describe('accessibility and keyboard navigation', () => {
    test('should be selectable via keyboard (Tab and Enter', async ({ page }) => {

    })
})

test.describe('visual UI tests tests', () => {
    
})
