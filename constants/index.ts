import {
    Briefcase,
    Building2,
    DollarSign,
    Fence,
    Home,
    Inbox,
    Star
} from "lucide-react";

/**
 * The expiry time of verification token in minutes
 */
export const TOKEN_EXPIRY_TIME_IN_MIN = 10;

export const navItems = [
    {
        icon: Home,
        label: "Community",
        href: "/"
    },
    {
        icon: DollarSign,
        label: "Salaries",
        href: "/salaries"
    },
    {
        icon: Star,
        label: "Reviews",
        href: "/reviews"
    },
    {
        icon: Briefcase,
        label: "Jobs",
        href: "/jobs"
    }
];

export const sidebarItems = [
    {
        icon: Fence,
        label: "Feed",
        href: "/"
    },
    {
        icon: Building2,
        label: "Company",
        href: "/company"
    },
    {
        icon: Inbox,
        label: "Polls",
        href: "/polls"
    }
];