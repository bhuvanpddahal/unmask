"use client";

import { useState } from "react";

import Navbar from "./Navbar";
import PostForm from "./PostForm";

const PostCreationContent = () => {
    const [hasPoll, setHasPoll] = useState(false);
    const [hasImage, setHasImage] = useState(false);

    return (
        <>
            <Navbar
                hasImage={hasImage}
                hasPoll={hasPoll}
                setHasPoll={setHasPoll}
            />
            <div className="max-w-[1400px] w-full mx-auto px-6 pt-4 pb-2">
                <PostForm
                    setHasImage={setHasImage}
                    hasPoll={hasPoll}
                    setHasPoll={setHasPoll}
                />
            </div>
        </>
    )
};

export default PostCreationContent;