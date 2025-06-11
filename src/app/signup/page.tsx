import { redirect } from "next/navigation";
import { SignupForm } from "@/app/signup/components";
import getDb from "@/lib/db";

export default async function Page() {
  // This is needed for the build to succeed, as this is the only ungated
  // database access that _would_ happen at build time.
  try {
    const db = await getDb();

    let rows = null;

    rows = await db`
    SELECT * FROM users
  `;

    if (rows?.length > 0) {
      redirect("/login");
    }

    return (
      <div>
        <SignupForm />
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Database not reachable.</h1>
      </div>
    );
  }
}
