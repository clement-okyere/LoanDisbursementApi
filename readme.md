## Node.js Assignment (Serverless)


### Requirements
- Node
- Serverless.com CLI
- npm


### Project Structure

- The src folder contains the core project logic
- The apps folder in the src folder has the lamda functions for the two apps (loanManagement and disbursement)
- The dataAccess folder in the src folder has logic to pull data from the dynamodb database
- The models folder has typescript interfaces
- The schemas folder has Joi validation schemas for the request bodies
- The utils folder has helper functions
### Getting started

- Install dependencies: npm install

- Install local dynamodb: serverless dynamodb install   

- create .env file `touch .env`

- add the OPENKVK_API_KEY env variable to the .env file `OPENKVK_API_KEY=XXXXXXXXXXXXXXXXXXXX`

- Run tests: npm test

- Run for development: npm start

- The swagger documentation can be accessed on  http://localhost:3000/dev/swagger  

- Check lint issues: npm lint



