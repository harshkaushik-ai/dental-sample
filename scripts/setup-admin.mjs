// scripts/setup-admin.mjs
// Run: node scripts/setup-admin.mjs
// Or:  npm run setup-admin

import { createInterface } from "readline";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  console.log("\n🦷  Lumina Dental — Admin Setup\n");
  console.log("This will create your first admin account.\n");

  const setupKey = await ask("Setup key (from .env ADMIN_SETUP_KEY): ");
  const name     = await ask("Admin full name: ");
  const username = await ask("Username: ");
  const password = await ask("Password (min 8 chars): ");

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters.");
    process.exit(1);
  }

  rl.close();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/admin/setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setupKey, username, password, name }),
    });

    const data = await res.json();

    if (data.success) {
      console.log(`\n✅ ${data.message}`);
      console.log(`\n👉 Login at: ${baseUrl}/admin/login`);
      console.log(`   Username: ${username}\n`);
    } else {
      console.error(`\n❌ ${data.message}\n`);
    }
  } catch (err) {
    console.error("\n❌ Failed to connect. Make sure your dev server is running (npm run dev)\n");
    console.error(err.message);
  }
}

main();
