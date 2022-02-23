const express = require("express");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error")
const placeRoutes = require("./routes/place-routes");
const userRoutes = require("./routes/user-routes");

const PORT = 5000;
const app = express();
app.use(express.json());

app.use("/api/place", placeRoutes);
app.use("/api/user/", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

// If any route raise an error, this middleware will catch the error
app.use((error, req, res, next) => {
  // Verify if response was sent already
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

mongoose.connect('mongodb://backend:backend1234@localhost:27017/yourplaces')
  .then(() => {
    // Starts the http server (backend) only if the connection to mongodb was successful
    app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
  })
  .catch(error => console.error(error));
