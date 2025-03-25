import express, { Request, Response } from 'express';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
  } from '@simplewebauthn/server';
import { fileURLToPath } from 'url';
import { getCurrentRegistrationOptions, getUserFromDB, getUserPasskeys, saveNewPasskeyInDB, setCurrentRegistrationOptions } from './pseudocode';

config(); // dotenv 需要单独调用

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3010;

const rpName = 'SimpleWebAuthn Example';
const rpId = 'localhost';
const expectedOrigin = [`http://${rpId}:3000`, `http://${rpId}:${PORT}`];

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, err => {
    if (err) throw err;
    console.log('Server started on port', PORT);
});
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/register/start', async (req: Request, res: Response) => {
    const username = String(req.body.username||'');
    const user = getUserFromDB(username);

    if (user === undefined) {
        res.status(400).send({ error: "用户名不能为空" });
        return;
    }
    // let challenge = getNewChallenge();
    // challenges[username] = convertChallenge(challenge);

    const userPasskeys = getUserPasskeys(user);
    const options = await generateRegistrationOptions({
        attestationType: 'none',
        authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'preferred',
            authenticatorAttachment: "platform"
        },
        // 設定要排除的驗證器，避免驗證器重複註冊
        excludeCredentials: userPasskeys.map(({ id, transports = [] }) => ({ id, transports })),
        rpID: rpId,
        userName: username,
        timeout: 60000,
        rpName
    });

    // console.log('a---options', options);
    // challenges[username] = options.challenge;

    setCurrentRegistrationOptions(user, options)
    res.json(options);
});

app.post('/register/finish', async (req: Request, res: Response) => {
    const username = String(req.body.username||'');
    const user = getUserFromDB(username);

    const currentOptions = user === undefined ? undefined : getCurrentRegistrationOptions(user);
    if (user === undefined || currentOptions === undefined) {
        res.status(400).send({ error: "没有找到注册用户" });
        return;
    }

    try {
        const verification = await verifyRegistrationResponse({
            expectedRPID: rpId,
            response: req.body.data,
            requireUserVerification: true,
            expectedChallenge: currentOptions.challenge,
            expectedOrigin
        });

        const { verified, registrationInfo } = verification;
        if (verified && registrationInfo) {
            console.log('a---register-verification', verification);
            // const { credentialPublicKey, credentialID, counter } = registrationInfo;
            // users[username] = registrationInfo;
            saveNewPasskeyInDB(user, currentOptions, registrationInfo);
            res.status(200).send({ verified });
        } else {
            res.status(500).send(false);
        }
    } catch (error) {
        const { message } = error instanceof Error ? error : { message: "unknow error" }
        res.status(400).send({ error: message });
    }
});