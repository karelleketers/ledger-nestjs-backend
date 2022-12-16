import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
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

const catList = ["baby", "barber", "bike", "camera", "campfire", "car", "cinema", "cleaning", "clothes", "cocktail", "coffee", "food", "make-up", "medication", "pet", "phone", "school", "travel" ];
 
export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    catList.map(async (catIcon: string) => {
      await factory(CategoryIcon)().create({name: catIcon})
    })

    await factory(Profile)()
    .map(async(profile: Profile): Promise<Profile> => {
      const user: User = await factory(User)().create({isAdmin: true})
      profile.user = user;
      return profile;
    })
    .createMany(2)

    const profiles: Profile[] = await factory(Profile)()
      .map(async (profile: Profile): Promise<Profile> => {
        const user: User = await factory(User)().create()
        profile.user = user;

        const questionnaire: Questionnaire = await factory(Questionnaire)().create({profileId: profile.id});
        profile.questionnaire = questionnaire;

        const balance: Balance = await factory(Balance)().create({profileId: profile.id});
        profile.balance = balance;

        const savingsBalance: SavingsBalance = await factory(SavingsBalance)().create({profileId: profile.id});
        profile.savingsBalance = savingsBalance;

        const savings: Savings[] = await factory(Savings)().createMany((Math.floor(Math.random() * 5) + 1), {profileId: profile.id});
        profile.savings = savings;

        const entries: Entry[] = await factory(Entry)().createMany((Math.floor(Math.random() * 30) + 1), {profileId: profile.id});
        profile.entries = entries;

        const categories: Category[] = await factory(Category)().createMany((Math.floor(Math.random() * 15) + 1), {profileId: profile.id});
        profile.categories = categories;

        const bills: Bill[] = await factory(Bill)().createMany((Math.floor(Math.random() * 12) + 1), {profileId: profile.id});
        profile.bills = bills;

        await factory(Loan)()
        .map(async(loan: Loan): Promise<Loan> => {
          const owned = await factory(UsersLoan)().create({userId: user.id, loanId: loan.id});
          const owner = await factory(UsersLoan)().create({userId: user.id, loanId: loan.id, owed: !owned.owed});
          const loanArr = [owned, owner]
          loan.userloans = loanArr;
          return loan;
        })
        .createMany((Math.floor(Math.random() * 3) + 1))

        return profile;
      })
      .createMany(48)

  }
}