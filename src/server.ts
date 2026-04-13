import buildApp from "./app";
// Only for running server

async function server() {
  const app = await buildApp();

  try {
    app.listen({ port: 5000, host: "0.0.0.0" });

    console.log("Server is running");
  } catch (error) {
    console.error("Error in while try to start server: ", error);

    process.exit(1); // Close server when fails
  }
}

server();
