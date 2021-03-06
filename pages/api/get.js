import { API } from "config";
import { DB } from "config/db";
import { connect } from "lib/database";
import withSession from "lib/session";
import { ObjectID } from 'mongodb';


const GetLicense = async(req, res) => {
  try {
    const apiUser = req.session.get("user");
    const { db } = await connect();
    const rs = await db.collection(DB.Licenses).findOne({ _id: apiUser.licenseId });
    if (rs) return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const GetWorkbook = async(req, res) => {
  console.log("get-workbook");
  try {
    const apiUser = req.session.get("user");
    const { db } = await connect();
    const rs = await db.collection(DB.Workbooks)
      .find().limit(1).sort({ _id: -1 }).toArray();
    if (rs) return res.json(rs[0]);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const GetProjects = async(req, res) => {
  try {
    const apiUser = req.session.get("user");
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
        batchMode: 1,
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


// https://stackoverflow.com/questions/44413668/mongodb-aggregation-limit-lookup
const GetClients = async(req, res) => {
  try {
    const apiUser = req.session.get("user");
    const { db } = await connect();
    const rs = await db.collection(DB.Clients).aggregate([
      { $match: { licenseId: apiUser.licenseId }},
      { $lookup: {
        from: 'projects',
        // localField: '_id',
        // foreignField: 'clientId',
        as: 'projects',
        let: { indicator_id: '$_id' },
        pipeline: [
          { $match: {
            $expr: { $eq: [ '$clientId', '$$indicator_id' ] }
          } },
          { $sort: { _id: -1 }},
        //   // { $limit: 1 }
        ]
      }},
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
        'projects.createdAt': 1,
      }}
    ]).toArray()

    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const GetSimpleClients = async(req, res) => {
  try {
    const apiUser = req.session.get("user");
    const { db } = await connect();
    const rs = await db.collection(DB.Clients).find(
      { licenseId: apiUser.licenseId },
      { projection: {
        orgName: 1,
        address: 1,
        city: 1
      }}
    ).toArray();

    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const GetUsers = async(req, res) => {
  try {
    const apiUser = req.session.get("user");
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
      }}
    ).toArray();

    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const GetUsernames = async(req, res) => {
  try {
    const apiUser = req.session.get("user");
    const { db } = await connect();
    const rs = await db.collection(DB.Users).find(
      { licenseId: apiUser.licenseId, deleted: false, disabled: false },
      { projection: {
        fullname: 1,
        username: 1,
        // email: 1,
        // licenseOwner: 1,
        // verified: 1,
        // disabled: 1,
      }}
    ).toArray();

    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const getProject = async(req, res) => {
  console.log("getProject");
  try {
    const apiUser = req.session.get("user");
    const { pid } = req.query;
    const { db } = await connect();
    const cursor = await db.collection(DB.Projects).aggregate([
      { $match: { _id: pid, licenseId: apiUser.licenseId }},
      { $limit: 1 },
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
        as: 'projectAdmin',
      }},
      // { $lookup: {
      //   from: DB.Batches,
      //   localField: '_id',
      //   foreignField: 'projectId',
      //   as: 'batches',
      // }},
      { $lookup: {
        from: DB.Batches,
        as: 'batches',
        let: { indicator_id: '$_id' },
        pipeline: [
          { $match: {
            $expr: { $eq: [ '$projectId', '$$indicator_id' ] }
          } },
          { $sort: { _id: -1 }},
        ]
      }},
      { $unwind: '$client' },
      { $unwind: '$projectAdmin' },
      { $project: {
        title: 1,
        fullTitle: 1,
        description: 1,
        startDate: 1,
        endDate: 1,
        batchMode: 1,
        status: 1,
        'admin.username': '$projectAdmin.username',
        'admin.fullname': '$projectAdmin.fullname',
        'client.name': '$client.orgName',
        'client.city': '$client.city',
        'batches._id': 1,
        'batches.batchName': 1,
        'batches.dateOpen': 1,
        'batches.dateClosed': 1,
        'batches.accessCode': 1,
        'batches.modules': 1,
      }}
    ]);

    const rs = await cursor.next();
    if (!rs) return res.status(404).json({ message: 'Not found' })
    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


// const getProject = async(req, res) => {
//   console.log("getProject");
//   try {
//     const apiUser = req.session.get("user");
//     const { pid } = req.query;
//     const { db } = await connect();
//     const rs = await db.collection(DB.Projects).findOne({ _id: pid })

//     if (!rs) return res.status(404).json({ message: 'Not found' })
//     return res.json(rs)
//   } catch (error) {
//     return res.status(error.status || 500).end(error.message)
//   }
// }


/**
 * Return project batch with personae info
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getBatch = async(req, res) => {
  console.log("getBatch");
  try {
    const apiUser = req.session.get("user");
    const { bid } = req.query;
    const { db } = await connect();

    // TODO: attach batch schedule info
    const cursor = await db.collection(DB.Batches).aggregate([
      { $match: { _id: bid }},
      { $limit: 1 },
      { $lookup: {
        from: DB.Personae,
        localField: '_id',
        foreignField: 'batchId',
        as: 'personae',
      }},
      { $project: {
        projectId: 1,
        batchName: 1,
        accessCode: 1,
        modules: 1,
        dateOpen: 1,
        dateClosed: 1,
        disabled: 1,
        createdBy: 1,
        createdAt: 1,
        personae: { $size: '$personae' }
      }}
    ]);

    const rs = await cursor.next();
    console.log(rs);
    if (!rs) return res.status(404).json({ message: 'Not found' })
    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


// const getModulesMeta = async(req, res) => {
//   try {
//     const { db } = await connect();
//     const rs = await db.collection(DB.ModulesMeta).find().sort({ order: 1 }).toArray();
//     return res.json(rs)
//   } catch (error) {
//     return res.status(error.status || 500).end(error.message)
//   }
// }


// const getGuidedModules = async(req, res) => {
//   try {
//     const { db } = await connect();
//     const rs = await db.collection(DB.ModulesMeta).find({ method: 'guided' }).sort({ order: 1 }).toArray();
//     return res.json(rs)
//   } catch (error) {
//     return res.status(error.status || 500).end(error.message)
//   }
// }

// Daftar persona dalam batch

const getPersonae = async(req, res) => {
  console.log('getPersonae', req.query);
  try {
    const { bid } = req.query;
    console.log('batchId', bid);
    const { db } = await connect();
    const rs = await db.collection(DB.Personae).find(
      { batchId: bid },
      { projection: {
        // _id: 1,
        // licenseId: 1,
        // projectId: 1,
        // batchId: 1,
        disabled: 1,
        username: 1,
        email: 1,
        fullname: 1,
        gender: 1,
        birth: 1,
        phone: 1,
        nip: 1,
        position: 1,
        currentLevel: 1,
        targetLevel: 1,
        simGroup: 1,
        tests: 1,
        sims:  1,
        // simsPerformed: 1,
        // _tests: {$size: '$tests'},
        // _sims: {$size: '$sims'},
        // _testsPerformed: {$size: '$testsPerformed'},
        // _simsPerformed: {$size: '$simsPerformed'},
      }}
    ).toArray();
    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const getGuests = async(req, res) => {
  console.log('getGuests', req.query);
  try {
    const { bid } = req.query;
    const { db } = await connect();
    const rs = await db.collection(DB.Guests).find(
      { batchId: bid },
      { projection: {
        // _id: 1,
        projectId: 1,
        batchId: 1,
        type: 1,
        disabled: 1,
        username: 1,
        email: 1,
        fullname: 1,
      }}
    ).toArray();
    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const getTestAccess = async(req, res) => {
  console.log('getBatchCredentials');
  try {
    const { bid } = req.query;
    const { db } = await connect();
    const rs = await db.collection(DB.Personae).find(
      { batchId: bid },
      { projection: {
        batchId: 1,
        fullname: 1,
        username: 1,
        email: 1,
        xfpwd: 1,
      }}
    ).toArray();
    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const checkAccessCode = async(req, res) => {
  try {
    const { db } = await connect()
    const { token } = req.query
    const rs = await db.collection(DB.Batches).findOne({ accessCode: token })
    if (rs) {
      return res.json({ message: 'not-available' })
    } else {
      return res.json({ message: 'available' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const XXXXX = async(req, res) => {
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Projects).aggregate([]);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const ACCEPTED_QUERIES = {};

ACCEPTED_QUERIES[API.GET_LICENSE]           = GetLicense;
ACCEPTED_QUERIES[API.GET_PROJECTS]          = GetProjects;
ACCEPTED_QUERIES[API.GET_CLIENTS]           = GetClients;
ACCEPTED_QUERIES[API.GET_SIMPLE_CLIENTS]    = GetSimpleClients;
ACCEPTED_QUERIES[API.GET_USERS]             = GetUsers;
ACCEPTED_QUERIES[API.GET_USERNAMES]         = GetUsernames;
ACCEPTED_QUERIES[API.GET_PROJECT]           = getProject;
ACCEPTED_QUERIES[API.GET_BATCH]             = getBatch;
ACCEPTED_QUERIES[API.GET_PERSONAE]          = getPersonae;
ACCEPTED_QUERIES[API.GET_GUESTS]            = getGuests;
ACCEPTED_QUERIES[API.GET_WORKBOOK]          = GetWorkbook;
ACCEPTED_QUERIES[API.GET_TEST_ACCESS]       = getTestAccess;
ACCEPTED_QUERIES['check-access-code'] = checkAccessCode

// ACCEPTED_QUERIES['get-guided-modules']    = getGuidedModules;



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
  return task (req, res);
});




const GetClientsWithLastProject = async(req, res) => {
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
