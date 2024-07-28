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

/**
 * The number of posts displayed in a single page
 */
export const POSTS_PER_PAGE = 20;

/**
 * The number of comments displayed in a single page
 */
export const COMMENTS_PER_PAGE = 10;

/**
 * The number of replies displayed in a single page
 */
export const REPLIES_PER_PAGE = 2;

/**
 * The number of replies fetched in a single query
 */
export const REPLIES_PER_QUERY = 20;

/**
 * The number of poll options displayed in a single post
 */
export const POLL_OPTIONS_PER_POST = 3;

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
        icon: Inbox,
        label: "Polls",
        href: "/polls"
    },
    {
        icon: Inbox,
        label: "All Channels",
        href: "/topics"
    }
];

export const channelTypes = {
    academics: "Academics and Learning",
    career: "Career and Job Search",
    personal_development: "Personal Development",
    campus_life: "Campus Life",
    general: "General Interest",
    technology: "Technology",
    industry: "Industry",
    creative_arts: "Creative Arts",
    social_issues: "Social Issues"
};