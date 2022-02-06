const express = require("express");

const placesRoutes = require("./routes/places-routes");

const app = express();
app.use(express.json());

app.use("/api/places", placesRoutes);

// If any route raise an error, this middleware will catch the error
app.use((error, req, res, next) => {
  // Verify if response was sent already
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

app.listen(5000);
