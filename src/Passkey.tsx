// import { fido2Create, fido2Get } from "@ownid/webauthn";
import { FC, useCallback, useState } from "react";

const SITE_URL = "http://localhost:3010";

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
};

const Passkey: FC = () => {
  const [name, setName] = useState("");

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
  }, [name]);

  return (
    <div>
      <h1>Login</h1>
      <input
        name="username"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={registerStart}>Register</button>
      <button onClick={loginStart}>Login</button>
    </div>
  );
};

export default Passkey;
