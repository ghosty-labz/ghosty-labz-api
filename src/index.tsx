import { Hono } from "hono";
import { cors } from "hono/cors";
import { validator } from "hono/validator";
import { z } from "zod";
import type { SendEmailCommandInput } from "@aws-sdk/client-sesv2";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { render } from "@react-email/components";
import GhostyContactEmail from "./email";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type Bindings = {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/contacts", cors());

app.get("/", (c) => {
  return c.text("Hello from Ghosty Labz 🧪");
});

app.post(
  "/contacts",
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { email } = c.req.valid("json");
    const client = new SESv2Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: c.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
    const emailHtml = await render(<GhostyContactEmail />);
    const params: SendEmailCommandInput = {
      FromEmailAddress: "Ghosty Labz <updates@ghostylabz.com>",
      Destination: {
        ToAddresses: [email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "Hey 👋",
          },
          Body: {
            Html: {
              Data: emailHtml,
              Charset: "UTF-8",
            },
          },
        },
      },
    };
    const command = new SendEmailCommand(params);
    const response = await client.send(command);
    return c.json(
      {
        message: "Created!",
      },
      201
    );
  }
);

export default app;
