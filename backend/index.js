const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../components/config.js");
const { authenticateToken } = require("./middleware");
const util = require("util");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mahsoulna_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database!");
});
const query = util.promisify(connection.query).bind(connection);

//API endpoint for user registration
app.post("/api/register", async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    selectedDate,
    phoneNumber,
    gender,
  } = req.body;

  try {
    //check if the user already exists
    const userExistsQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(userExistsQuery, [email], (err, result) => {
      if (err) {
        console.error("Error checking user existence:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (result.length > 0) {
        //user with the provided email already exists
        return res
          .status(409)
          .json({ error: "User already exists with this email" });
      }

      //hash the password before storing it in the database
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("Error hashing password:", hashErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        //save the user data to the database
        const insertQuery =
          "INSERT INTO users (email, password ,u_Fname	,u_Lname ,u_phone ,gender, date_of_birth) VALUES (?,?,?,?,?,?,?)";
        connection.query(
          insertQuery,
          [
            email,
            hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            gender,
            selectedDate,
          ],
          (insertErr, result) => {
            if (insertErr) {
              console.error("Error registering user:", insertErr);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            console.log("User registered successfully:", result);
            res.json({ message: "User registered successfully" });
          }
        );
      });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//API endpoint for user login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if the user exists in the database
    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          //user with the provided email not found
          return res.status(404).json({ error: "User not found" });
        }

        //compare the provided password with the hashed password in the database
        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          //incorrect password
          return res.status(401).json({ error: "Incorrect password" });
        }

        //password is correct, user is authenticated
        const token = jwt.sign(
          { email: user.email, userId: user.u_id },
          config.jwtSecret,
          {
            expiresIn: "2h", //the token will expire in 2 hours
          }
        );

        res.json({
          token,
          user: { email: user.email, userId: user.u_id, enabled: user.enabled },
        });
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//API endpoint to fetch all categories
app.get("/api/categories", (req, res) => {
  const query = "SELECT * FROM category";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

//Add a new API endpoint to fetch random items
app.get("/api/randomItems", (req, res) => {
  const query = "SELECT * FROM products ORDER BY RAND() LIMIT 6";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching random items:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

//API endpoint to fetch products of a specific category
app.get("/api/products/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const query = "SELECT * FROM products WHERE category_id = ?";
  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Add a new API endpoint to fetch recently added items
app.get("/api/recentlyAddedItems", (req, res) => {
  const query = "SELECT * FROM products ORDER BY added_at DESC LIMIT 6";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching recently added items:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

//API endpoint to search for products based on a query
app.get("/api/search", (req, res) => {
  const searchQuery = req.query.query;
  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required." });
  }

  //perform search in the products table based on the search query
  const searchProductsQuery =
    "SELECT * FROM products WHERE name LIKE ? OR product_brand LIKE ?";

  connection.query(
    searchProductsQuery,
    [`%${searchQuery}%`, `%${searchQuery}%`],
    (err, productResults) => {
      if (err) {
        console.error("Error searching products:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(productResults);
      }
    }
  );
});

//API endpoint to place orders and order location
app.post("/api/placeOrder", (req, res) => {
  const {
    userId,
    orderReceipt,
    cartItems,
    totalAmount,
    orderStatus,
    location,
    changeFor,
    specialReq,
  } = req.body;
  const roundedLatitude = Number(location.latitude.toFixed(6));
  const roundedLongitude = Number(location.longitude.toFixed(6));

  //check if the location exists in the locations table
  const checkLocationQuery =
    "SELECT location_id, COUNT(*) AS location_count FROM locations WHERE latitude = ? AND longitude = ?";

  connection.query(
    checkLocationQuery,
    [roundedLatitude, roundedLongitude],
    (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking location:", checkErr);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        let locationId;
        const locationCount = checkResult[0].location_count;
        if (locationCount > 0) {
          //location already exists
          locationId = checkResult[0].location_id;
          insertOrder(userId, totalAmount, locationId, changeFor, specialReq);
        } else {
          //location doesn't exist, insert it
          const insertLocationQuery =
            "INSERT INTO locations (latitude, longitude, address) VALUES (?, ?, ?)";

          connection.query(
            insertLocationQuery,
            [location.latitude, location.longitude, location.address],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting location:", insertErr);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                locationId = insertResult.insertId;
                insertOrder(
                  userId,
                  totalAmount,
                  locationId,
                  changeFor,
                  specialReq
                );
              }
            }
          );
        }
      }
    }
  );

  function insertOrder(userId, totalAmount, locationId, changeFor) {
    // Insert the order into the orders table
    const insertOrderQuery =
      "INSERT INTO orders (u_id, order_receipt, total_amount, location_id, order_status, change_for, special_req) VALUES (?, ?, ?, ?, ?, ?, ?)";

    connection.query(
      insertOrderQuery,
      [
        userId,
        orderReceipt,
        totalAmount,
        locationId,
        orderStatus,
        changeFor,
        specialReq,
      ],
      (orderErr, orderResult) => {
        if (orderErr) {
          console.error("Error placing order:", orderErr);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const orderId = orderResult.insertId;
          insertOrderItems(orderId);
        }
      }
    );
  }

  function insertOrderItems(orderId) {
    // Convert cartItems array to JSON string
    const orderItemsJSON = JSON.stringify(cartItems);

    // Insert the order items into the order_items table
    const insertOrderItemsQuery =
      "INSERT INTO order_items (order_id, ordered_products) VALUES (?, ?)";

    connection.query(
      insertOrderItemsQuery,
      [orderId, orderItemsJSON],
      (itemsErr) => {
        if (itemsErr) {
          console.error("Error inserting order items:", itemsErr);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          // Order and order items inserted successfully
          res.status(200).json({ message: "Order placed successfully" });
        }
      }
    );
  }
});

// API endpoint to fetch user information
app.get("/api/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const query =
    "SELECT u_id, email, u_Fname, u_Lname, u_phone, gender, date_of_birth, u_pp FROM users WHERE u_id = ?";
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user information:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0];

    // Check if u_pp field is null or undefined
    if (user.u_pp === null || user.u_pp === undefined) {
      // If u_pp is null or undefined, handle it accordingly
      user.u_pp_base64 = null; // Or any default value you prefer
    } else {
      // Convert blob to base64
      const base64Image = user.u_pp.toString("base64");
      // Attach the base64 string to the user data
      user.u_pp_base64 = base64Image;
    }

    // Send the modified user data to the client
    res.status(200).json(user);
  });
});


// API endpoint to disable user account
app.post("/disableAccount", (req, res) => {
  const userId = req.body.userId;

  //update the 'enabled' column to 0 for the specified user
  const sql = "UPDATE users SET enabled = 0 WHERE u_id = ?";

  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error updating user account:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("User account disabled successfully");
      res.status(200).json({ message: "User account disabled successfully" });
    }
  });
});

