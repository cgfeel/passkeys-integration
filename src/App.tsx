// import { fido2Create, fido2Get } from "@ownid/webauthn";
import { FC, useCallback, useRef, useState } from "react";

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

const App: FC = () => {
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  return (
    <div>
      <h1>Registration</h1>
      <button
        onClick={() => {
          const error = errorRef.current || { innerText: "" };
          const success = successRef.current || { innerText: "" };

          error.innerText = "";
          success.innerText = "";
        }}
      >
        startRegistration
      </button>
      <p ref={successRef} style={{ color: "#f00" }}></p>
      <p ref={errorRef} style={{ color: "#00ff1a" }}></p>
    </div>
  );
};

export default App;
