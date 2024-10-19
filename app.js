const express = require("express");

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
dotenv.config();
const app = express();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set("strictQuery", false);



async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Connected to db!");

    //       // Start the server after successful connection
    app.listen(3000, () => console.log("Server Up and running on port 3000"));
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

connectDB();

app.set("view engine", "ejs");

//GET

app.get("/", async (req, res) => {
  try {
    const todoTasks = await TodoTask.find(); // Fetch tasks using async/await
    res.render("todo", { todoTasks }); // Pass tasks to the EJS template
  } catch (err) {
    console.error("Error fetching tasks:", err.message || err);
    res.render("todo", { todoTasks: [] }); // Render an empty list on error
  }
});

//UPDATE

app.route("/edit/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const todoTasks = await TodoTask.find(); // Fetch all tasks
      res.render("todoEdit.ejs", { todoTasks, idTask: id }); // Render the edit page
    } catch (err) {
      console.error("Error fetching tasks for edit:", err.message || err);
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content }); // Update the task
      res.redirect("/"); // Redirect back to the main page
    } catch (err) {
      console.error("Error updating task:", err.message || err);
      res.redirect("/");
    }
  });


// DELETE

app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndDelete(id); // Use await to handle the promise
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send(err); // Send error response
  }
});

//POST

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});
