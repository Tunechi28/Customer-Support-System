import { env } from "./../utils/helpers/utils";
import SESv2 from "aws-sdk/clients/sesv2";

interface email {
    success?: string;
    error?: string;
}

export const sendEmail = async (identifier: string, otp: string): Promise<email> => {
    const params = {
        Content: {
            Simple: {
                Body: {
                    Html: {
                        Data: `
                        <h3>Your OTP for password reset is ${otp}</h3>`,
                        Charset: "UTF-8",
                    },
                },
                Subject: {
                    Data: "Fincra Customer Support",
                    Charset: "UTF-8",
                },
            },
        },
        Destination: {
            ToAddresses: [identifier],
        },
        FromEmailAddress: env("NOREPLY_EMAIL_ADDRESS"),
    };

    try {
        const ses = new SESv2();
        const data = await ses.sendEmail(params).promise();

        const success = { success: data.MessageId };
        return success;
    } catch (err) {
        const error = { error: err.message };
        return error;
    }
};
