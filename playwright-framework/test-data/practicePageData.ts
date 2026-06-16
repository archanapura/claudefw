/**
 * test-data/practicePageData.ts
 * All test data separated from test scripts.
 * Consume via import – never hardcode values in tests.
 */

export const RadioData = {
  validOptions: ['radio1', 'radio2', 'radio3'] as const,
  defaultSelection: 'radio1' as const,
};

export const DropdownData = {
  options: ['Option1', 'Option2', 'Option3'] as const,
  invalidOption: 'Option99',
};

export const CountryData = {
  searches: [
    { partial: 'Ind', exact: 'India' },
    { partial: 'Aus', exact: 'Australia' },
    { partial: 'Can', exact: 'Canada' },
  ],
  invalidSearch: 'ZZZZZ',
};

export const CheckboxData = {
  singleOption: ['option1'] as const,
  multipleOptions: ['option1', 'option2'] as const,
  allOptions: ['option1', 'option2', 'option3'] as const,
};

export const AlertData = {
  validName: 'John Doe',
  emptyName: '',
  specialChars: 'Test@#$%',
};

export const TableData = {
  expectedCourses: [
    { name: 'Learn SQL in Practical + Database Testing from Scratch', price: '25' },
    { name: 'WebServices / REST API Testing with SoapUI', price: '35' },
    { name: 'Write effective QA Resume that will turn to interview call', price: '0' },
  ],
  expectedTotalAmount: 296,
  expectedHeaders: ['Name', 'Position', 'City', 'Amount'],
  expectedRows: [
    { name: 'Alex', position: 'Engineer', city: 'Chennai', amount: '28' },
    { name: 'Ben', position: 'Mechanic', city: 'Bengaluru', amount: '23' },
  ],
};

export const WindowData = {
  expectedWindowUrl: 'rahulshettyacademy.com',
  expectedTabUrl: 'qaclickacademy.com',
};

export const PageData = {
  url: '/AutomationPractice/',
  title: 'Practice Page',
  heading: 'Practice Page',
};
