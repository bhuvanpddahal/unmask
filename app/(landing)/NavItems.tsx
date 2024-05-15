import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface NavItemsProps {
    className?: string;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}

const navItems = [
    {
        name: "Pricing",
        href: "/#pricing"
    },
    {
        name: "FAQ",
        href: "/#faq"
    }
];

const NavItems = ({
    className = "",
    setOpen
}: NavItemsProps) => {
    const closeSheet = () => {
        if (setOpen) {
            setOpen(false);
        }
    };

    return (
        <ul className={className}>
            {navItems.map((item) => (
                <li key={item.name}>
                    <Link
                        href={item.href}
                        className="hover:underline"
                        onClick={closeSheet}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    )
};

export default NavItems;