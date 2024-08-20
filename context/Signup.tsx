"use client";

import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState
} from "react";

type InitialValueProps = {
    email: string,
    setEmail: Dispatch<SetStateAction<string>>,
    password: string,
    setPassword: Dispatch<SetStateAction<string>>,
    username: string,
    setUsername: Dispatch<SetStateAction<string>>
};

const initialValues: InitialValueProps = {
    email: "",
    setEmail: () => undefined,
    password: "",
    setPassword: () => undefined,
    username: "",
    setUsername: () => undefined
};

const signupContext = createContext(initialValues);
const { Provider } = signupContext;

export const SignupProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [email, setEmail] = useState(initialValues.email);
    const [password, setPassword] = useState(initialValues.password);
    const [username, setUsername] = useState(initialValues.username);
    
    const values = {
        email,
        setEmail,
        password,
        setPassword,
        username,
        setUsername
    };

    return (
        <Provider value={values}>
            {children}
        </Provider>
    );
};

export const useSignup = () => {
    const state = useContext(signupContext);
    return state;
};