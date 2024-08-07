import {
    Body,
    Container,
    Heading,
    Html,
    Img,
    Section,
    Text
} from "@react-email/components";

import { TOKEN_EXPIRY_TIME_IN_MIN } from "@/constants";

interface VerifyEmailTemplateProps {
    token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

const VerifyEmailTemplate = ({
    token
}: VerifyEmailTemplateProps) => (
    <Html>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src={`${baseUrl}/logo-icon.png`}
                    width="88"
                    height="88"
                    alt="Unmask Logo"
                    style={logo}
                />
                <Text style={tertiary}>Verify Your Email</Text>
                <Heading style={secondary}>
                    Enter the following code to move to the final step of your account creation.
                </Heading>
                <Text style={{ ...paragraph, marginTop: "10px" }}>
                    This code will expire in {TOKEN_EXPIRY_TIME_IN_MIN} minutes.
                </Text>
                <Section style={codeContainer}>
                    <Text style={code}>{token}</Text>
                </Section>
                <Text style={paragraph}>Not expecting this email?</Text>
                <Text style={paragraph}>
                    If you didn&apos;t request this email, there&apos;s nothing to worry about, you can safely ignore it.
                </Text>
                <Text style={footer}>
                    © {(new Date()).getFullYear()} | Unmask, Inc. Privacy and Terms
                </Text>
            </Container>
        </Body>
    </Html>
);

export default VerifyEmailTemplate;

const main = {
    backgroundColor: "#ffffff",
    fontFamily: "HelveticaNeue, Helvetica, Arial, sans-serif"
};

const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #eee",
    borderRadius: "5px",
    boxShadow: "0 5px 10px rgba(20,50,70,.2)",
    marginTop: "20px",
    maxWidth: "420px",
    margin: "0 auto",
    padding: "50px 20px 40px"
};

const logo = {
    margin: "0 auto"
};

const tertiary = {
    color: "#0a85ea",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: "HelveticaNeue, Helvetica, Arial, sans-serif",
    height: "16px",
    letterSpacing: "0",
    lineHeight: "16px",
    margin: "16px 8px 8px 8px",
    textTransform: "uppercase" as const,
    textAlign: "center" as const
};

const secondary = {
    color: "#000",
    display: "inline-block",
    fontFamily: "HelveticaNeue-Medium, Helvetica, Arial, sans-serif",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "24px",
    marginBottom: "0",
    marginTop: "0",
    textAlign: "center" as const
};

const codeContainer = {
    background: "rgba(0,0,0,.05)",
    borderRadius: "4px",
    margin: "16px auto 14px",
    verticalAlign: "middle",
    width: "280px"
};

const code = {
    color: "#000",
    display: "inline-block",
    fontFamily: "HelveticaNeue-Bold",
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "6px",
    lineHeight: "40px",
    paddingBottom: "8px",
    paddingTop: "8px",
    margin: "0 auto",
    width: "100%",
    textAlign: "center" as const
};

const paragraph = {
    color: "#444",
    fontSize: "15px",
    fontFamily: "HelveticaNeue, Helvetica, Arial, sans-serif",
    letterSpacing: "0",
    lineHeight: "23px",
    padding: "0 20px",
    margin: "0",
    textAlign: "center" as const
};

const footer = {
    textAlign: "center" as const,
    fontSize: 12,
    color: "rgb(0,0,0, 0.7)"
};