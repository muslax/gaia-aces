import { DB } from "config/db";
import { connect } from "lib/database";


export default async function testTimerAPI(req, res) {
  const { db } = await connect();
  const rs = await db.collection(DB.Batches).findOne({ _id: '6081b509f477883e2c26b2f8' });

  const dtOpen = rs.dateOpen;
  console.log(dtOpen, dtOpen.getTime())

  const now = new Date();
  console.log(now, now.getTime(),  now.toString());

  const delta = now.getTime() - dtOpen.getTime();
  console.log('Delta', delta, (delta / 60000));

  if (now.getTime() < dtOpen.getTime()) console.log('BELUM BUKA');
  else console.log('SUDAH BUKA');

  return res.json(rs);
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function helloAPI(req, res) {
//   const men = {
//     name: 'asda'
//   }
//   res.status(200).json({ name: 'John Doe' })
// }
