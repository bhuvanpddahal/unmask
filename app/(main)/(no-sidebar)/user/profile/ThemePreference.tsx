"use client";

import { useTheme } from "next-themes";

import DarkMode from "./DarkMode";
import LightMode from "./LightMode";
import SystemMode from "./SystemMode";
import { cn } from "@/lib/utils";

const ThemePreference = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex flex-col sm:flex-row gap-5">
            <div
                className={cn(
                    "w-fit border-4 border-transparent rounded-2xl cursor-pointer overflow-hidden",
                    theme === "light" && "border-primary"
                )}
                onClick={() => setTheme("light")}
            >
                <LightMode />
            </div>
            <div
                className={cn(
                    "w-fit border-4 border-transparent rounded-2xl cursor-pointer overflow-hidden",
                    theme === "dark" && "border-primary"
                )}
                onClick={() => setTheme("dark")}
            >
                <DarkMode />
            </div>
            <div
                className={cn(
                    "w-fit border-4 border-transparent rounded-2xl cursor-pointer overflow-hidden",
                    theme === "system" && "border-primary"
                )}
                onClick={() => setTheme("system")}
            >
                <SystemMode />
            </div>
        </div>
    )
};

export default ThemePreference;