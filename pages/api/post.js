import { ObjectID } from "bson";
import { DB } from "config/db";
import { connect } from "lib/database";
import withSession from "lib/session";
import { createRandomPassword } from "lib/utils";
// import bcrypt from 'bcryptjs'

const ACCEPTED_QUERIES = {};

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
  return task (apiUser, req, res);
});


// function createRandomPassword(round = 5) {
//   const upper = 'ABCDEFGHJKLMNPRSTUVWXYZ';
//   const lower = upper.toLocaleLowerCase();
//   const nums = '123456789123456789';
//   let array = (upper + lower + nums).split('');
//   array.sort(() => Math.random() - 0.5);
//   const password = array.join('').substr(0, 7);
//   const xfpwd = password.split('').reverse().join('');
//   const saltRounds = round;
//   const bcrypt = require('bcryptjs');
//   const hashed_password = bcrypt.hashSync(password, saltRounds);
//   return { password, hashed_password, xfpwd };
// }



ACCEPTED_QUERIES['disable-user'] = async(apiUser, req, res) => {
  console.log("disable-user")
  try {
    const id = req.body.id;
    const { db } = await connect();
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id },
      { $set: { disabled: true }}
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


ACCEPTED_QUERIES['activate-user'] = async(apiUser, req, res) => {
  console.log("activate-user")
  try {
    const id = req.body.id;
    const { db } = await connect();
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id },
      { $set: { disabled: false }}
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


/**
 * Delete user: set deleted property to true
 * @param {*} apiUser
 * @param {*} req
 * @param {*} res
 * @returns
 */
ACCEPTED_QUERIES['delete-user'] = async(apiUser, req, res) => {
  console.log("delete-user")
  try {
    const id = req.body.id;
    const { db } = await connect();
    const rs = await db.collection(DB.Users).findOneAndUpdate(
      { _id: id },
      { $set: { disabled: true, deleted: true }}
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


ACCEPTED_QUERIES['reset-user'] = async(apiUser, req, res) => {
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
        hashed_password: hashed_password
      }}
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

//
ACCEPTED_QUERIES['change-password'] = async(apiUser, req, res) => {
  console.log("change-password")
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
        },
        $currentDate: { lastModified: true }
      },
    )

    console.log('RS', rs);

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

// new-user
ACCEPTED_QUERIES['new-user'] = async(apiUser, req, res) => {
  console.log("new-user")
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


const TestUpdateSession = async(apiUser, req, res) => {
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