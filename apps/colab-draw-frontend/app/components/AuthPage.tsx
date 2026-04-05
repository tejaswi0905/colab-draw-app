"use client";

import InputField from "./InputField";

interface AuthPageProps {
  isSignin: boolean;
}

export function AuthPage({ isSignin }: AuthPageProps) {
  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center">
      <InputField isSignin={isSignin}></InputField>
    </div>
  );
}
