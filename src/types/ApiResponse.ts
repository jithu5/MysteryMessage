import { IMessage } from "@/model/User";

export interface IApiResponse {
    status: number;
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    // data?: any;
    messages?: Array<IMessage>
}