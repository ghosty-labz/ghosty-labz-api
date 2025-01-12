import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type Bindings = {
  RESEND_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

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
    const { name } = c.req.valid("json");
    console.log(name);
    const resend = new Resend(c.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "hello world",
      html: "<strong>It works!</strong>",
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
