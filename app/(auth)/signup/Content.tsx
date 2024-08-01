"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { FirstStepLoader } from "./FirstStep";

const Spinner = () => (
    <div className="text-center">
        <Loader2 className="inline-block text-primary size-5 animate-spin" />
    </div>
);

const ThirdStep = dynamic(() => import("./ThirdStep"), { ssr: false, loading: Spinner });
const SecondStep = dynamic(() => import("./SecondStep"), { ssr: false, loading: Spinner });
const FirstStep = dynamic(() => import("./FirstStep"), { ssr: false, loading: FirstStepLoader });

const SignupContent = () => {
    const [step, setStep] = useState(1);

    switch (step) {
        case 1:
            return <FirstStep setStep={setStep} />
        case 2:
            return <SecondStep setStep={setStep} />
        case 3:
            return <ThirdStep setStep={setStep} />
        default:
            return null;
    }
};

export default SignupContent;