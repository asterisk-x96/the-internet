import { expect, test } from '@playwright/test';
import { CheckboxesPage } from '../pages/checkboxes.page';

let checkboxesPage: CheckboxesPage;

test.beforeEach(async ({ page }) => {
    checkboxesPage = new CheckboxesPage(page)
    await checkboxesPage.goto()
});

test('should check the box', async () =>  {
    await checkboxesPage.checkbox1.check()
    await expect(checkboxesPage.checkbox1).toBeChecked()

    await checkboxesPage.checkbox2.check()
    await expect(checkboxesPage.checkbox2).toBeChecked()
})

test('should only check the selected box', async () => {
    await checkboxesPage.checkbox2.setChecked(true)
    await expect(checkboxesPage.checkbox2).toBeChecked()
    await expect(checkboxesPage.checkbox1).not.toBeChecked()
})

test('should check two boxes at the same time', async () => {
    await checkboxesPage.checkbox1.check()
    await checkboxesPage.checkbox2.check()

    await expect(checkboxesPage.checkbox1).toBeChecked()
    await expect(checkboxesPage.checkbox2).toBeChecked()
})

test('should uncheck the box', async () => {
    await checkboxesPage.checkbox1.check()
    await expect(checkboxesPage.checkbox1).toBeChecked()
    
    await checkboxesPage.checkbox1.uncheck()
    await expect(checkboxesPage.checkbox1).not.toBeChecked()
})

test('should uncheck only the selected box', async () => {
    await checkboxesPage.checkbox1.check()
    await checkboxesPage.checkbox2.check()
    
    await checkboxesPage.checkbox1.click()
    
    await expect(checkboxesPage.checkbox1).not.toBeChecked()
    await expect(checkboxesPage.checkbox2).toBeChecked()
})

test('should toggle state when clicked with mouse', async () => {
    await expect(checkboxesPage.checkbox2).toBeChecked()

    await checkboxesPage.checkbox2.click()
    await expect(checkboxesPage.checkbox2).not.toBeChecked()

    await checkboxesPage.checkbox2.click()
    await expect(checkboxesPage.checkbox2).toBeChecked()

})

test('should be toggable via keyboards (Tab and Space)', async ({ page }) => {
    await checkboxesPage.checkbox1.focus()
    await expect(checkboxesPage.checkbox1).toBeFocused();

    await page.keyboard.press('Space');
    await expect(checkboxesPage.checkbox1).toBeChecked();

    await page.keyboard.press('Space');
    await expect(checkboxesPage.checkbox1).not.toBeChecked();
})