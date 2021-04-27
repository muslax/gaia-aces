/**
 * Project listing: id, title, client, admin
 */

 import Link from "next/link";
 import Heading from "./Heading";

 export default function Billing({ user }) {
   return <>
     <Heading title="Billing Info" />
     <pre>
       {/* {JSON.stringify(user, null, 2)} */}
     </pre>
   </>;
 }