const lYear = {c:'div.years', item: 'div.year', selectedItem: 'div.year.selected'}
    , lMonth = {c: 'div.months', item: 'div.month', selectedItem: 'div.month.selected'}
    , lDay = {c: "//div[contains(@class,'calendar-container')][1]", item: '.week .day.ng-star-inserted', selectedItem: '.week .day.selected', itemAnother: '.week .day.mute'};


class DatePicker {
    constructor(elementLocator) {
        this.elementLocator = elementLocator;
        this._calendar = new Calendar();
    }
    get root() {
        browser.frame(null)
        browser.frame(0)
        let r = $(this.elementLocator);
        r.waitForExist(8000)
        return r;
    }
    openCalendar() {
        this.root.$('[name="datepicker"]').click();
        return this._calendar;
    }
    
    get date () {
        return new Date(this.root.$('[name="datepicker"]').getAttribute('value'));
    }
    disableDay() {
        this.root.$('//button[1]').click();
    }
    incrementDay() {
        this.root.$('//button[2]').click();
    }
}

class Calendar {
    constructor() {
        this._yearPicker = new YearPicker();
        this._monthPicker = new MonthPicker();
    }
    get container() {
        browser.waitForVisible(lDay.c);
        return $(lDay.c);
    }
    get items() {
        return this.container.$$(lDay.item);
    }
    get currentItems() {
        return this.items.filter(v => !v.getArrtibute('class').includes('mute'));
    }
    get anotherItems() {
        return this.items.filter(v => v.getArrtibute('class').includes('mute'));
    }
    get selectedItem() {
        return this.container.$(lDay.selectedItem);
    }

    get day() {
        const s = this.selectedItem;
        console.log(`pppppppppppp: ${s}`)
        const rawValue = s.$('span').getText().match(/\d+/)[0]
        return Number(rawValue);
    }
    set day(newValue) {
        let items = this.container.$$(lDay.item);
        items = items.filter(e => {
            console.log(e.$('span').getText())
            let rawValue = e.$('span').getText()
            rawValue = rawValue.match(/\d+/)[0]
            return Number(rawValue) === Number(newValue)
        })
        items[0].click();
        browser.waitUntil(() => !this.displayed, 1090);
    }
    isEnabled(day) {
        const e = this.items.filter(v => {
            return v.getAttribute('class').includes('selected');
        });
        return Number(e[0].$('span').getText()) === day;
    }
    get year() {
        return Number(this.container.$('.year-name').getText());
    }
    get month() {
        const e = this.container.$('.month-name');
        return new Date(`1 ${e.getText()} 0`).getMonth() + 1;
    }
    
    openYearPicker() {
        this.container.$('.year-name').click();
        return this._yearPicker;
    }
    openMonthPicker() {
        this.container.$('.month-name').click();
        return this._monthPicker;
    }


    nextMonth() {
        this.container.$('.actions a:nth-child(1)').click();
    }
    prevMonth() {
        this.container.$('.actions a:nth-child(2)').click();
    }
    get displayed() {
        return browser.isVisible(lDay.c);
    }
    close() {
        const cfmBtn = $("//div[@class='done'][1]/button")
        cfmBtn.click()
        browser.waitUntil(() => !cfmBtn.isVisible(), 2000);
    }
}
class MonthPicker {
    get displayed() {
        return browser.isVisible(lMonth.c);
    }
    get container() {
        browser.waitForVisible(lMonth.c);
        return $(lMonth.c);
    }
    get items() {
        return this.container.$$(lMonth.item);
    }
    get selectedItem() {
        return this.container.$(lMonth.selectedItem);
    }
    get month () {
        let e = null;
        for (e of this.items) {
            if (e.getAttribute('class').includes('selected')) break;
        }
        return new Date(`1 ${e.getText()} 0`).getMonth() + 1;
    }
    set month(month) {
        this.items[month - 1].click();
        browser.waitUntil(() => !this.displayed, 1090);
    }
    close() {
        this.selectedItem.click();
        browser.waitUntil(() => !this.displayed, 1090);
    }
}
class YearPicker {
    get displayed() {
        return browser.isVisible(lYear.c);
    }
    get container() {
        browser.waitUntil(() => this.displayed, 2000);
        return $(lYear.c);
    }
    get items() {
        return this.container.$$(lYear.item);
    }
    get selectedItem() {
        const e = this.container.$(lYear.selectedItem);
        e.moveToObject();
        return e;
    }
    get year() {
        return Number(this.selectedItem.getText());
    }
    set year(newValue) {
        let items = this.items;
        for (let v of items) {
            v.scroll();
            if (Number(v.getText()) === newValue) {
                v.click();
                browser.waitUntil(() => !this.displayed, 1090);
                break;
            }
        }
    }
}

module.exports = DatePicker;