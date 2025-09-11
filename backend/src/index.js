import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./db/connection.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Handle DB
    await sequelize.sync(/*{force: true}*/);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Error running the server: ", error);
  }
}

main();
