import {test, expect } from '@playwright/test';
import { AddRemoveElementsPage } from '../pages/add-remove-elements.page';

test.describe('Add Elements', () => {

    let addRemoveElementsPage: AddRemoveElementsPage;

    test.beforeEach(async ({page}) => {
        addRemoveElementsPage = new AddRemoveElementsPage(page);
        await addRemoveElementsPage.goto()
    })

    test('can add elements', async () => {
        await addRemoveElementsPage.addElement();
        await expect(addRemoveElementsPage.deleteButtons).toHaveCount(1);
        
    })
    
    test('can add multiple delete button', async () => {
        await addRemoveElementsPage.addElement(3);
        await expect(addRemoveElementsPage.deleteButtons).toHaveCount(3);
    })

    /* =========================
     Delete Behavior Tests
    ========================= */

    test('can remove one button', async () => {
        await addRemoveElementsPage.addElement(3);
        await addRemoveElementsPage.deleteOne();
        await expect(addRemoveElementsPage.deleteButtons).toHaveCount(2);

        await addRemoveElementsPage.addElement(2);
        await addRemoveElementsPage.deleteOne();
        await expect(addRemoveElementsPage.deleteButtons).toHaveCount(3);
    })

    /* =========================
     Edge and State Tests
     ========================= */

    test('has no delete button on initial load', async () => {
        await expect (addRemoveElementsPage.deleteButtons).toHaveCount(0)
     })

    test('can add elements after deleting all', async() => {
        await addRemoveElementsPage.addElement(5);
        await addRemoveElementsPage.deleteAllElements();
        await addRemoveElementsPage.addElement();
        await expect(addRemoveElementsPage.deleteButtons).toHaveCount(1);
    })

    /* =========================
     UI Consistency Tests
     ========================= */
    test('add button is visible and enabled', async () => {
        await expect(addRemoveElementsPage.addButton).toBeVisible();
        await expect(addRemoveElementsPage.addButton).toBeEnabled();
    })

    /* =========================
     Stress / Resilience Tests
     ========================= */

     test('can handle rapid add actions', async () => {
        await addRemoveElementsPage.addElement(10);
        await expect(addRemoveElementsPage.deleteButtons).toHaveCount(10);
     })

     test('can handle rapid delete actions', async() => {
        await addRemoveElementsPage.addElement(10);
        await addRemoveElementsPage.deleteAllElements;
        await expect(addRemoveElementsPage.deleteButtons).toHaveCount(0);
     })
})
