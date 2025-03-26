import {
    PublicKeyCredentialCreationOptionsJSON,
    startRegistration,
  } from "@simplewebauthn/browser";
import { useCallback, useState } from "react";
import { fetchHandle } from "./servers";

const handleStartRegistration = async (optionsJSON: PublicKeyCredentialCreationOptionsJSON) => {
  try {
      const asseResp = await startRegistration({ optionsJSON });
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

export const useRegister = () => {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"default" | "error" | "success">("default");

    const clear = useCallback(() => {
        setMessage("");
        setStatus("default");
    }, []);

    const registerHandle = useCallback(async (username: string) => {
        clear();
        if (username === "") {
            setMessage("用户名不能为空");
            setStatus("error");
        } else {
            try {
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
            } catch (error) {
                setStatus("error");
                setMessage(String(error));
            }
        }
    }, []);

    return { message, status, clear, registerHandle } as const;
};