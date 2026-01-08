import { Page, Locator } from '@playwright/test' 

export class CheckboxesPage {
    readonly page: Page;
    readonly checkbox1: Locator;
    readonly checkbox2: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkbox1 = page.getByRole('checkbox').first();
        this.checkbox2 = page.getByRole('checkbox').nth(1);

    }

    async goto() {
        await this.page.goto('/checkboxes', {
            waitUntil: 'commit'
        })
    }
}