import Link from "next/link";
import { Suspense } from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <GoogleSigninButton text="Sign in" /> */}

      <div>
        <SigninWithPassword />
      </div>
    </Suspense>
  );
}
