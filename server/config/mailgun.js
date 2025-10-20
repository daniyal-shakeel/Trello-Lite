import formData from "form-data";
import Mailgun from "mailgun.js";
import { mailgun } from "../utils/default-values/mailgun.js";

const mailgunInstance = new Mailgun(formData);

const mg = mailgunInstance.client({
  username: mailgun.username,
  key: mailgun.key,
  url: mailgun.url,
});

export default mg;
