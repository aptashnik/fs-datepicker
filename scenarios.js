const DatePicker = require('./DatePicker')
const TestScenario = require('fs-base/TestScenario')

const dateIndication = new TestScenario('Indicators are updated according to date modification', (elementLocator, valueToFill) => {
  let f = new DatePicker(elementLocator);
  
  const year = valueToFill.getFullYear()
    , month =  valueToFill.getMonth() + 1
    , day = valueToFill.getUTCDate();

  let c = f.openCalendar()
    , picker;

  c.openYearPicker().year = year;
  expect(c.year).toBe(year);

  // picker = c.openYearPicker();
  // expect(picker.year).toBe(year);
  // picker.close();

  
  c.openMonthPicker().month = month;
  expect(c.month).toBe(month);
  
  // picker = c.openMonthPicker();
  // expect(picker.month).toBe(month);
  // picker.close();

  c.day = day;
  c = f.openCalendar();
  expect(c.day).toBe(day);
  c.close();
  expect(f.date.toDateString()).toBe(valueToFill.toDateString());
}, class {
  constructor(controlID, valueToFill) {
    this.controlID = controlID;
    this.valueToFill = valueToFill;
  }
  toString() {
    return this.controlID;
  }
});

module.exports = {dateIndication};