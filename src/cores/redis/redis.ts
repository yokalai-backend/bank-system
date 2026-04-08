import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis error", err));

export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

export default client;
