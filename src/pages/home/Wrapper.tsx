import { FC, PropsWithChildren, RefObject, useImperativeHandle } from "react";
import { tv } from "tailwind-variants";
import { useRegister } from "../../hooks";

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

const Wrapper: FC<PropsWithChildren<WrapperProps>> = ({ children, ref }) => {
  const { message, status, clear, registerHandle } = useRegister();
  useImperativeHandle(
    ref,
    () => ({
      register: (name) => registerHandle(name),
      clear,
    }),
    []
  );

  return (
    <div className="px-5 py-8">
      <h1 className="font-bold mb-4 text-4xl">Registration</h1>
      {children}
      <p className={tips({ status })}>
        {status !== "default" && <span>{icon[status]}</span>}
        {message}
      </p>
    </div>
  );
};

export default Wrapper;

export interface WrapperInstance {
  clear: () => void;
  register: (name: string) => void;
}

interface WrapperProps {
  ref?: RefObject<WrapperInstance | null>;
}
