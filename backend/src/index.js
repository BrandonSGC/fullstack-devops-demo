import app from "./app.js";

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    app.listen(PORT);
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error running the server: ", error);
  }
}

main();
