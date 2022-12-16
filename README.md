- Pull Project from Github

- Set up database 

  * OPTION 1

  Let your database server run in port 5432
  Make a new database called fulldb

  * OPTION 2

  Change port in .env to the port your database server is running in
  Change database in .env to database you're using

SETTING UP MIGRATIONS/SEEDS 

  * OPTION 1 

- Configure migrations in a fresh terminal window
  type: npm run migration:generate -- Migrations (or alternate name of your choosing) and ENTER
  type: npm run migration:run and ENTER

- Configure seeds 
  type: npm run seed:config 
  type: npm run seed:run 

  * OPTION 2 

- type: npm run build-app in the terminal and the configuration is built for you 

- Run the back-end 
  type: npm run start:dev OR yarn start:dev into your terminal 
Your back-end should be set up