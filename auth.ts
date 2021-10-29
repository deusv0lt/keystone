import { createAuth } from "@keystone-next/auth";
import { statelessSessions } from "@keystone-next/keystone/session";
let sessionSecret = process.env.SESSION_SECRET;

// Here is a best practice! It's fine to not have provided a session secret in dev,
// however it should always be there in production.
if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The SESSION_SECRET environment variable must be set in production"
    );
  } else {
    sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
  }
}

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  sessionData: "name",
  secretField: "password",

  initFirstItem: {
    fields: ["name", "email", "password", "isAdmin"],
    itemData: { isAdmin: true },
  },
});
sessionData: "name isAdmin";
// This defines how long people will remain logged in for.
// This will get refreshed when they log back in.
let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

// This defines how sessions should work. For more details, check out: https://keystonejs.com/docs/apis/session#session-api
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});

export { withAuth, session };
