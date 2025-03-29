import {
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
    startAuthentication,
    startRegistration,
  } from "@simplewebauthn/browser";
import { useCallback, useState } from "react";
import { fetchHandle } from "./servers";

const handleStartRegistration = async (optionsJSON: PublicKeyCredentialCreationOptionsJSON) => {
  try {
      const asseResp = await startRegistration({ useAutoRegister: true, optionsJSON });
      return asseResp;
  } catch (error) {
      const err = error as unknown as Record<PropertyKey, any>;
      if (err.name === "InvalidStateError") {
          return Promise.reject(
              "Error: Authenticator was probably already registered by user"
          );
      } else {
          return Promise.reject(String(error));
      }
  }
};

const verifyUsername = (name: string, action: () => Promise<void>) => {
    return new Promise((resovle, reject) => {
        if (name === '') {
            reject('name empty');
        } else {
            resovle({});
        }
    }).then(action)
}

export const useRegister = () => {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"default" | "error" | "success">("default");

    const clear = useCallback(() => {
        setMessage("");
        setStatus("default");
    }, []);

    const loginHandle = useCallback(async (username: string) => {
        clear();
        verifyUsername(username, async () => {
            const optionsJSON = await fetchHandle<PublicKeyCredentialRequestOptionsJSON>("/login/start", { username });
            const asseResp = await startAuthentication({ useBrowserAutofill: true, verifyBrowserAutofillInput: false, optionsJSON });

            const verificationJSON = await fetchHandle<Record<PropertyKey, any>>("/login/finish", { data: asseResp, username });
            if (verificationJSON && verificationJSON.verified) {
                setMessage("Success!");
                setStatus("success");
            } else {
                throw `Oh no, something went wrong! Response: ${JSON.stringify(
                    verificationJSON
                )}`
            }
        }).catch(error => {
            setStatus("error");
            setMessage(String(error));
        });
    }, []);

    const registerHandle = useCallback((username: string) => {
        clear();
        verifyUsername(username, async () => {
            const optionsJSON = await fetchHandle<PublicKeyCredentialCreationOptionsJSON>("/register/start", { username });
            const asseResp = await handleStartRegistration(optionsJSON);

            const verificationJSON = await fetchHandle<Record<PropertyKey, any>>("/register/finish", { data: asseResp, username });
            if (verificationJSON && verificationJSON.verified) {
                setMessage("Success!");
                setStatus("success");
            } else {
                throw `Oh no, something went wrong! Response: ${JSON.stringify(
                    verificationJSON
                )}`
            }
        }).catch(error => {
            setStatus("error");
            setMessage(String(error));
        });
    }, []);

    return { message, status, clear, loginHandle, registerHandle } as const;
};