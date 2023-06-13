import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

interface sms {
    success?: string;
    error?: string;
}

export const sendSMS = async (identifier: string, otp: string): Promise<sms> => {
    const snsClient = new SNSClient({ region: process.env.AWS_REGION });

    const params = {
        Subject: "FINCRA Customer Support",
        Message: "Your OTP for password reset is " + otp,
        PhoneNumber: identifier,
    };

    try {
        const data = await snsClient.send(new PublishCommand(params));

        const success = { success: data.MessageId };
        return success;
    } catch (err) {
        const error = { error: err.message };
        return error;
    }
};
