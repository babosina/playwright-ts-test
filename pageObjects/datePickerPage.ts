import {expect, Page} from "@playwright/test";
import {BasePage} from "./basePage";

export class DatePickerPage extends BasePage{
    // readonly page: Page;

    constructor(page: Page) {
        super(page);
        // this.page = page;
    }

    /**
     * Select a date number of days from today
     * @param numberOfDaysFromToday
     */
    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const datePicker = this.page.getByPlaceholder("Form Picker");
        await datePicker.click();
        const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday);
        await expect(datePicker).toHaveValue(dateToAssert);
    }

    private async selectDateInCalendar(numberOfDaysFromToday: number) {
        let date = new Date();
        date.setDate(date.getDate() + numberOfDaysFromToday);
        const expectedDate = date.getDate().toString();
        const expectedMonth = date.toLocaleString('EN-US', {month: 'short'});
        const expectedYear = date.getFullYear();
        const dateToAssert = `${expectedMonth} ${expectedDate}, ${expectedYear}`;

        let calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
        const expectedMonthLong = date.toLocaleString('EN-US', {month: 'long'});

        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;

        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator("button.next-month").click();
            calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
        }

        const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]');
        const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]');
        if (await dayCell.first().isVisible()) {
            await dayCell.getByText(expectedDate, {exact: true}).click();
        } else {
            await rangeCell.getByText(expectedDate, {exact: true}).click();
        }
        // await this.page.locator('[class="day-cell ng-star-inserted"]')
        //     .getByText(expectedDate, {exact: true})
        //     .click();
        return dateToAssert;
    }

    async selectDatePickerWithRangeFromToday(startDate: number, endDate: number) {
        const datePicker = this.page.getByPlaceholder("Range Picker");
        await datePicker.click();
        const dateToAssertStart = await this.selectDateInCalendar(startDate);
        const dateToAssertEnd = await this.selectDateInCalendar(endDate);
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;
        await expect(datePicker).toHaveValue(dateToAssert);
    }
}