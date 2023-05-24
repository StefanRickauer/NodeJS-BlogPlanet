# NodeJS-BlogPlanet
Web application for blog posts, including login functionality and database connection.

In order for the web application to work, add a folder named ".env" in the root directory of this project. 
The ".env"-file must contain the following constants (add values => no quotation marks, no spaces):
  DATABASE_URL=<Database URL>
  PORT=<Port Number>
  SECRET=<Random String Sequence>
  
e.g.
  DATABASE_URL=mongodb://localhost:27017/yourDatabaseURL
  PORT=5050
  SECRET=thisIsNotArandomString_
