import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <Link href="/">
            <Image
                src="/logo-light.svg"
                alt="Logo"
                height={35}
                width={116}
                className="h-[35px] w-auto hidden lg:inline-block dark:hidden"
                priority
            />
            <Image
                src="/logo-dark.svg"
                alt="Logo"
                height={35}
                width={116}
                className="h-[35px] w-auto hidden dark:lg:inline-block"
                priority
            />
            <Image
                src="/logo-icon.png"
                alt="Logo"
                height={50}
                width={50}
                className="h-[35px] w-auto lg:hidden"
                priority
            />
        </Link>
    );
};

export default Logo;