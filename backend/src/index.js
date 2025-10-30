import dotenv from "dotenv";
import app from "./app.js";
import { sequelize } from "./db/connection.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Handle DB
    await sequelize.sync(/*{force: true}*/);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error running the server: ", error);
  }
}

main();
