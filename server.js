require("dotenv").config();

const { PORT = 5000, DATABASE_URI } = process.env;

const app = require("./app");
const connectDB = require("./src/data/connection");

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  connectWithRetry();
});

function connectWithRetry() {
  connectDB(DATABASE_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err?.message || err);
      setTimeout(connectWithRetry, 15000); // retry after 15s
    });
}