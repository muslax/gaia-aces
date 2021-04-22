import { DB } from "config/db";
import { connect } from "lib/database";
import withSession from "lib/session";
import bcrypt from 'bcryptjs';

export default withSession(async (req, res) => {
  try {
    const { username, password } = req.body;
    const { db } = await connect();
    const cursor = await db.collection(DB.Users).aggregate([
      { $match: { username: username}},
      { $lookup: {
        from: DB.Licenses,
        localField: 'licenseId',
        foreignField: '_id',
        as: 'license',
      }},
      { $unwind: '$license'},
    ]);

    const rs = await cursor.next();
    if (!rs) {
      return res.status(404).json({ message: "[NOPE] Username/password salah." });
    }

    if (!bcrypt.compareSync(password, rs.hashed_password)) {
      return res.json({ message: "[ERROR] Username/password salah." });
    }

    const user = {
      isLoggedIn: true,
      _id: rs._id,
      username: rs.username,
      fullname: rs.fullname,
      email: rs.email,
      licenseOwner: rs.licenseOwner,
      licenseName: rs.license.licenseName,
      licenseLogoUrl: rs.license.logoUrl,
    }

    req.session.set("user", user);
    await req.session.save();
    return res.json(user);
  } catch (error) {
    res.status(404);
    res.json({ message: "[3] Username/password salah." });
  }
});