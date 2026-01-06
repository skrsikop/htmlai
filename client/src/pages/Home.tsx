import OurTestimonials from "../sections/Our-testimonials";
import SubscribeNewsletter from "../sections/Subscribe-newsletter";
import TrustedCompanies from "../sections/Trusted-companies";
import AboutOurApps from "../sections/About-our-apps";
import HeroSection from "../sections/Hero-section";
import OurLatestCreation from "../sections/Our-latest-creation";

const Home = () =>  {
    return (
        <>
            <main className="px-6 md:px-16 lg:px-24 xl:px-32">
                <HeroSection />
                <OurLatestCreation />
                <AboutOurApps />
                <OurTestimonials />
                <TrustedCompanies />
                <SubscribeNewsletter />
            </main>
        </>
    );
}

export default Home