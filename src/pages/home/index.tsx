// import { fido2Create, fido2Get } from "@ownid/webauthn";
import { FC, useRef, useState } from "react";
import Wrapper, { WrapperInstance } from "./Wrapper";

const App: FC = () => {
  const wrapperRef = useRef<WrapperInstance>(null);
  const [name, setName] = useState("");

  return (
    <Wrapper ref={wrapperRef}>
      <div className="flex gap-4 mb-3">
        <input
          className="border px-3 py-2 rounded-md"
          maxLength={20}
          onChange={({ target }) => setName(target.value)}
          onInput={() => wrapperRef.current?.clear()}
        />
        <button
          className="bg-sky-600/100 cursor-pointer px-3 py-2 rounded-3xl text-gray-50"
          onClick={() => wrapperRef.current?.register(name)}
        >
          startRegistration
        </button>
      </div>
    </Wrapper>
  );
};

export default App;
