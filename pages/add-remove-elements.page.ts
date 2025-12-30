import { Page, Locator } from '@playwright/test';

export class AddRemoveElementsPage {
    readonly page: Page;
    readonly addButton: Locator;
    readonly deleteButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addButton = page.locator('button:has-text("Add Element")');
        this.deleteButtons = page.locator('button:has-text("Delete")');
    }
    
    async goto() {
        await this.page.goto('https://the-internet.herokuapp.com/add_remove_elements/')
    }

    async addElement(times = 1) {
        for (let i = 0; i < times; i++ ) {
            await this.addButton.click();
        }
    }

    async deleteOne() {
        await this.deleteButtons.first().click();
    }

    async deleteAllElements() {
        const count = await this.deleteButtons.count();
        for (let i = 0; i < count; i++ ) {
            await this.deleteButtons.first().click();
        }
    }
}

