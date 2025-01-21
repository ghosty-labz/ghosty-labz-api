import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

export const GhostyContactEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Ghosty Labz Contact</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#a3e635",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          <Img
            src={`https://bg-removal-french-test.s3.us-east-1.amazonaws.com/ghosty-labz-logo.png`}
            width="184"
            height="150"
            alt="Ghosty"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              Thank you for contacting us!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  We’ve received your message and will get back to you as soon
                  as possible. In the meantime, feel free to check out our blog
                  for the latest updates and insights.
                </Text>
              </Row>
            </Section>

            <Section className="mt-45">
              <Row>
                <Column>
                  <Link
                    className="text-black underline font-bold"
                    href="https://ghostylabz.com/blog/"
                  >
                    Check out the blog
                  </Link>{" "}
                  <span className="text-green-500">→</span>
                </Column>
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Text className="text-center text-gray-400 mb-45">Ghosty Labz</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default GhostyContactEmail;
