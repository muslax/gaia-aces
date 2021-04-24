import { DB, DBNAME } from 'config/db';
import { ROUTES, API_ROUTES } from 'config/routes';
import { connect } from 'lib/database';
import { MongoClient, ObjectID } from 'mongodb'

const uri = process.env.NODE_ENV == 'development' ? process.env.MONGO_LOCAL : process.env.MONGO_AWSGM2

const sampleLicenses = [
  {
    _id: '6081a9e4e10336304bad3227',
    type: 'corporate',
    licenseName: 'PT Sampel Usaha Mandiri',
    contactFullname: 'Lidi Astuti',
    contactUsername: 'lidias',
    contactEmail: 'lidias@email.net',
    logoUrl: '',
    publishedBy: 'system',
    publishDate: new Date(),
    expiryDate: null,
    refreshDate: null,
    disabled: false,
    createdAt: new Date(),
  }
]

const user = {
  _id: ObjectID().toString(), //'6081addde10336304bad3228',
  licenseId: '6081a9e4e10336304bad3227',
  fullname: 'Lidi Astuti',
  username: 'lidias',
  email: 'lidias@email.net',
  licenseOwner: true,
  verified: false,
  disabled: false,
  deleted: false,
  gender: null,
  phone: null,
  roles: [],
  xfpwd: null,
  hashed_password: '$2a$10$yp9XsQNKAWQtWnNRjSY3BO9M58fa/iqPdtTlxT7SkI7M10s5EBGD2',
  createdBy: null,
  createdAt: new Date(),
}

const client = {
  _id: ObjectID().toString(),
  licenseId: '6081a9e4e10336304bad3227',
  name: 'PT Sample Organization',
  address: 'Random Address',
  city: 'Balikpapan',
  phone: '565367788585',
  contacts: [],
  createdBy: 'system',
  createdAt: new Date(),
}

const batch1 = {
  _id: '602ae049505729282238a4ec',
  projectId: '602398bf98769600088c4c87',
  batchName: 'Default Batch',
  modules:
   [ { metaId: '6026c27f985b1417b005d36b',
       domain: 'Preference',
       method: 'selftest',
       order: 11,
       moduleName: 'GPQ',
       description: 'Alat ukur yang mengungkap kecenderungan seseorang dalam bersikap dan bertindak, yang dibagi dalam 4 domain yaitu kecenderungan dalam hal pola pikir; pola pengelolaan tugas; pola pengelolaan sosial dan efektifitas pengelolaan pribadi',
       remark: 'GPQ bisa dipakai dalam seluruh level' },
     { metaId: '6026c27f985b1417b005d371',
       domain: 'Cognitive',
       method: 'selftest',
       order: 24,
       moduleName: 'G-GATe-A',
       description: 'Alat ungkap potensi kognitif dalam hal penalaran Abstraksi',
       remark: 'G-GATe-A cocok dipakai untuk entry level' },
     { metaId: '6026c27f985b1417b005d374',
       domain: 'Simulasi Kelompok',
       method: 'guided',
       order: 41,
       moduleName: 'Group Discussion',
       description: 'Simulasi ini untuk mengungkap ketrampilan sosial seseorang dalam proses interaksi dengan kelompok',
       remark: 'Simulasi ini cocok untuk level staf sampai manajemen puncak' },
     { metaId: '6026c27f985b1417b005d373',
       domain: 'Simulasi Individu',
       method: 'selftest',
       order: 32,
       moduleName: 'Case Analysis',
       description: 'Simulasi untuk mengungkap kemampuan dalam critical thinking',
       remark: 'Simulasi ini cocok untuk level staf sampai Manajemen Menengah' } ],
  createdBy: 'system',
  createdAt: new Date(),
}

const person = {
  _id: ObjectID().toString(),
  licenseId: '6081a9e4e10336304bad3227',
  projectId: '6081b155f477883e2c26b2ee',
  batchId: '6081b509f477883e2c26b2f8',
  disabled: false,
  username: 'junttu',
  email: 'junttu@ko.com',
  fullname: 'Jumar Unttu',
  gender: 'Laki-laki',
  birth: '1993-02-10',
  phone: '989',
  nip: '',
  position: '',
  currentLevel: '',
  targetLevel: '',
  // group: '60335170cebf42105bbbad88',
  simGroup: '',
  tests:
   [ '6026c27f985b1417b005d36e',
     '6026c27f985b1417b005d372',
     '6026c27f985b1417b005d371',
     '6026c27f985b1417b005d36c' ],
  sims: [ '6026c27f985b1417b005d374', '6026c27f985b1417b005d375' ],
  currentTest: null,
  currentSim: null,
  testsPerformed: [],
  simsPerformed: [],
  xfpwd: 'c2f2nuj',
  hashed_password: '$2a$04$NaElxAgXKpqE56jDCIv2c.nDHhQ6hZUnGZZsNxINpqHn62upLhP..',
  createdBy: 'system',
  createdAt: new Date(),
  // updatedAt: null,
  // lastModified: 2021-02-23T20:30:12.974Z,
}

