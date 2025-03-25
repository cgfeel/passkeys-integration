import { AuthenticatorTransportFuture, Base64URLString, CredentialDeviceType, PublicKeyCredentialCreationOptionsJSON, VerifiedRegistrationResponse } from "@simplewebauthn/server";

let id = 1;

const challenges: Record<number, PublicKeyCredentialCreationOptionsJSON> = {};
const passport: PassKeyType[] = [];
const users: Record<string, UserModelType> = {};

// 如果没有用户就创建一个
function getUserFromDB(username: string): UserModelType | undefined {
    if (username === '') return undefined;
    if (!(username in users)) {
        users[username] = {
            create_at: Date.now(),
            id: id++,
            username
        }
    }
    return users[username];
}

function getUserPasskeys({ id: userid }: UserModelType): PassKeyType[] {
    return passport.filter(({ user }) => user.id === userid);
}

function getCurrentRegistrationOptions({ id }: UserModelType): PublicKeyCredentialCreationOptionsJSON | undefined {
    return challenges[id];
}

function saveNewPasskeyInDB(user: UserModelType, options: PublicKeyCredentialCreationOptionsJSON, registrationInfo: Exclude<VerifiedRegistrationResponse['registrationInfo'], undefined>) {
    const { credential, credentialBackedUp, credentialDeviceType } = registrationInfo;
    const { counter, id, publicKey, transports } = credential;

    const create_at = Date.now();
    passport.push({
        backedUp: credentialBackedUp,
        deviceType: credentialDeviceType,
        last_used: create_at,
        webauthnUserID: options.user.id,
        counter,
        create_at,
        id,
        publicKey,
        transports,
        user
    });
}

function setCurrentRegistrationOptions({ id }: UserModelType, options: PublicKeyCredentialCreationOptionsJSON) {
    challenges[id] = options;
}

export { getUserFromDB, getUserPasskeys, getCurrentRegistrationOptions, saveNewPasskeyInDB, setCurrentRegistrationOptions };

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