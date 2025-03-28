import { AuthenticatorTransportFuture, Base64URLString, CredentialDeviceType, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, VerifiedAuthenticationResponse, VerifiedRegistrationResponse } from "@simplewebauthn/server";

let id = 1;
const challenges: ChallengeType = {
    login: {},
    register: {}
};

const passport: PassKeyType[] = [];
const users: Record<string, UserModelType> = {};

function getCurrentAuthenticationOptions({ id }: UserModelType): PublicKeyCredentialRequestOptionsJSON | undefined {
    return challenges.login[id];
}

function getCurrentRegistrationOptions({ id }: UserModelType): PublicKeyCredentialCreationOptionsJSON | undefined {
    return challenges.register[id];
}

function getPassport() {
    return passport.reduce<Record<string, PassportList>>((current, { counter, create_at, last_used, user }) => {
        const item = current[user.username] || { record: [{ counter, create_at, last_used }], user };
        return { ...current, [user.username]: item };
    }, {});
}

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

function getUserPasskey(user: UserModelType, id: Base64URLString): PassKeyType | undefined {
    return getUserPasskeys(user).filter(item => id === item.id)[0];
}

function getUserPasskeys({ id: userid }: UserModelType): PassKeyType[] {
    return passport.filter(({ user }) => user.id === userid);
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

function saveUpdatedCounter({ id: userid }: UserModelType, options: VerifiedAuthenticationResponse['authenticationInfo']) {
    const index = passport.findIndex(({ id, user }) => user.id === userid && id === options.credentialID);
    const passkey = passport[index];

    if (passkey !== undefined) {
        passport[index] = {
            ...passkey,
            counter: options.newCounter,
            last_used: Date.now()
        }
    }
}

function setCurrentAuthenticationOptions({ id }: UserModelType, options: PublicKeyCredentialRequestOptionsJSON) {
    challenges.login[id] = options;
}

function setCurrentRegistrationOptions({ id }: UserModelType, options: PublicKeyCredentialCreationOptionsJSON) {
    challenges.register[id] = options;
}

export { 
    getCurrentAuthenticationOptions, 
    getCurrentRegistrationOptions, 
    getPassport,
    getUserFromDB, 
    getUserPasskey,
    getUserPasskeys, 
    saveNewPasskeyInDB, 
    saveUpdatedCounter,
    setCurrentAuthenticationOptions, 
    setCurrentRegistrationOptions 
};

type ChallengeType = {
    login: Record<number, PublicKeyCredentialRequestOptionsJSON>;
    register: Record<number, PublicKeyCredentialCreationOptionsJSON>;
};

type PassKeyType = PassKeyBaseType & {
    backedUp: boolean;
    deviceType: CredentialDeviceType;
    id: Base64URLString;
    publicKey: Uint8Array;
    webauthnUserID: Base64URLString;
    transports?: AuthenticatorTransportFuture[]
};