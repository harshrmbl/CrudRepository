const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const Joi = require('joi');
const bodyparser = require('body-parser')


//SCHEMA
const createTodoSchema = Joi.object({
  name: Joi.string().pattern(new RegExp("[a-zA-Z]+$")).required().messages({
      'string.empty': 'Name is required',
      'string.pattern.base': 'Name must contain only letters',
  }),
  age: Joi.number().integer().min(1).required().messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be an integer',
      'number.min': 'Age must be at least 1',
      'any.empty': 'Age is required',
  }),
  position: Joi.string().required().messages({
      'string.empty': 'Position is required',
  }),
  gender: Joi.string().valid("Male", "Female").required().messages({
      'any.only': 'Gender must be Male or Female',
      'any.required': 'Gender is required',
  }),
  terms: Joi.boolean().valid(true).required().messages({
      'boolean.base': 'Terms must be a boolean value',
      'any.required': 'Terms is required',
      'any.only': 'Terms must be checked'
  }),

});


//Middleware Validation
const validateTodoCreation = async (req, res, next) => {
  try {
    const validateData = await createTodoSchema.validateAsync(req.body, { abortEarly: false });
    req.validatedData = validateData;
    next();
  } catch (error) {
    let errorMessage = {};
    error.details.forEach(detail => {
      
      if (['name', 'age', 'position', 'gender', 'terms'].includes(detail.context.key)) {
        errorMessage[detail.context.key] = detail.message;
      }
    });
    res.status(400).json({ message: errorMessage });
  }
};

router.post("/", validateTodoCreation, async (req, res) => {
  try {
    const { name, age, position, gender, terms } = req.body;
    const todo = new Todo({
      name,
      age,
      position,
      gender,
      terms,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



//Get all todos

router.get("/", async (req, res) => {
  console.log('get request')
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update a todo

router.put("/:id", async (req, res) => {
  console.log("PUT");
  try {
    const { name, age, position, gender, terms} = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo Not found" });

    todo.name = name;
    todo.age = age;
    todo.position = position;
    todo.gender = gender;
    todo.terms = terms;

    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Delete a todo
router.delete("/:id", async (req, res) => {
  console.log("Delete")
  
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.deleteOne();
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
