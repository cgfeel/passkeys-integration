import {
    PublicKeyCredentialCreationOptionsJSON,
    startRegistration,
  } from "@simplewebauthn/browser";
import { useCallback, useState } from "react";
import { fetchHandle } from "./servers";

export const useRegister = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"default" | "error" | "success">(
    "default"
  );

  const clear = useCallback(() => {
    setMessage("");
    setStatus("default");
  }, []);

  const registerHandle = useCallback((username: string) => {
    if (username === "") {
        setMessage("用户名不能为空");
        setStatus("error");
    } else {
        setMessage("");
        fetchHandle<PublicKeyCredentialCreationOptionsJSON>(
            "/register/start",
            { username }
        ).then(async (optionsJSON) => {
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
            })
            .then(async (data) => {
                const verificationJSON = await fetchHandle<
                    Record<PropertyKey, any>
                >("/register/finish", { data, username });
                if (verificationJSON && verificationJSON.verified) {
                    setMessage("Success!");
                    setStatus("success");
                } else {
                    return Promise.reject(
                        `Oh no, something went wrong! Response: ${JSON.stringify(
                            verificationJSON
                        )}`
                    );
                }
            })
            .catch((err: string) => {
                setStatus("error");
                setMessage(err);
            });
        }
    }, []);

    return { message, status, clear, registerHandle } as const;
};