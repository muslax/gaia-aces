import { MongoClient } from 'mongodb'
import { DBNAME } from 'config/db'

const uri = process.env.NODE_ENV == 'development' ? process.env.MONGO_LOCAL : process.env.MONGO_AWSGM2

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function connect() {
  if (!client.isConnected()) await client.connect()

  const db = client.db(DBNAME)
  return { db, connect }
}

export { connect }