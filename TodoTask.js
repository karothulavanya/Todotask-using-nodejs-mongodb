const mongoose = require("mongoose");
const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});
const TodoTask = mongoose.model("TodoTask", todoTaskSchema);

module.exports = TodoTask;
