import { DB } from "config/db";
import { connect } from "lib/database";
import withSession from "lib/session";
import { ObjectID } from 'mongodb';

/*//
export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  return TestGetUser(req, res)
  return res.json({
    satu: ObjectID().toString(),
    dua: ObjectID().getTimestamp()
  })
} // */

export default withSession(async (req, res) => {
  const apiUser = req.session.get("user");

  if (!apiUser || apiUser.isLoggedIn === false) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { q } = req.query;
  console.log(new Date(), q);

  return res.json({
    satu: ObjectID().toString(),
    dua: ObjectID().getTimestamp()
  })
});

const TestGetLicense = async (req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Licenses).findOne();

    if (rs) {
      return res.json(rs);
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

const TestGetUser = async (req, res) => {
  try {
    const { db } = await connect();
    // const rs = await db.collection(DB.Users).findOne();
    const cursor = await db.collection(DB.Users).aggregate([
      { $match: { username: 'lidias' }},
      // { $unwind: '$license'},
      { $lookup: {
        from: DB.Licenses,
        localField: "licenseId",
        foreignField: "_id",
        as: "license"
      }},
      { $unwind: '$license'},
    ]);

    const rs = await cursor.next();

    if (rs) {
      return res.json(rs);
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

const TestGetPersona = async (req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Personae).findOne();

    if (rs) {
      return res.json(rs);
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

const TestGetClient = async (req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Clients).findOne();

    if (rs) {
      return res.json(rs);
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

const TestGetProject = async (req, res) => {
  try {
    const { db } = await connect();
    // const rs = await db.collection(DB.Projects).findOne();
    const { pid } = req.query;
    const cursor = await db.collection(DB.Projects).aggregate([
      { $match: { _id: pid }},
      { $lookup: {
        from: DB.Clients,
        localField: "clientId",
        foreignField: "_id",
        as: "clients"
      }},
      { $lookup: {
        from: DB.Personae,
        localField: "_id",
        foreignField: "projectId",
        as: "personae"
      }},
      { $unwind: '$clients' },
      // { $unwind: '$personae' },
      { $project: {
        depmode: 1,
        'clients.name': 1,
        personae: 1,
      }}
    ]);

    const rs = await cursor.next();

    if (rs) {
      return res.json(rs);
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

const TestGetGuest = async (req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Guests).findOne();

    if (rs) {
      return res.json(rs);
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

const TestGetBatch = async (req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Batches).findOne();

    if (rs) {
      return res.json(rs);
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}