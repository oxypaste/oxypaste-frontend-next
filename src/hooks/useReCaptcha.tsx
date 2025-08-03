"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export const useRecaptcha = () => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
  };

  const RecaptchaComponent = (
    <div className="flex justify-center">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={(token: string | null) => setRecaptchaToken(token)}
        ref={recaptchaRef}
        theme="dark"
      />
    </div>
  );

  return {
    recaptchaToken,
    resetRecaptcha,
    RecaptchaComponent,
  };
};
