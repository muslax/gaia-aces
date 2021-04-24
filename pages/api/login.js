import { DB } from "config/db";
import { connect } from "lib/database";
import withSession from "lib/session";
import bcrypt from 'bcryptjs';

export default withSession(async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const { db } = await connect();
    const cursor = await db.collection(DB.Users).aggregate([
      { $match: { username: username, deleted: false, disabled: false }},
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
      console.log('NOT FOUND');
      return res.status(404).json({ message: "[NOPE] Username/password salah." });
    }

    const verified = bcrypt.compareSync(password, rs.hashed_password);
    if (!verified) {
      return res.status(404).json({ message: "[FAILED] Username/password salah." });
    }

    const user = {
      isLoggedIn: true,
      _id: rs._id,
      licenseId: rs.licenseId,
      username: rs.username,
      fullname: rs.fullname,
      email: rs.email,
      licenseOwner: rs.licenseOwner,
      licenseType: rs.license.type,
      licenseName: rs.license.licenseName,
      licenseExpiryDate: rs.license.expiryDate,
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