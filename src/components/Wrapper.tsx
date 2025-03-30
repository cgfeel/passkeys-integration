import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { FC, PropsWithChildren, RefObject, useImperativeHandle } from "react";
import { tv } from "tailwind-variants";
import { useRegister } from "../hooks";

const icon = {
    error: "❎",
    success: "✅",
};

const tips = tv({
    base: "flex gap-2 items-center text-xl",
    variants: {
        status: {
            default: "text-gray-950",
            error: "text-red-500",
            success: "text-emerald-600",
        },
    },
});

const Wrapper: FC<PropsWithChildren<WrapperProps>> = ({
    children,
    filter,
    ref,
}) => {
    const { message, status, clear, loginHandle, registerHandle } =
        useRegister();

    useImperativeHandle(
        ref,
        () => ({
            login: name => loginHandle(name),
            register: name => registerHandle(name),
            clear,
        }),
        [],
    );

    return browserSupportsWebAuthn() || filter ? (
        <div className="px-5 py-8">
            {children}
            <p className={tips({ status })}>
                {status !== "default" && <span>{icon[status]}</span>}
                {message}
            </p>
        </div>
    ) : (
        <div className="px-5 py-8">
            It seems this browser does not support WebAuthn...
        </div>
    );
};

export default Wrapper;

export interface WrapperInstance {
    clear: () => void;
    login: (name: string) => void;
    register: (name: string) => void;
}

interface WrapperProps {
    filter?: boolean;
    ref?: RefObject<WrapperInstance | null>;
}
