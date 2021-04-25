import { DB } from "config/db";
import { connect } from "lib/database";

export default async (req, res) => {
  try {
    const { db } = await connect();
    const modules_meta = await db.collection(DB.ModulesMeta).find().toArray();
    const licenses = await db.collection(DB.Licenses).find().toArray();
    const users = await db.collection(DB.Users).find().toArray();
    const clients = await db.collection(DB.Clients).find().toArray();
    const projects = await db.collection(DB.Projects).find().toArray();
    const batches = await db.collection(DB.Batches).find().toArray();
    const guests = await db.collection(DB.Guests).find().toArray();
    const personae = await db.collection(DB.Personae).find().toArray();
    const sechedules = await db.collection(DB.Schedules).find().toArray();

    return res.json({
      // modules_meta,
      // licenses,
      users,
      clients,
      // projects,
      // batches,
      // guests,
      // personae,
      // sechedules,
    })
  } catch (error) {
    return res.status(error.status || 500).end(error.message);
  }
}