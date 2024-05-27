import Footer from "./Footer";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";

export const metadata = {
    title: "Quickly setup your project with preconfigured assets using QuickCodeKit"
};

const LandingPage = () => {
    return (
        <main>
            <Navbar />
            <HeroSection />
            <Footer />
        </main>
    )
};

export default LandingPage;