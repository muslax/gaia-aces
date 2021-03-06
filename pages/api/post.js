import { ObjectID } from "bson";
import { API } from "config";
import { DB } from "config/db";
import { connect } from "lib/database";
import withSession from "lib/session";
import { createRandomPassword } from "lib/utils";


const disableUser = async(req, res) => {
  console.log("disable-user")
  try {
    const id = req.body.id;
    const { db } = await connect();
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id },
      { $set: {
        disabled: true,
        updatedAt: new Date()
      }}
    )

    if (rs) {
      console.log(rs);
      return res.json({ message: 'User disabled' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const activateUser = async(req, res) => {
  console.log("activate-user")
  try {
    const id = req.body.id;
    const { db } = await connect();
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id },
      { $set: {
        disabled: false,
        updatedAt: new Date()
      }}
    )

    if (rs) {
      console.log(rs);
      return res.json({ message: 'User activated' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const deleteUser = async(req, res) => {
  console.log("delete-user")
  try {
    const id = req.body.id;
    const { db } = await connect();
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id },
      { $set: {
        disabled: true,
        deleted: true,
        updatedAt: new Date()
      }}
    )

    if (rs) {
      console.log(rs);
      return res.json({ message: 'User deleted' });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const resetUser = async(req, res) => {
  console.log("reset-user")
  try {
    const id = req.body.id;
    const { password, hashed_password, xfpwd } = createRandomPassword();
    console.log(password, xfpwd)

    const { db } = await connect();
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id },
      { $set: {
        xfpwd: xfpwd,
        hashed_password: hashed_password,
        updatedAt: new Date()
        }
      }
    )

    if (rs) {
      console.log(rs);
      const user = rs.value;
      return res.json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        password: password,
      });
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const changePassword = async(req, res) => {
  console.log("change-password")
  const apiUser = req.session.get("user");
  try {
    const id = apiUser._id;
    const { oldPassword, newPassowrd } = req.body;
    console.log(oldPassword, newPassowrd);
    const { db } = await connect();

    const user = await db.collection(DB.Users).findOne({ _id: id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bcrypt = require('bcryptjs')

    const verified = bcrypt.compareSync(oldPassword, user.hashed_password)
    if (!verified) return res.json({
      ok: false,
      message: "Anda memasukkan password yang salah."
    })

    const saltRounds = 5;
    const hash = bcrypt.hashSync(newPassowrd, saltRounds)
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id},
      { $set : {
        hashed_password: hash,
        updatedAt: new Date()
        }
      },
    )
    if (rs) {
      return res.json({
        ok: true,
        message: "Berhasil mengganti password."
      })
    } else {
      return res.status(500).json({ message: 'Internal server error' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const uploadLogo = async(req, res) => {
  console.log('uploadLogo');
  const apiUser = req.session.get("user");
  try {
    const { db } = await connect();
    const rs = await db.collection(DB.Licenses).findOneAndUpdate(
      { _id: apiUser.licenseId },
      { $set: {
        logoUrl: req.body.imageUrl,
        updatedAt: new Date()
      }}
    );

    console.log('RS', rs);
    const user = apiUser;
    user['licenseLogoUrl'] = req.body.imageUrl;
    console.log("user", user)
    req.session.set("user", user);
    await req.session.save();
    return res.json({ message: 'Logo updated' });
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const newUser = async(req, res) => {
  console.log("new-user")
  const apiUser = req.session.get("user");
  try {
    const { fullname, username, email } = req.body;
    const { password, hashed_password, xfpwd } = createRandomPassword();
    const id = ObjectID().toString();
    const { db } = await connect();
    const rs = await db.collection(DB.Users).insertOne({
      _id: id,
      licenseId: apiUser.licenseId,
      fullname: fullname,
      username: username,
      email: email,
      licenseOwner: false,
      verified: false,
      disabled: false,
      deleted: false,
      gender: null,
      phone: null,
      roles: [],
      xfpwd: xfpwd,
      hashed_password: hashed_password,
      createdBy: apiUser.username,
      createdAt: new Date()
    })

    if (rs) {
      console.log(rs);
      return res.json({
        _id: id,
        licenseId: apiUser.licenseOwner,
        fullname: fullname,
        email: email,
        username: username,
        password: password,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const newGuest = async(req, res) => {
  console.log("new-guest")
  const apiUser = req.session.get("user");
  try {
    const { projectId, batchId, type, fullname, username, email, phone } = req.body;
    const { password, hashed_password, xfpwd } = createRandomPassword();
    const id = ObjectID().toString();
    const { db } = await connect();
    const rs = await db.collection(DB.Guests).insertOne({
      _id: id,
      // licenseId: apiUser.licenseId,
      projectId: projectId,
      batchId: batchId,
      type: type,
      fullname: fullname,
      username: username,
      email: email,
      phone: phone,
      verified: false,
      disabled: false,
      // deleted: false,
      // gender: null,
      // phone: null,
      // roles: [],
      // xfpwd: xfpwd,
      hashed_password: hashed_password,
      createdBy: apiUser.username,
      createdAt: new Date()
    })

    if (rs) {
      console.log(rs);
      return res.json({
        _id: id,
        type: type,
        fullname: fullname,
        email: email,
        username: username,
        password: password,
        disabled: false,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const newClientProject = async(req, res) => {
  const apiUser = req.session.get("user");
  const { db, client } = await connect();
  const session = await client.startSession();

  try {
    await session.withTransaction(async () => {
      const projectId = ObjectID().toString();
      const rs = await db.collection(DB.Projects).insertOne({
        _id: projectId,
        licenseId: req.body.licenseId,
        clientId: req.body.clientId,
        status: null,
        batchMode: 'single',
        title: req.body.title,
        fullTitle: req.body.fullTitle,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        admin: apiUser.username,
        contacts: [],
        createdBy: apiUser.username,
        createdAt: new Date()
      });

      const batchId = ObjectID().toString();
      const batch = await db.collection(DB.Batches).insertOne({
        _id: batchId,
        projectId: projectId,
        batchName: 'Default Batch',
        accessCode: null,
        modules: [],
        dateOpen: null,
        dateClosed: null,
        disabled: false,
        createdBy: 'system',
        createdAt: new Date()
      });

      return res.json({ message: 'OK' });
    });
  } catch (error) {
    return res.status(error.status || 500).end(error.message);
  } finally {
    await session.endSession();
  }
}


const newProject = async(req, res) => {
  const apiUser = req.session.get("user");
  const { db, client } = await connect();
  const session = client.startSession();

  try {
    // const { db, client } = await connect();
    // const session = client.startSession();
    await session.withTransaction(async () => {
      const clientId = ObjectID().toString();

      const client = await db.collection(DB.Clients).insertOne({
        _id: clientId,
        licenseId: req.body.licenseId,
        orgName: req.body.clientName,
        address: req.body.clientAddress,
        city: req.body.clientCity,
        phone: null,
        contacts: [],
        createdBy: apiUser.username,
        createdAt: new Date()
      });
      console.log(client);

      const projectId = ObjectID().toString();
      const project = await db.collection(DB.Projects).insertOne({
        _id: projectId,
        licenseId: req.body.licenseId,
        clientId: clientId,
        status: null,
        batchMode: 'single',
        title: req.body.title,
        fullTitle: req.body.fullTitle,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        admin: apiUser.username,
        contacts: [],
        createdBy: apiUser.username,
        createdAt: new Date()
      });
      console.log(project);

      const batchId = ObjectID().toString();
      const batch = await db.collection(DB.Batches).insertOne({
        _id: batchId,
        projectId: projectId,
        batchName: 'Default Batch',
        accessCode: null,
        modules: [],
        dateOpen: null,
        dateClosed: null,
        disabled: false,
        createdBy: 'system',
        createdAt: new Date()
      });
      console.log(batch);
      return res.json({ message: 'OK' });
    })

    // console.log('Responding...');
    // res.json({ message: 'OK' });
  } catch (error) {
    return res.status(error.status || 500).end(error.message);
  } finally {
    await session.endSession();
    // await client.close();
  }
}


const changeAdmin = async(req, res) => {
  console.log("change-admin")
  try {
    const { id, username } = req.body;
    console.log(id, username);
    const { db } = await connect();
    const rs = await db.collection(DB.Projects).findOneAndUpdate(
      { _id: id },
      { $set: {
        admin: username,
        updatedAt: new Date()
      }}
    )

    if (rs) {
      console.log(rs);
      return res.json({ message: 'Admin changed' });
    } else {
      return res.status(404).json({ message: 'Project not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const saveDeployment = async(req, res) => {
  console.log("save-deployment")
  try {
    const {
      code,
      openDate,
      openTime,
      closeDate,
      closeTime,
      batchId,
    } = req.body;
    const dateOpen = `${openDate}T${openTime}:00.000+0700`;
    const dateClosed = `${closeDate}T${closeTime}:00.000+0700`;
    const { db } = await connect();
    const rs = await db.collection(DB.Batches).findOneAndUpdate(
      { _id: batchId },
      { $set: {
        accessCode: code,
        dateOpen: new Date(dateOpen),
        dateClosed: new Date(dateClosed),
        updatedAt: new Date()
      }}
    )

    console.log(rs);
    if (rs) {
      return res.json({ message: 'Deployment saved' });
    } else {
      return res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

const updateProject = async(req, res) => {
  console.log("update-project")
  try {
    const {
      projectId,
      title,
      fullTitle,
      description,
      startDate,
      endDate,
    } = req.body;
    const { db } = await connect();
    const rs = await db.collection(DB.Projects).findOneAndUpdate(
      { _id: projectId },
      { $set: {
        title: title,
        fullTitle: fullTitle,
        description: description,
        startDate: startDate,
        endDate: endDate,
        updatedAt: new Date(),
      }}
    )

    console.log(rs);
    if (rs) {
      return res.json({ message: 'Project updated' });
    } else {
      return res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const addBatch = async(req, res) => {
  console.log('addBatch')
  try {
    const user = req.session.get("user");
    const {projectId, batchName} = req.body;
    const { db } = await connect();
    const rs = await db.collection(DB.Batches).insertOne({
      _id: ObjectID().toString(),
      projectId: projectId,
      batchName: batchName,
      accessCode: null,
      modules: [],
      dateOpen: null,
      dateClosed: null,
      disabled: false,
      createdBy: user.username,
      createdAt: new Date()
    });

    if (rs) {
      const batch = rs.value;
      console.log(batch);
      return res.json({ message: 'OK' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message);
  }
}


const saveModules = async(req, res) => {
  console.log('save-modules');
  const { db, client } = await connect();
  const session = await client.startSession();
  const { batchId, modules, tests, sims } = req.body;

  try {
    await session.withTransaction(async () => {
      const batchRs = await db.collection(DB.Batches).findOneAndUpdate(
        { _id: batchId },
        { $set: {
          modules: modules,
          updatedAt: new Date()
        }}
      )

      console.log('BATCH RS', batchRs);

      const personaRs = await db.collection(DB.Personae).updateMany(
        { batchId: batchId },
        { $set: {
          tests: tests,
          sims: sims,
        }}
      );

      console.log(personaRs);

      return res.json({ message: 'OK' });
    });
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  } finally {
    session.endSession();
  }
}


const saveCSVData = async(req, res) => {
  console.log('save-csv-data');
  try {
    const { personae } = req.body;
    const docs = [];
    personae.forEach(person => {
      const doc = person;
      doc._id = ObjectID().toString();
      const { password, xfpwd, hashed_password } = createRandomPassword();
      // console.log(password, xfpwd);
      doc.xfpwd = xfpwd;
      doc.hashed_password = hashed_password;
      doc.createdAt = new Date();
      docs.push(doc);
    });

    // console.log(docs);
    // return res.json(docs);

    const { db } = await connect();
    const rs = await db.collection(DB.Personae).insertMany(docs);

    if (rs) {
      return res.json({ message: 'Personae saved' });
    } else {
      return res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}


const ACCEPTED_QUERIES = {};

ACCEPTED_QUERIES[API.DISABLE_USER]       = disableUser;
ACCEPTED_QUERIES[API.ACTIVATE_USER]      = activateUser;
ACCEPTED_QUERIES[API.DELETE_USER]        = deleteUser;
ACCEPTED_QUERIES[API.RESET_USER]         = resetUser;
ACCEPTED_QUERIES[API.CHANGE_PASSWORD]    = changePassword;
ACCEPTED_QUERIES[API.NEW_USER]           = newUser;
ACCEPTED_QUERIES[API.NEW_GUEST]          = newGuest;
ACCEPTED_QUERIES[API.NEW_PROJECT]        = newProject;
ACCEPTED_QUERIES[API.NEW_CLIENT_PROJECT] = newClientProject;
ACCEPTED_QUERIES[API.UPDATE_LOGO]        = uploadLogo;
ACCEPTED_QUERIES[API.CHANGE_ADMIN]       = changeAdmin;
ACCEPTED_QUERIES[API.ADD_BATCH]          = addBatch;
ACCEPTED_QUERIES[API.SAVE_DEPLOYMENT]    = saveDeployment;
ACCEPTED_QUERIES[API.SAVE_MODULES]       = saveModules;
ACCEPTED_QUERIES[API.SAVE_CSV_DATA]      = saveCSVData;
ACCEPTED_QUERIES[API.UPDATE_PROJECT]     = updateProject;


export default withSession(async (req, res) => {
  const apiUser = req.session.get("user");

  if (!apiUser || apiUser.isLoggedIn === false) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
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


const TestUpdateSession = async(req, res) => {
  console.log("TestUpdateSession")
  try {
    const user = req.session.get("user");
    user[req.body.key] = req.body.value;
    req.session.set("user", user);
    await req.session.save();
    return res.json({ message: 'Session updated' });
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

ACCEPTED_QUERIES['test-update-session'] = TestUpdateSession;