const person2 = {
  "_id": ObjectID().toString(), //"6081b902f477883e2c26b2fd",
  "licenseId": "6081a9e4e10336304bad3227",
  "projectId": "6081b155f477883e2c26b2ee",
  "batchId": "6081b509f477883e2c26b2f8",
  "disabled": false,
  "username": "junttu",
  "email": "jumir@ko.com",
  "fullname": "Jumarin Untu",
  "gender": "Laki-laki",
  "birth": "1993-02-10",
  "phone": "989",
  "nip": "",
  "position": "",
  "currentLevel": "",
  "targetLevel": "",
  "simGroup": "",
  "tests": [
    "6026c27f985b1417b005d36e",
    "6026c27f985b1417b005d372",
    "6026c27f985b1417b005d371",
    "6026c27f985b1417b005d36c"
  ],
  "sims": [
    "6026c27f985b1417b005d374",
    "6026c27f985b1417b005d375"
  ],
  "currentTest": null,
  "currentSim": null,
  "testsPerformed": [],
  "simsPerformed": [],
  "xfpwd": "c2f2nuj",
  "hashed_password": "$2a$04$NaElxAgXKpqE56jDCIv2c.nDHhQ6hZUnGZZsNxINpqHn62upLhP..",
  "createdBy": "system",
  "createdAt": new Date()
}

const batch2 = {
  _id: "6081b509f477883e2c26b2f8",
  projectId: '6081b155f477883e2c26b2ee',
  batchName: 'Default Batch',
  accessCode: 'abc6xyz',
  modules: [
    "6026c27f985b1417b005d36e",
    "6026c27f985b1417b005d372",
    "6026c27f985b1417b005d371",
    "6026c27f985b1417b005d36c",
    "6026c27f985b1417b005d374",
    "6026c27f985b1417b005d375"
  ],
  dateOpen: new Date(),
  dateClosed: new Date(),
  disabled: false,
  createdBy: 'system',
  createdAt: new Date(),
}

const guest = {
  _id: ObjectID().toString(), //'60317cde7d907f0008d2328f',
  projectId: '6081b155f477883e2c26b2ee',
  "batchId": "6081b509f477883e2c26b2f8",
  type: 'client',
  license: 'lidka',
  fullname: 'Jaman Sepi',
  email: 'jaman@sepi.com',
  phone: '888',
  hashed_password: '$2a$04$Ux7WRT.ZbwCyJmBvK2ygL.ye9nZ1klTqo0Be/4Rmecd9SRvWOQG2C',
  verified: false,
  disabled: false,
  createdBy: 'system',
  createdAt: new Date(),
  // updatedAt: null,
  // lastModified: 2021-03-03T00:02:18.260Z
}

const project = {
  _id: ObjectID().toString(), //"6081b155f477883e2c26b2ee",
  licenseId: '6081a9e4e10336304bad3227',
  clientId: '6081b107f477883e2c26b2eb',
  status: null,
  batchMode: 'multi',
  title: 'Sample Project Title 2',
  fullTitle: 'Another Sample Project Full Title',
  description: 'Brief description of this project.',
  startDate: "2021-04-23",
  endDate: "2021-07-10",
  admin: 'lidias',
  contacts: [],
  // accessCode: null,
  // closingDate: 2021-03-29T16:00:00.000Z,
  createdBy: 'system',
  createdAt: new Date(),
  // updatedAt: "2021-02-24",
  // openingDate: 2021-03-20T18:00:00.000Z,
  // lastModified: 2021-03-03T23:55:38.471Z
}

//
// licenses
// users
// clients
// projects
// batches
// guests
// personae
// sechedules

const dumpAllDocs = async (req, res) => {
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
      modules_meta,
      licenses,
      users,
      clients,
      projects,
      batches,
      guests,
      personae,
      sechedules,
    })

  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export default async (req, res) => {
  // return res.json({ user });
  return dumpAllDocs(req, res);
}

// projectId
// licenseId
// clientId
// personId
// batchId
