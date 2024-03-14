const express = require('express');
const mongoose = require('mongoose');
const todoRouter = require('./routes/todos'); 

const app = express();
const cors = require('cors');


const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

const corsOptions= {
  origin:'http://localhost:3000'
}

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(`mongodb://localhost:27017/myDatabase`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Use the todo router
app.use("/api/todos", todoRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