//API endpoint to add or remove an item from the wishlist
app.post("/api/wishlist/addRemove", (req, res) => {
  const userId = req.body.userId;
  const itemId = req.body.itemId;

  //check if the item is already in the wishlist
  const checkQuery =
    "SELECT wishlist_item_id FROM wishlist WHERE user_id = ? AND wishlist_item_id = ?";
  connection.query(checkQuery, [userId, itemId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking wishlist:", checkErr);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (checkResult.length > 0) {
        //item already exists in the wishlist, remove it
        const removeQuery =
          "DELETE FROM wishlist WHERE user_id = ? AND wishlist_item_id = ?";
        connection.query(
          removeQuery,
          [userId, itemId],
          (removeErr, removeResult) => {
            if (removeErr) {
              console.error("Error removing item from wishlist:", removeErr);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              res
                .status(200)
                .json({ message: "Item removed from the wishlist" });
            }
          }
        );
      } else {
        //item doesn't exist, add it to the wishlist
        const addQuery =
          "INSERT INTO wishlist (user_id, wishlist_item_id) VALUES (?, ?)";
        connection.query(addQuery, [userId, itemId], (addErr, addResult) => {
          if (addErr) {
            console.error("Error adding item to wishlist:", addErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({ message: "Item added to the wishlist" });
          }
        });
      }
    }
  });
});

