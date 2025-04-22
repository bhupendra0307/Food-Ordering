import mysql from "mysql2/promise";

const myConnection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Database@111",
  database: "FoodDatabase",
});

// Check is database is connected or not
myConnection.connect((err) => {
  if (err) {
    console.error("Database connection Failed:", err);
  } else {
    console.log("Database connected successfully!");
  }
});

export default myConnection;
