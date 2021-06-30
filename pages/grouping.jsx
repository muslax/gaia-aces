import { useEffect, useState } from "react";

export default function Grouping() {
  const [number, setNumber] = useState(24)
  const [persons, setPersons] = useState([]);
  const [grouping, setGrouping] = useState([]);
  const [groups, setGroups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [divider, setDivider] = useState(0);
  const [maxMembers, setMaxMembers] = useState(0)

  useEffect(() => {
    const _persons = getSamplePersons(number);
    const _groups = createGroups(_persons);
    const _grouping = createGrouping(number);

    let max = 0;
    _grouping.forEach(m => {
      if (m > max) max = m;
    })
    setMaxMembers(max);

    setPersons(_persons);
    setGroups(_groups);
    setGrouping(createGrouping(number));
    setSchedules(createSchedules(_groups));

    const div = Math.ceil(_grouping.length / 4);
    setDivider(div);
    return () => {};

  }, [number])

  function submitHandler(e) {
    e.preventDefault();

  }

  return <>
    <div className="max-w-4xl mx-auto p-6 mb-32">
      <p className="text-xs font-medium mb-2">
        <a target="_blank"
          href="https://res.cloudinary.com/ptkj/image/upload/v1625086303/S_2021-06-23_at_22.23.30_leezon.png"
          className="text-blue-500"
        >Tabel Sriyanto</a>
      </p>
      <h1 className="text-3xl">Grouping of {persons.length} persons</h1>
      <form onSubmit={submitHandler} className="my-4">
        <input type="number" min="8" max="120" value={number} className="text-xls font-bold"
          onChange={e => {
            let val = parseInt(e.target.value);
            if (isNaN(val)) val = 21;
            setNumber(val);
          }}
        />
        {/* <span className="text-xl ml-4">{number}</span> */}
      </form>
      {/* <div className="text-xs my-6">
        {persons.map((p, i) => <span className="">{i == 0 ? '' : ' - '} {p}</span>)}
      </div> */}

      <p className="text-xs font-medium mb-2">Jumlah Grup: {groups.length} ({grouping.join(" - ")})</p>
      <p className="text-xs font-medium mb-2">Tim ASD: {divider}  &bull;  Tim ASW: {divider} ({divider * maxMembers} orang)</p>

      <h3 className="font-bold mt-8 mb-2">Jadwal per grup (dan tim asesor)</h3>
      <table className="text-xs mb-6">
        <tbody>
          <tr className="border-t border-b border-gray-300">
            <td className="font-medium p-2">Group</td>
            <td className="font-medium p-2">08.00</td>
            <td className="font-medium p-2">10.00</td>
            <td className="font-medium p-2">13.00</td>
            <td className="font-medium p-2">15.00</td>
          </tr>
          {schedules.map((g, i) => (
            <tr className="border-b border-gray-300">
              <td className="w-32 font-medium px-2 py-2">{g.groupName} &nbsp;&nbsp; ({groups[i].members.length})</td>
              <td className="w-36 px-2 py-2">{getAsesor(g, 'slot1')}</td>
              <td className="w-36 px-2 py-2">{getAsesor(g, 'slot2')}</td>
              <td className="w-36 px-2 py-2">{getAsesor(g, 'slot3')}</td>
              <td className="w-36 px-2 py-2">{getAsesor(g, 'slot4')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-bold mt-8 mb-4">Rincian anggota grup</h3>
      <div className="flex flex-wrap text-xs my-4">
        {groups.map(({groupName, members}, index) => (
          <div key={`GROUP-${index}`} className="w-40 pr-3 mb-6">
            <p className="font-bold mb-1">{groupName} ({members.length})</p>
            {members.map((nom, index) => <p key={`M-${index}`} className="border-t py-1 truncate">{nom}</p>)}
          </div>
        ))}
      </div>

      <pre>SCHEDULES: {JSON.stringify(schedules[0], null, 2)}</pre>
      <pre>Group 01: {JSON.stringify(groups[0], null, 2)}</pre>

      <h3 className="font-bold mt-8 mb-4">Beberapa catatan</h3>
      <ul className="list-decimal pl-4 ml-2">
        <li>User perlu menginput tanggal batch</li>
        <li>User dapat mengubah anggota grup, tapi tidak mengubah jumlah anggota grup</li>
        <li>Bagaimana cara mengubah kompisisi anggota grup? Belum tahu</li>
        <li>Test online dapat dicustom: scheduled / fullday / multidays</li>
        <li>Belum bisa membuat scheduling diskusi/wawancara multidays</li>
        <li>Mungkin perlu redifinisi: batch hanya mengakomodasi scheduling 1 hari</li>
        <li>Fiksasi grouping dan scheduling bersifat taxing... sebaiknya sebagai one last action</li>
        <li>Perlu masukan tentang urutan aksi supaya user-friendly</li>
      </ul>

    </div>
  </>;
}

function getAsesor(group, slotName) {
  if (group[slotName] == 'diskusi') return <span className="text-indigo-500">Diskusi<br/>{group.asd}</span>;
  if (group[slotName] == 'wawancara') return <span className="text-red-600">Wawancara<br/>{group.asw}</span>;
  return <span className="text-green-600">Online</span>;
}

function createSchedules(groups) {
  const div = Math.ceil(groups.length / 4);
  const schedules = groups.map(({ groupName }) => {
    return { groupName: groupName, slot1: null, slot2: null, slot3: null, slot4: null,
    }
  })

  const divSlots = [];
  /* Always create 4 slot combinations */
  for (let i = 0; i < div; i++) divSlots.push({asd: `Tim ASD 0${i + 1}`, asw: `Tim ASW 0${i + 1}`, slot1: 'diskusi', slot2: 'wawancara', slot3: 'online', slot4: 'online'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `Tim ASD 0${i + 1}`, asw: `Tim ASW 0${i + 1}`, slot1: 'wawancara', slot2: 'diskusi', slot3: 'online', slot4: 'online'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `Tim ASD 0${i + 1}`, asw: `Tim ASW 0${i + 1}`, slot1: 'online', slot2: 'online', slot3: 'diskusi', slot4: 'wawancara'});
  for (let i = 0; i < div; i++) divSlots.push({asd: `Tim ASD 0${i + 1}`, asw: `Tim ASW 0${i + 1}`, slot1: 'online', slot2: 'online', slot3: 'wawancara', slot4: 'diskusi'});

  for (let i = 0; i < schedules.length; i++) {
    // let j = i < divSlots.length ? i : i % divSlots.length;
    const slot = divSlots[i];
    schedules[i].slot1 = slot.slot1;
    schedules[i].slot2 = slot.slot2;
    schedules[i].slot3 = slot.slot3;
    schedules[i].slot4 = slot.slot4;
    schedules[i].asd = slot.asd;
    schedules[i].asw = slot.asw;
  }

  return schedules;
}

function createGroups(persons) {
  let start = 0;
  let array = [];
  const grouping = createGrouping(persons.length)

  for (let i = 0; i < grouping.length; i++) {
    const idx = i + 1;
    const sfx = idx < 10 ? '0' + idx : idx;
    const groupName = `GROUP ${sfx}`;
    if (i == grouping.length - 1) {
      array.push({
        groupName: groupName,
        members: persons.slice(start)
      });
    } else {
      array.push({
        groupName: groupName,
        members: persons.slice(start, start + grouping[i])
      });
    }

    start = start + grouping[i];
  }

  return array;
}

function createGrouping(pop, less = false) {
  const flag = less ? 5 : 6;
  const alt = flag === 6 ? 5 : 6;
  if (pop === undefined || pop === 0) return [];
  else if (pop < 8) return [pop];
  else if (pop === 8) return [4, 4];
  else if (pop === 9) return [5, 4];
  else if (pop === 13) return [5, 4, 4];
  else if (pop === 14) return [5, 5, 4];
  else if (pop === 19) return [5, 5, 5, 4];
  else if (flag === 6) {
    const a = Math.ceil(pop / flag);
    const b = (a * flag) - pop;
    const c = (a - b) * flag;
    const d = (flag - 1) * b;
    const e = d / alt;
    const arr = Array(a).fill(flag);
    if (b > 0) {
      arr.fill(alt, (a - b))
    }
    return arr
  } else {
    const a = Math.floor(pop / flag);
    const b = pop % flag;
    const c = a - b;
    const arr = Array(a).fill(flag);
    if (b > 0) {
      arr.fill(alt, (a - b))
    }
    return arr;
  }
}

const getSamplePersons = (n) => {
  if (!n || n === undefined || n < 8) n = 8;
  if (n > 120) n = 120;
  const array = fakePersons;
  // shuffleArray(array);
  return array.slice(0, n)
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}


const fakePersons = [
  "Sambang Upadi Lulut",
  "Rama Bardiono",
  "Jonne Laksmi",
  "Danumaya Bawita",
  "Simon Tawang Yasan",
  "Sapar Sudira",
  "Bagas Damien Karni",
  "Renske Gemana Marek",
  "Bahuraksa Sadran",
  "Anggabaya Lorenzo",
  "Jaxson Thijs Amy",
  "Bardiman Samita",
  "Among Nari Ezra",
  "Teguh Kees Bernd",
  "Nolan Cepaka Purwaka",
  "Sudarpa Wawan",
  "Melissa Manah Wardaya",
  "Jameson Asiri Bianca",
  "Mujur Dave",
  "Panembrama Asirwada",
  "Amber Bahuwarna",
  "Wani Adikara Wasista",
  "Ian Mitra Ciptana",
  "Eman Adiharja Putri",
  "Jordan Asih",
  "Eluh Wibisono Arisanti",
  "Bataria Dariati Daliani",
  "Elok Jennifer",
  "Atmawati Waspa",
  "Gilang Giyarto",
  "Asirwanda Philip Huub",
  "Cagak Candrarupa",
  "Mari Bandriya Nienke",
  "Jess Wibowo",
  "Gede Candrika",
  "Maria Samapta Teja",
  "Warih Jariati",
  "Jasmijn Dwi",
  "Daliman Rangkung Purwa",
  "Dian Kenes Julie",
  "Atresia Ujud Maras",
  "Melvin Liam Suganda",
  "Ikawati Darsa Banawi",
  "Silke Bas Waskita",
  "Marta Luna",
  "Suzanne Emong Puspita",
  "Samuel Jonathan Wasis",
  "Gijs Merel",
  "Hartati Kasusra",
  "Aslijan Vera Suciatma",
  "Harjanti Estiningtyas Valerie",
  "Sunyata Joelle",
  "Evan Purnama",
  "Céline Bouke Sasangka",
  "James Hudson Darapuspita",
  "Endra Estiono Jessica",
  "Dalirin Sambada Bima",
  "Bratajaya Aiden",
  "Turmukti Maryadi",
  "Teges Wijaya Gayuh",
  "Salipah Gandewa Sudibya",
  "Tuladha Luwes Brian",
  "Santiago Maryanti Warangka",
  "Bambang Bestari",
  "Floor Tessa Utami",
  "Jagaraga Iswara",
  "Kedasih Lukita",
  "Danielle Ethan",
  "Jouri Titi Widayat",
  "Reja Reksa Asmuni",
  "Corné Werdaya",
  "Jan Tiyasa Kirsten",
  "Drajat Wadi Kasmirah",
  "Tirta Yuda",
  "Sudarga Batara Waluyo",
  "Margana Asipattra Martine",
  "Banu Alex Mirah",
  "Isabel Rupaka",
  "Dianti Stan Cakra",
  "Langgeng Elise Jaya",
  "Tresna Bagus",
  "Mahesa Unggul Jaeman",
  "Tarasari Candrawimba",
  "Branta Candra",
  "Fleur Roel",
  "Monica Djonno Cawisono",
  "Rahayu Kenari",
  "Untap Demi Jori",
  "Jamie Luwar",
  "Kusuma Yuwa Sebastian",
  "Atmariani Atmajaya",
  "Saban Bancar Hannah",
  "Sasmaka Bakidin",
  "Jaxon Bratadikara",
  "Jarno Aswani Respati",
  "Jindra Leo Karta",
  "Daniswara Aris Wastiqah",
  "Robin Yudayana",
  "Purwadi Hartana",
  "Gamani Sudarsana",
  "Floris Balijan Bryson",
  "Manah Asher",
  "Gara Candrakanti",
  "Jumadi Rick",
  "Titis Adiwidya",
  "Sadarpa Dartono Suciatma",
  "Yayi Sudarma",
  "Sasangka Balamantri Eline",
  "Darimin Romy",
  "Misha Bhaskoro Bondan",
  "Anggabaya Lanang Eluh",
  "Sambang Wijaya",
  "Isa Pramusita Yudayana",
  "Oliver Asirwada",
  "Colton Levi",
  "Elias Aditya",
  "Balapati Tom",
  "Asmiani Valerie Respati",
  "Marlon Tess",
  "Ralph Harimurti Caraka",
  "Wasista Harjanti",
  "Daliman Fynn Aristawati",
  "Bandriya Jayeng Sudarpa",
  "Estiningtyas Wasita Max",
  "Maverick Jayadi Merel",
  "Ranggah Sudana Wijaksana",
  "Heru Ade Jariani",
  "Elon Charlotte Jenske",
  "Eman Lulut Candrawimba",
  "Wirya Aiden",
  "Ajeng Wastiqah",
  "Candrika Guritno",
  "Ethan Mariadi Hannah",
  "Mujur Manon",
  "Darsirah Tirta",
  "Jennifer Ikawati",
  "Aswani Tanaya",
  "Bhagaskara Wulan",
  "Jindra Nindya",
  "Admaja Dianti Panembrama",
  "Purwastuti Lotte",
  "Tani Jeremiah",
];
