import { User } from 'src/users/entities/user.entity'
import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Profile } from 'src/profile/entities/profile.entity';
import { Questionnaire } from 'src/questionnaire/entities/questionnaire.entity';
import { Balance } from 'src/balance/entities/balance.entity';
import { SavingsBalance } from 'src/savings-balance/entities/savingsbalance.entity';
import { Savings } from 'src/savings/entities/saving.entity';
import { Entry } from 'src/entries/entities/entry.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Bill } from 'src/bills/entities/bill.entity';
import { CategoryIcon } from 'src/category-icons/entities/category-icon.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { UsersLoan } from 'src/users-loans/entities/users-loan.entity';

define(User, () => {  
    const email = faker.internet.email();
    const password = "123"
    
    const user = new User()
    user.email = email;
    user.password = password;
    return user
});

define(Profile, () => {  
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const bank = faker.company.companyName();
  
  const profile = new Profile()
  profile.firstName = firstName;
  profile.lastName = lastName;
  profile.bank = bank;
  profile.onboarding = "initialised"
  return profile
});

define (Questionnaire, () => {
  const ageGroup = faker.datatype.number({min: 1, max: 4});
  const improve = faker.helpers.arrayElement(['Budgeting', 'Saving', 'Investing', 'Profiting']);
  const savedLastMonth = faker.datatype.boolean();
  const goal = faker.datatype.boolean();

  const questionnaire = new Questionnaire()
  questionnaire.ageGroup = ageGroup;
  questionnaire.improve = improve;
  questionnaire.savedLastMonth = savedLastMonth;
  if (savedLastMonth) {questionnaire.goal = goal} else {questionnaire.goal = false};
  return questionnaire;
});

define (Balance, () => {
  const current = faker.datatype.number(100000)*100;

  const balance = new Balance()
  balance.current = current;
  return balance;
});

define (SavingsBalance, () => {
  const total = faker.datatype.number({min: 2000, max: 100000})*100;
  const unassigned = total - 200000
  const monthly_numbers = faker.datatype.number({max: 2000}) * 100;
  const monthly_savings = faker.helpers.arrayElement([monthly_numbers.toString(), "all"])

  const savingsBalance = new SavingsBalance();
  savingsBalance.total = total;
  savingsBalance.unassigned = unassigned;
  savingsBalance.monthly_savings = monthly_savings;
  
  return savingsBalance;
});

define (Savings, () => {
  const savingsName = faker.commerce.productName();
  const goal = faker.datatype.number({min: 100, max: 600})*100;
  const saved = faker.datatype.number({max: goal/100})*100
  
  const goal_date = faker.date.future(10);
  const amount = faker.datatype.number({max: goal/1000})*100;
  const type = faker.helpers.arrayElement(["amount", "percentage"])
  const complete = faker.datatype.boolean();
  

  const savings = new Savings();
  savings.name = savingsName;
  savings.saved = saved;
  savings.goal = goal;
  savings.goal_date = goal_date;
  savings.amount = amount;
  savings.type = type;
  savings.complete = complete;

  return savings;
});

define (Entry, () => {
  const incoming = faker.datatype.boolean();
  const amount = faker.datatype.number({max: 400})*100
  const category = !incoming ? faker.helpers.arrayElement(['savings', 'bills', 'loans', faker.company.companyName()]) : "incoming";
  const description = !incoming ? faker.helpers.arrayElement(["", faker.lorem.sentence()]) : null;
  const type = ["incoming", "savings", "bills", "loans"].indexOf(category) >= 0 ? category : "category"

  const entry = new Entry();
  entry.incoming = incoming;
  entry.amount = amount;
  entry.category = category;
  entry.description = description;
  entry.type = type;
  
  return entry;
});

define (Category, () => {
  const name = faker.company.companyName();
  const total = faker.datatype.number({max: 700})*100;
  const current = faker.datatype.number({max: total/100})*100;
  const hidden = faker.datatype.boolean();
  const categoryIconId = faker.datatype.number({min: 1, max: 18});

  const category = new Category();
  category.name = name;
  category.current = current;
  category.total = total;
  category.hidden = hidden;
  category.categoryIconId = categoryIconId;
  
  return category;
});

define (Bill, () => {
  const name = faker.company.companyName();
  const amount = faker.datatype.number({max: 700})*100;
  const paid = faker.datatype.boolean();

  const bill = new Bill();
  bill.name = name;
  bill.amount = amount;
  bill.paid = paid;
  bill.reminder = true;
  
  return bill;
});

define (CategoryIcon, () => {
  const categoryIcon = new CategoryIcon();
  
  return categoryIcon;
});

define (Loan, () => {
  const amount = faker.datatype.number({max: 200})*100;
  const paid = faker.datatype.boolean();
  const reason = faker.lorem.sentence();

  const loan = new Loan();
  loan.amount = amount;
  loan.paid = paid;
  loan.reason = reason;

  return loan;
});

define (UsersLoan, () => {
  const owed = faker.datatype.boolean();
  const inviteName =  `${faker.name.firstName()} ${(faker.name.lastName())[0]}.`;
  const inviteEmail = faker.internet.email();

  const usersLoan = new UsersLoan();
  usersLoan.owed = owed;
  usersLoan.inviteName = inviteName;
  usersLoan.inviteEmail = inviteEmail;
  
  return usersLoan;
});

