import { test, expect } from '@playwright/test';

test('context menu popup', async ({ page }) => {

    await page.goto('/context_menu');

    page.on('dialog', (dialog) => {
        console.log('Dialog type is: ', dialog.type())
        expect(dialog.type()).toBe('alert')
        console.log('Dialog message is: ', dialog.message())
        expect(dialog.message()).toBe('You selected a context menu')
        dialog.dismiss()
    })

    await page.locator('#hot-spot').click({button: 'right'})
    await page.waitForTimeout(5000)
})