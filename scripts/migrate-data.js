const { Client } = require("pg");

const OLD_DB =
  "postgresql://neondb_owner:npg_yZvS6H4dErwM@ep-blue-thunder-azr8ztnk-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const NEW_DB =
  "postgresql://neondb_owner:npg_zNlPTM0J1xrj@ep-gentle-band-az4rafj3-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Urutan penting karena ada foreign key
const TABLES = ["tutor", "siswa", "kelas", "laporan_bulanan"];

async function copyTable(oldClient, newClient, table) {
  const { rows } = await oldClient.query(`SELECT * FROM "${table}"`);

  console.log(`📦 ${table}: ${rows.length} data`);

  if (rows.length === 0) return;

  const columns = Object.keys(rows[0]);

  for (const row of rows) {
    const values = columns.map((c) => row[c]);

    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

    const sql = `
      INSERT INTO "${table}"
      (${columns.map((c) => `"${c}"`).join(", ")})
      VALUES (${placeholders})
      ON CONFLICT (id) DO NOTHING
    `;

    await newClient.query(sql, values);
  }

  console.log(`✅ ${table} selesai`);
}

async function main() {
  const oldClient = new Client({
    connectionString: OLD_DB,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const newClient = new Client({
    connectionString: NEW_DB,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await oldClient.connect();
  await newClient.connect();

  console.log("🚀 Connected");

  for (const table of TABLES) {
    await copyTable(oldClient, newClient, table);
  }

  await oldClient.end();
  await newClient.end();

  console.log("🎉 Semua data berhasil dipindahkan");
}

main().catch((err) => {
  console.error(err);
});
