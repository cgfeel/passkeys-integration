import { AuthenticatorTransportFuture, Base64URLString, CredentialDeviceType } from "@simplewebauthn/server";

let id = 1;

const users: Record<string, UserModelType> = {};
const passport: Record<number, PassKeyType> = {};
const challenges: Record<PropertyKey, string> = {};

function getUserFromDB(username: string): UserModelType | undefined {
    return users[username];
}

function getUserPasskeys(user?:UserModelType): PassKeyType | undefined {
    const { id } = user || { id: 0 }
    return passport[id];
}

export { getUserFromDB, getUserPasskeys };

type PassKeyType = {
    backedUp: boolean;
    counter: number;
    create_at: number;
    deviceType: CredentialDeviceType;
    id: Base64URLString;
    last_used: number;
    publicKey: Uint8Array;
    user: UserModelType;
    webauthnUserID: Base64URLString;
    transports?: AuthenticatorTransportFuture[]
};

type UserModelType = {
    create_at: number;
    id: number;
    username: string;
}