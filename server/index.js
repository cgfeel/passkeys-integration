import express from 'express';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
// import { default as SimpleWebAuthnServer } from '@simplewebauthn/server';
import {
    verifyRegistrationResponse,
    // VerifiedRegistrationResponse,
    generateRegistrationOptions,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
    // VerifiedAuthenticationResponse,
  } from '@simplewebauthn/server';
import base64url from 'base64url';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

config(); // dotenv 需要单独调用


app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = {};
let challenges = {};

const rpName = 'sitename-webauthn';
const rpId = 'localhost';
const expectedOrigin = ['http://localhost:3000'];

const saveUser = (name, data, callback) => {
    const jsonString = JSON.stringify(data, null, 2);
    const fileName = encodeURIComponent(name);

    const directory = 'data';
    const filePath = path.join(__dirname, directory, `${fileName}.json`);

    return fs.writeFile(filePath, jsonString, callback);
};

app.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    console.log('Server started on port', process.env.PORT || 3000);
});
app.use(express.static(path.join(__dirname, '../passkey-frontend/dist/passkey-frontend/browser')));


app.post('/register/start', async (req, res) => {
    const username = req.body.username;
    if (!username) {
        return res.status(400).send({ error: "用户名不能为空" });
    }
    // let challenge = getNewChallenge();
    // challenges[username] = convertChallenge(challenge);
    
    const options = await generateRegistrationOptions({
        rpName,
        rpID: rpId,
        userName: username,
        attestationType: 'none',
        authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'preferred',
            authenticatorAttachment: "platform"
        },
        // 設定要排除的驗證器，避免驗證器重複註冊
        excludeCredentials: [],
        timeout: 60000,
    });

    challenges[username] = options.challenge;
    res.json(options);
});


app.post('/register/finish', async (req, res) => {
    const username = req.body.username;
    const expectedChallenge = challenges[username];

    if (!expectedChallenge) {
        return res.status(400).send({ error: "没有找到注册用户" });
    }

    console.log('a--register-challenges', expectedChallenge);

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            expectedRPID: rpId,
            response: req.body.data,
            requireUserVerification: true,
            expectedChallenge,
            expectedOrigin
        });
    } catch (error) {
        console.error('a---register-verify-error', error);
        return res.status(400).send({error: error.message});
    }
    const { verified, registrationInfo } = verification;
    if (verified && registrationInfo) {
        console.log('a---register-verification', verification);
        // const { credentialPublicKey, credentialID, counter } = registrationInfo;
        users[username] = registrationInfo;
        return res.status(200).send({ verified: true });
    } else {
        res.status(500).send(false);
    }
});

app.post('/login/start', (req, res) => {
    let username = req.body.username;
    if (!users[username]) {
        return res.status(404).send(false);
    }
    let challenge = getNewChallenge();
    challenges[username] = convertChallenge(challenge);
    console.log('a---login-start', users);
    res.json({
        challenge,
        rpId,
        allowCredentials: [{
            type: 'public-key',
            // id: users[username].credentialID,
            id: users[username].credential.id,
            transports: ['internal'],
        }],
        userVerification: 'preferred',
    });
});
app.post('/login/finish', async (req, res) => {
    let username = req.body.username;
    if (!users[username]) {
       return res.status(404).send(false);
    }
    let verification;
    try {
        const user = users[username];
        verification = await verifyAuthenticationResponse({
            expectedChallenge: challenges[username],
            response: req.body.data,
            authenticator: user,
            expectedRPID: rpId,
            expectedOrigin,
            requireUserVerification: false
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({error: error.message});
    }
    const {verified} = verification;
    return res.status(200).send({
        res: verified
    });
});
function getNewChallenge() {
    return Math.random().toString(36).substring(2);
}
function convertChallenge(challenge) {
    return btoa(challenge).replaceAll('=', '');
}