//API endpoint to fetch wishlist
app.get("/api/wishlist/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = "SELECT wishlist_item_id FROM wishlist WHERE user_id = ?";

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching wishlist items:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const wishlistItems = result.map((item) => item.wishlist_item_id);

      //send the wishlist items as a JSON response
      res.status(200).json({ userId, wishlistItems });
    }
  });
});

//API endpoint to fetch product details based on wishlist_item_id
app.get("/api/productWishList", (req, res) => {
  const wishlistItemIds = req.query.wishlistItemIds; //retrieve the array from query parameters

  if (!wishlistItemIds || wishlistItemIds.length === 0) {
    res.status(400).json({ error: "Invalid wishlist item IDs" });
    return;
  }

  const placeholders = Array(wishlistItemIds.length).fill("?").join(", ");
  const query = `SELECT p.product_id, p.name, p.image_path, p.price, p.category_id FROM products p INNER JOIN wishlist w ON p.product_id = w.wishlist_item_id WHERE w.wishlist_item_id IN (${placeholders});`;

  connection.query(query, wishlistItemIds, (err, result) => {
    if (err) {
      console.error("Error fetching product details:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const productDetails = result;

      if (productDetails.length > 0) {
        //send the product details as a JSON response
        res.status(200).json(productDetails);
      } else {
        res.status(404).json({ error: "Products not found" });
      }
    }
  });
});

//API endpoint to fetch avatar by ID
app.get("/api/avatars", (req, res) => {
  const query = "SELECT avatar_id, avatar FROM avatars";

  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching avatars:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      //convert blob to base64 for each avatar
      const avatarsWithBase64 = result.map((avatar) => ({
        ...avatar,
        avatar_base64: avatar.avatar.toString("base64"),
      }));

      //send the avatars data as a response
      res.status(200).json(avatarsWithBase64);
    }
  });
});

//API endpoint to set avatar by ID
app.put("/api/user/avatar/:userId", (req, res) => {
  const userId = req.params.userId;
  const { avatarBase64 } = req.body;

  const query = "UPDATE users SET u_pp = ? WHERE u_id = ?";
  connection.query(
    query,
    [Buffer.from(avatarBase64, "base64"), userId],
    (err, result) => {
      if (err) {
        console.error("Error updating avatar:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Avatar updated successfully" });
      }
    }
  );
});

//API endpoint to change user password
app.put("/api/changePassword", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Fetch user from the database using userId
    const userQuery = "SELECT * FROM users WHERE u_id = ?";
    const [userResult] = await query(userQuery, [userId]);

    if (!userResult) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches the one stored in the database
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userResult.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatePasswordQuery = "UPDATE users SET password = ? WHERE u_id = ?";
    await query(updatePasswordQuery, [hashedPassword, userId]);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//API endpoint to fetch user's orders with status filter
app.get("/api/user/orders/:userId", (req, res) => {
  const userId = req.params.userId;
  const statusFilter = req.query.status || "all"; //default to "all"

  let query =
    "SELECT order_id, order_receipt, order_date, total_amount, order_status, change_for, special_req FROM orders WHERE u_id = ?";

  //add status filter to the query if not "all"
  if (statusFilter !== "all") {
    query += " AND order_status = ?";
  }

  connection.query(
    query,
    statusFilter !== "all" ? [userId, statusFilter] : [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching user's orders:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});

//API endpoint to fetch ordered_products from order_items
app.get("/api/order/items/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  // query to fetch ordered_products for a specific order
  const query = "SELECT ordered_products FROM order_items WHERE order_id = ?";

  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching ordered products:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
