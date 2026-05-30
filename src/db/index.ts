import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { relations } from './schema/relation'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

export const db = drizzle({
  client: pool,
  relations: relations,
})
