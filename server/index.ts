import {
    generateAuthenticationOptions,
    generateRegistrationOptions,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
} from '@simplewebauthn/server';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { 
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
} from './pseudocode';

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

    if (user === void 0) {
        res.status(400).send({ error: "用户名不能为空" });
        return;
    }

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

    setCurrentRegistrationOptions(user, options)
    res.json(options);
});

app.post('/register/finish', async (req: Request, res: Response) => {
    const username = String(req.body.username||'');
    const user = getUserFromDB(username);

    const currentOptions = user === void 0 ? void 0 : getCurrentRegistrationOptions(user);
    if (user === void 0 || currentOptions === void 0) {
        res.status(400).send({ error: "没有找到注册用户" });
        return;
    }

    try {
        const verification = await verifyRegistrationResponse({
            expectedRPID: rpId,
            expectedChallenge: currentOptions.challenge,
            requireUserPresence: false,
            requireUserVerification: true,
            response: req.body.data,
            expectedOrigin
        });

        const { verified, registrationInfo } = verification;
        if (verified && registrationInfo) {
            saveNewPasskeyInDB(user, currentOptions, registrationInfo);
            res.status(200).send({ verified });
        } else {
            res.status(500).send({ verified: false });
        }
    } catch (error) {
        const { message } = error instanceof Error ? error : { message: "unknow error" }
        res.status(400).send({ error: message });
    }
});

app.post('/login/start', async (req: Request, res: Response) => {
    const username = String(req.body.username||'');
    const user = getUserFromDB(username);
    if (user === void 0) {
        res.status(400).send({ error: "没有找到注册用户" });
        return;
    }

    const userPasskeys = getUserPasskeys(user);
    if (userPasskeys.length === 0) {
        res.status(400).send({ error: "用户还未绑定设备" });
        return;
    }

    const options = await generateAuthenticationOptions({
        allowCredentials: userPasskeys.map(({ id, transports }) => ({ id, transports })),
        rpID: rpId,
    });

    setCurrentAuthenticationOptions(user, options);
    res.json(options);
});

app.post('/login/finish', async (req: Request, res: Response) => {
    const { data = {}, username: name = "" } = req.body;
    const username = String(name);

    const user = getUserFromDB(username);
    const currentOptions = user === void 0 ? void 0 : getCurrentAuthenticationOptions(user);
    if (user === void 0 || currentOptions === void 0) {
        res.status(400).send({ error: "没有找到登录用户" });
        return;
    }

    const id = String(data.id || '');
    const passkey = getUserPasskey(user, String(data.id || ''));

    if (passkey === void 0) {
      res.status(400).send({ error: `Could not find passkey '${id}' for user ${user.id}` });
      return;
    }

    try {
        const verification = await verifyAuthenticationResponse({
            credential: {
                counter: passkey.counter,
                id: passkey.id,
                publicKey: passkey.publicKey,
                transports: passkey.transports,
            },
            expectedChallenge: currentOptions.challenge,
            expectedRPID: rpId,
            response: data,
            expectedOrigin
        });
        const { verified, authenticationInfo } = verification;
        if (verified) {
            saveUpdatedCounter(user, authenticationInfo);
        }

        res.status(200).send({ verified });
    } catch (error) {
        if (error instanceof Object && 'message' in error) {
            res.status(400).send({ error: error.message });
        } else {
            res.status(400).send({ error: 'unknow error' });
        } 
    }
});

app.get('/passkeys', async (_, res: Response) => {
    const data = getPassport();
    res.json({ code: 200, data });
});