import { getLastVisitedBatchId } from "lib/storage";
import useTestAccess from "hooks/useTestAccess";
import Link from "next/link"
import { useEffect, useState } from "react";

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

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}


export const Schedules = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const { credentials, isError, isLoading, mutate } = useTestAccess(batchId);

  const structure = createGrouping(credentials.length, false)
  const [groups, setGroups] = useState([])
  const g1 = credentials.slice(0,6);
  const g2 = credentials.slice(6,12);
  const g3 = credentials.slice(12,18);
  const g4 = credentials.slice(18,24);
  const g5 = credentials.slice(24);

  useEffect(() => {
    let start = 0;
    let array = [];
    for (let i = 0; i < structure.length; i++) {
      let group = [];
      if (i == structure.length - 1) {
        array.push( credentials.slice(start) );
      } else {
        // console.log('START ', start, start + structure[i]);
        array.push( credentials.slice(start, start + structure[i]) );
      }

      // array.push(group)
      start = start + structure[i];
    }
    setGroups(array);

    return () => {};
  }, [])



  const numbers = [6, 7, 8, 9, 11, 13, 14, 15, 19, 20, 21, 29, 30, 33, 45, 46, 47, 60, 65, 68, 87, 88, 99];
  // const numbers = range(9, 69);
  // const strategy5 = createGrouping(numbers, true);
  // const strategy6 = createGrouping(numbers);


  return <>
    <div className="mb-6">
      <div className="flex items-center text-sm">
        <Link href={`/projects/${project._id}/deployment`}>
          <a className="flex items-center bg-gray-100 hover:bg-gray-200 h-8 rounded-l px-4">
            Web Access
          </a>
        </Link>
        <div className="flex items-center h-8 bg-gray-500 text-white rounded-r px-3 cursor-default">
          Schedules
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <pre>
          {numbers.map(n => <span key={n}>
            {n} ({createGrouping(n, 0).length}) = {JSON.stringify(createGrouping(n, 0), null, 0)} {createGrouping(n, 0).reduce((a,b) => a + b, 0)}
          <br/>
          </span>)}
        </pre>
        <pre>
          {numbers.map(n => <span key={n}>
            {n} ({createGrouping(n, true).length}) = {JSON.stringify(createGrouping(n, true), null, 0)} {createGrouping(n, true).reduce((a,b) => a + b, 0)}
          <br/>
          </span>)}
        </pre>
      </div>
      <pre>{JSON.stringify(structure, null, 0)}</pre>

      <div className="text-xs pr-2 mb-4">
        {credentials.map(({ fullname }, index) => <p key={fullname}>{index + 1} {fullname}</p>)}
      </div>

      <div className="flex flex-wrap text-xs mb-4">
        {groups.map((group, index) => (
          <div key={`GROUP-${index}`} className="w-44 pr-3 mb-6">
            {group.length}
            {group.map(({ fullname }) => <p className="border-t py-1" key={fullname}>{fullname}</p>)}
          </div>
        ))}
      </div>

      {/* <div className="flex text-sm">
        <div className="pr-2">
          {g1.map(({ fullname }) => <p key={fullname}>{fullname}</p>)}
        </div>
        <div className="pr-2">
          {g2.map(({ fullname }) => <p key={fullname}>{fullname}</p>)}
        </div>
        <div className="pr-2">
          {g3.map(({ fullname }) => <p key={fullname}>{fullname}</p>)}
        </div>
        <div className="pr-2">
          {g4.map(({ fullname }) => <p key={fullname}>{fullname}</p>)}
        </div>
        <div className="pr-2">
          {g5.map(({ fullname }) => <p key={fullname}>{fullname}</p>)}
        </div>
      </div> */}

      {/* <pre>{JSON.stringify(groups, null, 2)}</pre> */}

    </div>
  </>
}