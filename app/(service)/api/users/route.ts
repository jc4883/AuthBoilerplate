import { db } from '@vercel/postgres';

export async function GET() {
  const client = await db.connect();
  const { rows } = await client.sql`SELECT * FROM users`;
  return Response.json({ data: rows });
}
