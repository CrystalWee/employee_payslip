const TOTAL_MONTHS = 12;
const MIN_FIRST_TAX_INCOME = 0;
const MIN_SECOND_TAX_INCOME = 18201;
const MIN_THIRD_TAX_INCOME = 37001;
const MIN_FOURTH_TAX_INCOME = 87001;
const MAX_FIRST_TAX_INCOME = 18200;
const MAX_SECOND_TAX_INCOME = 37000;
const MAX_THIRD_TAX_INCOME = 87000;
const MAX_FOURTH_TAX_INCOME = 180000;
const INITIAL_THIRD_TAX_INCOME = 3572;
const INITIAL_FOURTH_TAX_INCOME = 19822;
const INITIAL_FIFTH_TAX_INCOME = 54232;
const CHAR_PERCENT = "%";
const CHAR_SPACE = " ";
const CHAR_DASH = "-";
const formatDate = (date) => {
  return [date.getDate(), date.getMonth(), date.getFullYear()].join('/');
};

const getPayPeriodDisplay = (payPeriod) => {
  const payPeriodMM = Number(payPeriod.substring(0,2));
  const payPeriodYYYY = Number(payPeriod.substring(2, 6));
  const firstDayOfMnth = new Date(payPeriodYYYY, payPeriodMM, 1);
  const lastDayOfMonth = new Date(payPeriodYYYY, payPeriodMM + 1, 0);
  return formatDate(firstDayOfMnth).concat(CHAR_SPACE, CHAR_DASH, CHAR_SPACE, formatDate(lastDayOfMonth));
};

const getFullNameDisplay = (firstName, lastName) => {
  return firstName.concat(CHAR_SPACE, lastName);
};

module.exports.taxableIncome = async (item) => {
  const { firstName, lastName, annualSalary, payPeriod, superRate } = item;
  const grossIncome = Math.round(annualSalary / TOTAL_MONTHS);
  const superRateRatio = parseFloat(superRate.replace(CHAR_PERCENT, ""))/100;
  let incomeTaxRate = 0.45;
  let incomeTax = 0;

  if (annualSalary >= MIN_FIRST_TAX_INCOME && annualSalary <= MAX_FIRST_TAX_INCOME) {
    incomeTaxRate = 0;
    incomeTax = 0;

  } else if (annualSalary >= MIN_SECOND_TAX_INCOME && annualSalary <= MAX_SECOND_TAX_INCOME) {
    incomeTaxRate = 0.19;
    incomeTax = Math.round((incomeTaxRate * (annualSalary - MAX_FIRST_TAX_INCOME))/ TOTAL_MONTHS);

  } else if (annualSalary >= MIN_THIRD_TAX_INCOME && annualSalary <= MAX_THIRD_TAX_INCOME) {
    incomeTaxRate = 0.325;
    incomeTax = Math.round((INITIAL_THIRD_TAX_INCOME + (incomeTaxRate * (annualSalary - MAX_SECOND_TAX_INCOME)))/TOTAL_MONTHS);

  } else if (annualSalary >= MIN_FOURTH_TAX_INCOME && annualSalary <= MAX_FOURTH_TAX_INCOME) {
    incomeTaxRate = 0.37;
    incomeTax = Math.round((INITIAL_FOURTH_TAX_INCOME + (incomeTaxRate * (annualSalary - MAX_THIRD_TAX_INCOME)))/TOTAL_MONTHS);
    console.log(annualSalary - MAX_THIRD_TAX_INCOME);
    console.log(incomeTaxRate * (annualSalary - MAX_THIRD_TAX_INCOME));
    console.log((INITIAL_FOURTH_TAX_INCOME + (incomeTaxRate * (annualSalary - MAX_THIRD_TAX_INCOME))));
  } else {
    incomeTaxRate = 0.45;
    incomeTax = Math.round((INITIAL_FIFTH_TAX_INCOME + (incomeTaxRate * (annualSalary - MAX_FOURTH_TAX_INCOME)))/TOTAL_MONTHS);
  }

  const netIncome = grossIncome - incomeTax;
  const superAmount = Math.round(grossIncome * superRateRatio); 

  return { "name": getFullNameDisplay(firstName, lastName), "payPeriod": getPayPeriodDisplay(payPeriod), "grossIncome": grossIncome, "incomeTax": incomeTax, "netIncome": netIncome, "superAmount": superAmount };
};
