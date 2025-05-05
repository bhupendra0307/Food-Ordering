import mysql from "mysql2/promise";

const myConnection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "*****",
  database: "FoodDatabase",
});
/*
1. This line creates and opens a connection to the MySQL database using await.
2. The await keyword pauses the execution until the connection is fully established.
3. The createConnection() method is asynchronous and returns a Promise — that's why await is used.
*/
/*
1. Using await ensures that the connection is successfully created before moving to the next line of code. If the connection fails, it throws an error immediately.
2. Without await, you may try to use the connection before it is ready — leading to runtime errors.
*/

// Check is database is connected or not
myConnection.connect((err) => {
  if (err) {
    console.error("Database connection Failed:", err);
  } else {
    console.log("Database connected successfully!");
  }
});

export default myConnection;
