import express, { Request, Response } from 'express';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
// import { default as SimpleWebAuthnServer } from '@simplewebauthn/server';
import {
    // VerifiedRegistrationResponse,
    generateRegistrationOptions,
    verifyRegistrationResponse,
    // generateAuthenticationOptions,
    // verifyAuthenticationResponse,
    // VerifiedAuthenticationResponse,
  } from '@simplewebauthn/server';
import base64url from 'base64url';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3010;

config(); // dotenv 需要单独调用

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users: Record<PropertyKey, any> = {};
const challenges: Record<PropertyKey, string> = {};

const rpName = 'SimpleWebAuthn Example';
const rpId = 'localhost';
const expectedOrigin = [`http://${rpId}:3000`, `http://${rpId}:${PORT}`];

app.listen(PORT, err => {
    if (err) throw err;
    console.log('Server started on port', PORT);
});
app.use(express.static(path.join(__dirname, '../passkey-frontend/dist/passkey-frontend/browser')));

app.post('/register/start', async (req: Request, res: Response) => {
    const username = req.body.username;
    if (!username) {
        res.status(400).send({ error: "用户名不能为空" });
        return;
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

app.post('/register/finish', async (req: Request, res: Response) => {
    const username = req.body.username;
    const expectedChallenge = challenges[username];

    if (!expectedChallenge) {
        res.status(400).send({ error: "没有找到注册用户" });
        return;
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
        const { message } = error instanceof Error ? error : { message: "unknow error" }
        res.status(400).send({ error: message });
        return;
    }
    const { verified, registrationInfo } = verification;
    if (verified && registrationInfo) {
        console.log('a---register-verification', verification);
        // const { credentialPublicKey, credentialID, counter } = registrationInfo;
        users[username] = registrationInfo;
        res.status(200).send({ verified });
    } else {
        res.status(500).send(false);
    }
});