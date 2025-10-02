import { Google } from "arctic";
import { port } from "../app.js";

const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `http://localhost:${process.env.PORT || port}/google/callback`
);

export { google };
