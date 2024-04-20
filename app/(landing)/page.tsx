import Navbar from "./navbar";
import Section2 from "./section-2";
import Section3 from "./section-3";
import HeroSection from "./hero-section";
import Footer from "@/components/footer";

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <Section2 />
            <Section3 />
            <Footer />
        </div>
    )
};

export default LandingPage;