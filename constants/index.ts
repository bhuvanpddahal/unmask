import {
    Briefcase,
    DollarSign,
    Home,
    Star
} from "lucide-react";
import {
    RiInbox2Fill,
    RiInbox2Line,
    RiMoneyDollarBoxFill,
    RiMoneyDollarBoxLine
} from "react-icons/ri";
import { FaRegStar, FaStar } from "react-icons/fa";
import { BsGrid, BsGridFill } from "react-icons/bs";
import { GoHome, GoHomeFill } from "react-icons/go";
import { BiBriefcase, BiSolidBriefcase } from "react-icons/bi";
import { HiRectangleStack, HiOutlineRectangleStack } from "react-icons/hi2";

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
export const REPLIES_PER_QUERY = 10;

/**
 * The number of poll options displayed in a single post
 */
export const POLL_OPTIONS_PER_POST = 3;

/**
 * The number of channels displayed in a single page
 */
export const CHANNELS_PER_PAGE = 12;

export const protectedRoutes = [
    "/post/create",
    "/post/:postId/edit",
    "/user/profile",
    "/user/bookmarks",
    "/topics/create",
    "/topics/:channelId/edit"
];

export const guestOnlyRoutes = [
    "/signup",
    "/signin"
];

export const navItems = [
    {
        icon: {
            default: GoHome,
            active: GoHomeFill
        },
        label: "Community",
        href: "/"
    },
    {
        icon: {
            default: RiMoneyDollarBoxLine,
            active: RiMoneyDollarBoxFill
        },
        label: "Salaries",
        href: "/salaries"
    },
    {
        icon: {
            default: FaRegStar,
            active: FaStar
        },
        label: "Reviews",
        href: "/reviews"
    },
    {
        icon: {
            default: BiBriefcase,
            active: BiSolidBriefcase
        },
        label: "Jobs",
        href: "/jobs"
    }
];

export const sidebarItems = [
    {
        icon: {
            default: HiOutlineRectangleStack,
            active: HiRectangleStack
        },
        label: "Feed",
        href: "/"
    },
    {
        icon: {
            default: RiInbox2Line,
            active: RiInbox2Fill
        },
        label: "Polls",
        href: "/polls"
    },
    {
        icon: {
            default: BsGrid,
            active: BsGridFill
        },
        label: "All Channels",
        href: "/topics"
    }
];

export const mobileSidebarItems = [
    {
        header: "Community",
        items: [...sidebarItems]
    },
    {
        header: "Salaries",
        items: []
    },
    {
        header: "Reviews",
        items: []
    },
    {
        header: "Jobs",
        items: []
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