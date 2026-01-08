import { test, expect } from '@playwright/test';

// should click buttons using robust CSS classes (ignoring dynamic IDs)
// should find a table row by text and click the action link inside it
// should extract values from the table

test.beforeEach(async ({ page }) => {
    await page.goto('/challenging_dom', {
        waitUntil: 'commit'
    });

    await page.getByRole('heading', { name: 'Challenging DOM'}).waitFor();
})

test('should click buttons using robust CSS classes', async({ page }) => {
    const firstButton =  page.locator('.button').first()
    const secondButton =  page.locator('.button.alert')
    const thirdButton = page.locator('.button.success')

    const buttons = [firstButton, secondButton, thirdButton]

    for (const button of buttons) {
        await button.click();
        await expect(page).toHaveURL(/challenging_dom/);
    }
}) 

test('should find a table row by text and click the action link inside it', async ({ page }) => {
    const targetRow = page.locator('tr').filter({hasText: 'Apeirian9'});
    const editLink = targetRow.getByRole('link', { name: 'edit' })

    await editLink.click()

    expect(page.url()).toContain('#edit');
})

test('extract value from the table', async ({ page }) => {
    const sitColumnCells = page.locator('tbody tr td:nth-child(4)')
    const texts = await sitColumnCells.allInnerTexts();
    console.log('Value in "Sit" columns: ', texts)

    expect(texts.length).toBe(10)
    expect(texts[9]).toBe('Definiebas9')
})

