# How to run
### Production
+ Build: `npm run build`
+ Run: `npm start`

### Local
Run: `npm run start:dev`
### Tests
+ `npm test`
##

### Some Observations
+ MongoService is an example of class utilizing singleton pattern
+ I have used mongodb native nodejs driver instead of mongoose to demonstrate better use cases for generics
+ Services have their signatures defined using interfaces
+ CustomerController is an example of function based controllers using interface
+ Authentication Controller is an example of using class based controller
+ AuthService has middleware for authenticating a user
+ Zod has been used for input data validation

