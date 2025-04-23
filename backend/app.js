// Save data in a SQL
import fs from "node:fs/promises";
import myConnection from "./config.js";
import bodyParser from "body-parser";
import express from "express";

const app = express(); // Create an express server instance

app.use(bodyParser.json()); // Parse JSON data in incoming requests
app.use(express.static("public")); // // Serve static files from /public folder (like HTML, images, etc.)

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next(); // Continue to the next middleware or route
});

// Get req - meals
app.get("/meals", async (req, res) => {
  const meals = await fs.readFile("./data/available-meals.json", "utf8");
  res.json(JSON.parse(meals));
});

// POST req - orders
// app.post("/orders", async (req, res) => {
//   const orderData = req.body.order;

//   if (!orderData || !orderData.items || orderData.items.length === 0) {
//     return res.status(400).json({ message: "Missing data." });
//   }

//   if (!orderData.customer.email || !orderData.customer.email.includes("@")) {
//     return res.status(400).json({ message: "Invalid email." });
//   }

//   try {
//     const customerName = orderData.customer.name?.trim() || "Unknown";
//     const customerEmail = orderData.customer.email?.trim();
//     const customerAddress =
//       orderData.customer.address?.trim() || "Not Provided";
//     // const customerPostalCode =
//     //   orderData.customer.postalCode?.trim() || "Not Provided";
//     const customerPostalCode = parseInt(orderData.customer.postalCode) || null;
//     const customerCity = orderData.customer.city?.trim() || "Not Provided";

//     console.log("Processing Order for:", customerName, customerEmail);
//     console.log("Postal Code:", customerPostalCode, "City:", customerCity);

//     // Check if user already exists
//     const [user] = await myConnection.query(
//       "SELECT id FROM users WHERE email = ?",
//       [customerEmail]
//     );

//     let userId;
//     if (user.length === 0) {
//       // Insert new user with postal_code and city
//       const [result] = await myConnection.query(
//         "INSERT INTO users (name, email, address, postal_code, city) VALUES (?, ?, ?, ?, ?)",
//         [
//           customerName,
//           customerEmail,
//           customerAddress,
//           customerPostalCode,
//           customerCity,
//         ]
//       );
//       userId = result.insertId;
//       console.log("New User Inserted, ID:", userId);
//     } else {
//       userId = user[0].id;
//       console.log("Existing User ID:", userId);

//       // Update existing user with new postal_code and city if not already stored
//       await myConnection.query(
//         "UPDATE users SET postal_code = ?, city = ? WHERE id = ?",
//         [customerPostalCode, customerCity, userId]
//       );
//       console.log("User Updated with Postal Code and City");
//     }

//     // Insert order
//     const [orderResult] = await myConnection.query(
//       "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
//       [userId, totalPrice]
//     );
//     console.log("New Order Inserted with Total Price:", totalPrice);
//     const orderId = orderResult.insertId;
//     console.log("New Order Inserted, ID:", orderId);

//     // Insert order items
//     for (const item of orderData.items) {
//       if (!item.id || !item.quantity) {
//         console.warn("Skipping invalid order item:", item);
//         continue;
//       }
//       await myConnection.query(
//         "INSERT INTO order_items (order_id, meal_id, quantity) VALUES (?, ?, ?)",
//         [orderId, item.id, item.quantity]
//       );
//     }
//     console.log("Order Items Inserted Successfully");

//     res.status(201).json({ message: "Order placed successfully." });
//   } catch (error) {
//     console.error("Database error:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

// POST req - orders
app.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: "Missing data." });
  }

  if (!orderData.customer.email || !orderData.customer.email.includes("@")) {
    return res.status(400).json({ message: "Invalid email." });
  }

  try {
    const customerName = orderData.customer.name?.trim() || "Unknown";
    const customerEmail = orderData.customer.email?.trim();
    const customerAddress =
      orderData.customer.address?.trim() || "Not Provided";
    const customerPostalCode = parseInt(orderData.customer.postalCode) || null;
    const customerCity = orderData.customer.city?.trim() || "Not Provided";

    console.log("Processing Order for:", customerName, customerEmail);
    console.log("Postal Code:", customerPostalCode, "City:", customerCity);
    console.log("Received orderData:", orderData); // Debugging

    // Check if user already exists
    const [user] = await myConnection.query(
      "SELECT id FROM users WHERE email = ?",
      [customerEmail]
    );

    let userId;
    if (user.length === 0) {
      const [result] = await myConnection.query(
        "INSERT INTO users (name, email, address, postal_code, city) VALUES (?, ?, ?, ?, ?)",
        [
          customerName,
          customerEmail,
          customerAddress,
          customerPostalCode,
          customerCity,
        ]
      );
      userId = result.insertId;
      // console.log("New User Inserted, ID:", userId);
    } else {
      userId = user[0].id;
      // console.log("Existing User ID:", userId);

      await myConnection.query(
        "UPDATE users SET postal_code = ?, city = ? WHERE id = ?",
        [customerPostalCode, customerCity, userId]
      );
      // console.log("User Updated with Postal Code and City");
    }

    // **Fix: Define totalPrice before using it**
    const totalPrice = parseFloat(orderData.totalPrice) || 0.0;

    const [orderResult] = await myConnection.query(
      "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      [userId, totalPrice]
    );
    // console.log("New Order Inserted with Total Price:", totalPrice);
    const orderId = orderResult.insertId;
    // console.log("New Order Inserted, ID:", orderId);

    // Insert order items
    for (const item of orderData.items) {
      if (!item.id || !item.quantity) {
        // console.warn("Skipping invalid order item:", item);
        continue;
      }
      await myConnection.query(
        "INSERT INTO order_items (order_id, meal_id, quantity) VALUES (?, ?, ?)",
        [orderId, item.id, item.quantity]
      );
    }
    console.log("Order Items Inserted Successfully");

    res.status(201).json({ message: "Order placed successfully." });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

/* --------------***** API of Save Data a order.json file

import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/meals", async (req, res) => {
  const meals = await fs.readFile("./data/available-meals.json", "utf8");
  res.json(JSON.parse(meals));
});

app.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  if (
    orderData === null ||
    orderData.items === null ||
    orderData.items.length === 0
  ) {
    return res.status(400).json({ message: "Missing data." });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes("@") ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === "" ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === "" ||
    orderData.customer["postal-code"] === null ||
    orderData.customer["postal-code"].trim() === "" ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Missing data: Email, name, street, postal code or city is missing.",
    });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };
  const orders = await fs.readFile("./data/orders.json", "utf8");
  const allOrders = JSON.parse(orders);
  allOrders.push(newOrder);
  await fs.writeFile("./data/orders.json", JSON.stringify(allOrders));
  res.status(201).json({ message: "Order created!" });
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

app.listen(3000);

*/
