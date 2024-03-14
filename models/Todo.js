const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    match: [/^[a-zA-Z\s]+$/, "Name must contain only letters"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [1, "Age must be at least 1"],
  },
  position: {
    type: String,
    required: [true, "Position is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["Male", "Female"],
      message: "Gender must be either Male or Female",
    },
  },
  terms: {
    type: Boolean,
    required: [true, "Terms must be accepted"],
  },
});

module.exports = mongoose.model("Todo", todoSchema);
