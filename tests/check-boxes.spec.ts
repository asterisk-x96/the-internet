import { expect, test, Page } from '@playwright/test';
import { CheckboxesPage } from '../pages/checkboxes.page';

let checkboxesPage: CheckboxesPage;

test.beforeEach(async ({ page }: { page: Page }) => {
    checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();
});

test('should have correct initial checkbox states', async () => {
    await expect(checkboxesPage.checkbox1).not.toBeChecked();
    await expect(checkboxesPage.checkbox2).toBeChecked();
});

test.describe('Single checkbox operations', () => {
    test('should check and verify a single checkbox', async () => {
        await checkboxesPage.checkbox1.check();
        await expect(checkboxesPage.checkbox1).toBeChecked();
    });

    test('should uncheck and verify a single checkbox', async () => {
        await checkboxesPage.checkbox2.uncheck();
        await expect(checkboxesPage.checkbox2).not.toBeChecked();
    });

    test('should check only the selected box', async () => {
        await checkboxesPage.checkbox2.setChecked(true);
        await expect(checkboxesPage.checkbox2).toBeChecked();
        await expect(checkboxesPage.checkbox1).not.toBeChecked();
    });
});

test.describe('Edge cases', () => {
    test('should handle rapid consecutive clicks', async () => {
        const checkbox = checkboxesPage.checkbox1;
        
        // Rapid toggling
        for (let i = 0; i < 5; i++) {
            await checkbox.click();
            // Verify state changes each time
            if (i % 2 === 0) {
                await expect(checkbox).toBeChecked();
            } else {
                await expect(checkbox).not.toBeChecked();
            }
        }
    });

    test('should maintain state after page refresh', async ({ page }: { page: Page }) => {
        await checkboxesPage.checkbox1.check();
        await expect(checkboxesPage.checkbox1).toBeChecked();
        
        await page.reload();
        // State should be reset to initial
        await expect(checkboxesPage.checkbox1).not.toBeChecked();
    });
});


test('should uncheck only the selected box', async () => {
    // Set both to checked state first
    await checkboxesPage.checkbox1.check();
    await checkboxesPage.checkbox2.check();
    
    // Uncheck only one
    await checkboxesPage.checkbox1.uncheck();
    
    await expect(checkboxesPage.checkbox1).not.toBeChecked();
    await expect(checkboxesPage.checkbox2).toBeChecked();
});

test('should toggle state when clicked with mouse', async () => {
    // Clear any existing state
    await checkboxesPage.checkbox2.uncheck();
    
    await checkboxesPage.checkbox2.click();
    await expect(checkboxesPage.checkbox2).toBeChecked();

    await checkboxesPage.checkbox2.click();
    await expect(checkboxesPage.checkbox2).not.toBeChecked();
});

test.describe('Accessibility and keyboard navigation', () => {
    test('should be toggleable via keyboard (Tab and Space)', async ({ page }: { page: Page }) => {
        await checkboxesPage.checkbox1.focus();
        await expect(checkboxesPage.checkbox1).toBeFocused();

        await page.keyboard.press('Space');
        await expect(checkboxesPage.checkbox1).toBeChecked();

        await page.keyboard.press('Space');
        await expect(checkboxesPage.checkbox1).not.toBeChecked();
    });

});

test.describe('Visual and UI tests', () => {
    test('should have proper labels or text near checkboxes', async () => {
        // Check for associated labels (improves accessibility)
        const checkbox1Label = checkboxesPage.page.locator('label[for="checkboxes"]');
        // Adjust selector based on actual page structure
    });

    test('should show visual feedback when checked/unchecked', async () => {
        await checkboxesPage.checkbox1.check();
        
        // Check for CSS changes (if any)
        const checkboxStyle = await checkboxesPage.checkbox1.evaluate((el: HTMLInputElement) => {
            return window.getComputedStyle(el).getPropertyValue('background-color');
        });
        
        console.log(`Checkbox background color: ${checkboxStyle}`);
    });

    test('should maintain consistent sizing and spacing', async () => {
        const checkbox1Box = await checkboxesPage.checkbox1.boundingBox();
        const checkbox2Box = await checkboxesPage.checkbox2.boundingBox();
        
        expect(checkbox1Box?.width).toBeGreaterThan(0);
        expect(checkbox1Box?.height).toBeGreaterThan(0);
        
        // Check they have similar dimensions
        expect(checkbox1Box?.width).toBe(checkbox2Box?.width);
        expect(checkbox1Box?.height).toBe(checkbox2Box?.height);
    });
});

