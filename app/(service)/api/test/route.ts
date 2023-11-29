import moment from 'moment-timezone';
import crypto from 'crypto';
import { IS_LOCAL_PROXY } from '@/app/(service)/constants/nodeEnv';
import { AppCookie } from '@/app/(service)/constants/appCookie';
import { db } from '@vercel/postgres';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as Models from '@/app/(service)/models';
import * as dbUtils from '@/app/(service)/util/db';
import * as AuthConstants from '@/app/(service)/constants/auth';

export async function GET() {
  redirect('/dashboard');
}
