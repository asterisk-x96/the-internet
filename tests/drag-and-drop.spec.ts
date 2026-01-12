import { test, expect, Page, Locator } from '@playwright/test';

async function dragAndDrop(page: Page, sourceSelector: string, targetSelector: string): Promise<void> {
    const source: Locator = page.locator(sourceSelector);
    const target: Locator = page.locator(targetSelector);
    
    await source.waitFor({ state: 'visible' });
    await target.waitFor({ state: 'visible' });
    
    await page.evaluate(({ sourceId, targetId }: { sourceId: string; targetId: string }) => {
        const dataTransfer: DataTransfer = new DataTransfer();
        const sourceEl: Element | null = document.querySelector(sourceId);
        const targetEl: Element | null = document.querySelector(targetId);
        
        if (!sourceEl || !targetEl) {
            throw new Error(`Elements not found: ${sourceId} or ${targetId}`);
        }
        
        const dragStartEvent: DragEvent = new DragEvent('dragstart', { 
            dataTransfer,
            bubbles: true,
            cancelable: true 
        });
        const dragOverEvent: DragEvent = new DragEvent('dragover', { 
            dataTransfer,
            bubbles: true,
            cancelable: true 
        });
        const dropEvent: DragEvent = new DragEvent('drop', { 
            dataTransfer,
            bubbles: true,
            cancelable: true 
        });
        const dragEndEvent: DragEvent = new DragEvent('dragend', { 
            dataTransfer,
            bubbles: true,
            cancelable: true 
        });
        
        sourceEl.dispatchEvent(dragStartEvent);
        targetEl.dispatchEvent(dragOverEvent);
        targetEl.dispatchEvent(dropEvent);
        sourceEl.dispatchEvent(dragEndEvent);
    }, { sourceId: sourceSelector, targetId: targetSelector });
    
    await page.waitForTimeout(100);
}

test.describe('drag and drop elements', () => {
    let columnA: Locator;
    let columnB: Locator;
    
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto('/drag_and_drop');
        
        columnA = page.locator('#column-a');
        columnB = page.locator('#column-b');
        
        await columnA.waitFor({ state: 'visible' });
        await columnB.waitFor({ state: 'visible' });
    });

    test('should swap elements when dragging A to B', async ({ page }: { page: Page }) => {
        await dragAndDrop(page, '#column-a', '#column-b');
        
        await expect(columnA).toHaveText('B');
        await expect(columnB).toHaveText('A');
    });

    test('should swap elements when dragging B to A', async ({ page }: { page: Page }) => {
        await dragAndDrop(page, '#column-b', '#column-a');
        
        await expect(columnA).toHaveText('B');
        await expect(columnB).toHaveText('A');
    });

    test('should be able to swap back to original positions', async ({ page }: { page: Page }) => {
        // Verify initial state
        await expect(columnA).toHaveText('A');
        await expect(columnB).toHaveText('B');
        
        // Swap A to B
        await dragAndDrop(page, '#column-a', '#column-b');
        await expect(columnA).toHaveText('B');
        await expect(columnB).toHaveText('A');
        
        // Swap back B to A
        await dragAndDrop(page, '#column-a', '#column-b');
        await expect(columnA).toHaveText('A');
        await expect(columnB).toHaveText('B');
    });

    test('should have visual drag indicators', async ({ page }: { page: Page }) => {
        // Check for column headers
        const columnAHeader: Locator = columnA.locator('header');
        const columnBHeader: Locator = columnB.locator('header');
        
        await expect(columnAHeader).toBeVisible();
        await expect(columnBHeader).toBeVisible();
        
        // Verify column header text
        await expect(columnAHeader).toHaveText('A');
        await expect(columnBHeader).toHaveText('B');
    });

    test('should reset positions on page refresh', async ({ page }: { page: Page }) => {
        await dragAndDrop(page, '#column-a', '#column-b');
        await expect(columnA).toHaveText('B');
        
        await page.reload();
        
        const refreshedColumnA: Locator = page.locator('#column-a');
        const refreshedColumnB: Locator = page.locator('#column-b');
        
        await expect(refreshedColumnA).toHaveText('A');
        await expect(refreshedColumnB).toHaveText('B');
    });

    test('should maintain consistent UI styling after drag', async ({ page }: { page: Page }) => {
        // Get initial width
        const initialWidthA: string | null = await columnA.evaluate((el: Element) => {
            return window.getComputedStyle(el).width;
        });
        
        await dragAndDrop(page, '#column-a', '#column-b');
        
        // Verify text changed
        await expect(columnA).toHaveText('B');
        
        // Get width after drag
        const finalWidthA: string | null = await columnA.evaluate((el: Element) => {
            return window.getComputedStyle(el).width;
        });
        
        // Verify width remains consistent
        expect(finalWidthA).toBe(initialWidthA);
    });

    // Test to verify drag operation doesn't break page
    test('should not break page functionality after multiple drags', async ({ page }: { page: Page }) => {
        const dragOperations: number = 5;
        
        for (let i: number = 0; i < dragOperations; i++) {
            await dragAndDrop(page, '#column-a', '#column-b');
            await page.waitForTimeout(50); // Small delay between operations
            
            // Verify elements are still accessible
            await expect(columnA).toBeVisible();
            await expect(columnB).toBeVisible();
            
            // Log the current state (for debugging)
            const currentTextA: string | null = await columnA.textContent();
            const currentTextB: string | null = await columnB.textContent();
            console.log(`Operation ${i + 1}: Column A = "${currentTextA}", Column B = "${currentTextB}"`);
        }
    });
});