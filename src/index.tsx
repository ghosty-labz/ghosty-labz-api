import { Hono } from "hono";
import { cors } from "hono/cors";
import { validator } from "hono/validator";
import { z } from "zod";
import { Resend } from "resend";
import GhostyContactEmail from "./email";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type Bindings = {
  RESEND_API_KEY: string;
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
    const resend = new Resend(c.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Ghosty Labz <labz@updates.garyvarner.me>",
      to: email,
      subject: "New Lead",
      react: <GhostyContactEmail />,
    });
    return c.json(
      {
        message: "Created!",
      },
      201
    );
  }
);

export default app;
