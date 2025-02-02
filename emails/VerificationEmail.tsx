import * as React from "react";
import { Html, Head, Body, Container, Heading, Text, Section } from "@react-email/components";

interface VerifyEmailProps {
    username: string;
    otp: string;
}

export const VerificationEmail = ({ username, otp }: VerifyEmailProps) => {
    return (
        <Html>
            <Head />
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Heading style={styles.heading}>Verify Your Email</Heading>

                    <Text style={styles.text}>Hello <strong>{username}</strong>,</Text>

                    <Text style={styles.text}>Use the OTP below to verify your email:</Text>

                    <Section style={styles.otpBox}>
                        <Text style={styles.otp}>{otp}</Text>
                    </Section>

                    <Text style={styles.textSmall}>
                        If you didnt request this, please ignore this email.
                    </Text>

                    <Text style={styles.footer}>Best regards, <br /> <strong>Your App Team</strong></Text>
                </Container>
            </Body>
        </Html>
    );
};

// 🎨 Inline Styles for Better UI
const styles = {
    body: {
        backgroundColor: "#f3f4f6",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    container: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center" as const,
        maxWidth: "400px",
        margin: "auto",
    },
    heading: {
        color: "#333333",
        fontSize: "24px",
        marginBottom: "20px",
    },
    text: {
        color: "#555555",
        fontSize: "16px",
        marginBottom: "15px",
    },
    textSmall: {
        color: "#777777",
        fontSize: "14px",
        marginTop: "20px",
    },
    otpBox: {
        backgroundColor: "#f3f4f6",
        padding: "15px",
        borderRadius: "8px",
        display: "inline-block",
        margin: "10px 0",
    },
    otp: {
        fontSize: "22px",
        fontWeight: "bold",
        letterSpacing: "4px",
        color: "#333333",
    },
    footer: {
        color: "#555555",
        fontSize: "14px",
        marginTop: "25px",
    },
};

export default VerificationEmail;
