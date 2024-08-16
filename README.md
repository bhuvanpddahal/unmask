# Unmask - Anonymous and Professional Community

Unmask is a safe space to share your experiences, thoughts, and feelings - completely anonymously. Whether you want to celebrate a victory, vent about a frustration, or simply connect with others who understand, Unmask provides a supportive and judgement-free community.

![Unmask Thumbnail](/public/thumbnail.png)

## 🎉 Features

- 📮 **Create and Manage Posts**:
  Easily create, edit, and delete posts. Enhance content with polls and images.
- 📊 **Discover and Vote on Polls**:
  Explore community-driven polls and cast your vote to influence discussions.
- 🌲 **Create and Manage Channels**:
  Effortlessly establish and customize channels. Invite members to join private communities.
- 🔩 **Personalize Your Profile**:
  Tailor your profile settings and preferences to reflect your identity.
- 🔖 **Organize Content with Bookmarks**:
  Save and access your favorite posts for quick reference.

## 🔗 Live Demo

Go to <https://unmask-ten.vercel.app>, create an account, create posts, channels and see what I have implemented. Also if you like it, don't forget to give a star. I'll appreciate it.

## 🔨 Local Setup

1. Fork the repository and clone it in your device,

    ```bash
    git clone https://github.com/BhuvanPdDahal/unmask
    ```

2. Run the following command to install all the dependencies:

    ```bash
    npm install
    #or
    yarn install
    #or
    pnpm install
    #or
    bun install
    ```

3. Create a `.env` file in the root directory (`/`) and copy the environment variables from `.env.example` and fill them up with your keys.

    ```bash
    DATABASE_URL=
    
    AUTH_SECRET=
    HASHING_SALT=

    NODEMAILER_USER=
    NODEMAILER_PASS=

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=

    NEXT_PUBLIC_APP_URL=
    ```

4. Run the following command to see it in your browser:

    ```bash
    npm run dev
    #or
    yarn dev
    #or
    pnpm dev
    #or
    bun run dev
    ```

## 🎁 More

Checkout my other projects as well: [RaveHQ](https://rave-hq.vercel.app), [PassLock](https://pass-lock-five.vercel.app), [Code Overflow](https://code-overflow-phi.vercel.app/), ...
