// import { fido2Create, fido2Get } from "@ownid/webauthn";
import { FC, useRef, useState } from "react";
import Wrapper, { WrapperInstance } from "../../components/Wrapper";

/*const SITE_URL = "http://localhost:3010";

const fetchHandle = async (path: string, data: Object) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(`${SITE_URL}${path}`, options);
    const json = await response.json();

    return json;
};*/

const Passkey: FC = () => {
    const wrapperRef = useRef<WrapperInstance>(null);
    const [name, setName] = useState("");
    /*const [name, setName] = useState("");

    const loginStart = useCallback(async () => {
        if (name !== "") {
            const response = await fetchHandle("/login/start", {
                username: name,
            });
            console.log("a-----loginStart", response);

            const options = response as PublicKeyCredentialRequestOptions;
            // const assertion = await fido2Get(options, name);
            const assertion = { ...options };
            console.log("a----assertion", assertion);

            await fetchHandle("/login/finish", assertion);
            console.log("a-----Login successful");
        }
    }, [name]);

    const registerStart = useCallback(async () => {
        if (name !== "") {
            const publicKey = await fetchHandle("/register/start", {
                username: name,
            });
            console.log("a-----publicKey", publicKey);

            // const fidoData = await fido2Create(publicKey, name);
            const fidoData = {};
            console.log("a---fido2Create", fidoData);

            const register = await fetchHandle("/register/finish", fidoData);
            console.log("a---register", register);
        }
    }, [name]);*/

    return (
        <Wrapper ref={wrapperRef}>
            <h1 className="font-bold mb-4 text-4xl">Authentication</h1>
            <div className="flex gap-4 mb-3">
                <input
                    className="border px-3 py-2 rounded-md"
                    maxLength={20}
                    onChange={({ target }) => setName(target.value)}
                    onInput={() => wrapperRef.current?.clear()}
                />
                <button
                    className="bg-sky-600/100 cursor-pointer px-3 py-2 rounded-3xl text-gray-50"
                    onClick={() => wrapperRef.current?.login(name)}>
                    Login
                </button>
            </div>
        </Wrapper>
    );
};

export default Passkey;
