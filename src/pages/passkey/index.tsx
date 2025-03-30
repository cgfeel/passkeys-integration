import { FC, useRef, useState } from "react";
import Wrapper, { WrapperInstance } from "../../components/Wrapper";

const Passkey: FC = () => {
    const wrapperRef = useRef<WrapperInstance>(null);
    const [name, setName] = useState("");

    return (
        <Wrapper ref={wrapperRef}>
            <h1 className="font-bold mb-4 text-4xl">Authentication</h1>
            <div className="flex gap-4 mb-3">
                <input
                    className="border px-3 py-2 rounded-md"
                    maxLength={20}
                    name="username"
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
