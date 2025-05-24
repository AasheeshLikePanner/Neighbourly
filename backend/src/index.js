

import { connectDB } from './db/index.js';
import app from './app.js';

console.log("Starting the server...");

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!!!", err);
    process.exit(1); // Exit the process with a failure code
  });