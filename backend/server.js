const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/seller", require("./routes/seller.routes"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/conversations", require("./routes/conversation"));


const PORT = process.env.PORT || 4000;
app.get("/test-auth", require("./middleware/auth"), (req, res) => {
  res.json({ user: req.user });
});

const authMiddleware = require("./middleware/auth");

app.get("/test-auth", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
