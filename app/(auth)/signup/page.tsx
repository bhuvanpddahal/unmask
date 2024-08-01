import SignupContent from "./Content";
import { SignupProvider } from "@/context/Signup";

export const metadata = {
    title: "Sign Up"
};

const SignupPage = () => {
    return (
        <SignupProvider>
            <SignupContent />
        </SignupProvider>
    );
};

export default SignupPage;