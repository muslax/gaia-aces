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

const ACCEPTED_QUERIES = {};


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

  if (!q || !ACCEPTED_QUERIES[q]) {
    return res.status(400).json({ message: 'Bad Request' })
  }

  const task = ACCEPTED_QUERIES[q];
  return task (apiUser, req.query, res);
});

const GetLicense = async(apiUser, req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Licenses).findOne({ _id: apiUser.licenseId });
    if (rs) return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

ACCEPTED_QUERIES['get-license'] = GetLicense;

/**
 *
 * @param {*} apiUser
 * @param {*} req
 * @param {*} res
 * @returns
 */
ACCEPTED_QUERIES['get-projects'] = async(apiUser, req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Projects).aggregate([
      { $match: { licenseId: apiUser.licenseId }},
      { $lookup: {
        from: DB.Clients,
        localField: 'clientId',
        foreignField: '_id',
        as: 'client',
      }},
      { $lookup: {
        from: DB.Users,
        localField: 'admin',
        foreignField: 'username',
        as: 'adminRef',
      }},
      { $unwind: '$client' },
      { $unwind: '$adminRef' },
      { $sort: { _id: -1 }},
      { $project: {
        status: 1,
        depmode: 1,
        title: 1,
        admin: 1,
        'client.orgName': 1,
        'client.city': 1,
        'adminRef.fullname': 1,
      }},
    ]).toArray();

    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}



/**
 * https://stackoverflow.com/questions/44413668/mongodb-aggregation-limit-lookup
 * @param {*} apiUser
 * @param {*} req
 * @param {*} res
 * @returns
 */
ACCEPTED_QUERIES['get-clients'] = async(apiUser, req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Clients).aggregate([
      { $match: { licenseId: apiUser.licenseId }},
      { $lookup: {
        from: 'projects',
        as: 'projects',
        let: { indicator_id: '$clientId' },
        pipeline: [
          { $match: {
            $expr: { $eq: [ '$obj_id', '$$indicator_id' ] }
          } },
          { $sort: { _id: -1 }},
          // { $limit: 1 }
        ]
      }},
      // { $unwind: '$lastProject'},
      { $project: {
        "licenseId": 1,
        "orgName": 1,
        "address": 1,
        "city": 1,
        "phone": 1,
        "contacts": 1,
        "createdBy": 1,
        "createdAt": 1,
        'projects._id': 1,
        'projects.title': 1,
        'projects.status': 1,
        'projects.startDate': 1,
      }}
    ]).toArray()

    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


ACCEPTED_QUERIES['get-users'] = async(apiUser, req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Users).find(
      { licenseId: apiUser.licenseId, deleted: false },
      { projection: {
        fullname: 1,
        username: 1,
        email: 1,
        licenseOwner: 1,
        verified: 1,
        disabled: 1,
        // gender: null,
        // phone: null,
      }}
    ).toArray();

    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


ACCEPTED_QUERIES['XXXXXXXXX'] = async(apiUser, req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Projects).aggregate([]);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}





const GetClientsWithLastProject = async(apiUser, req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Clients).aggregate([
      { $match: { licenseId: apiUser.licenseId }},
      { $lookup: {
        from: 'projects',
        as: 'lastProject',
        let: { indicator_id: '$clientId' },
        pipeline: [
          { $match: {
            $expr: { $eq: [ '$obj_id', '$$indicator_id' ] }
          } },
          { $sort: { _id: -1 }},
          { $limit: 1 }
        ]
      }},
      // { $unwind: '$lastProject'},
      { $project: {
        "licenseId": 1,
        "address": 1,
        "city": 1,
        "phone": 1,
        "contacts": 1,
        "createdBy": 1,
        "createdAt": 1,
        "name": 1,
        'lastProject.title': 1,
        'lastProject.status': 1,
        'lastProject.startDate': 1,
      }}
    ]).toArray()

    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}



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