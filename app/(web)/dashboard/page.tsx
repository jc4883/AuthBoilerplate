import { Suspense } from 'react';
import { db } from '@vercel/postgres';

async function getData() {
  const client = await db.connect();
  const { rows } = await client.sql`SELECT * FROM users`;
  return rows;
}

export default async function Dashboard() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Suspense fallback={<div>{'loading...'}</div>}>
        <Joke />
      </Suspense>
    </main>
  );
}

async function Joke() {
  const data = await getData();
  return <div>{JSON.stringify(data)}</div>;
}
