import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { PrivacyStrip } from "@/components/privacy-strip";
import { FeaturesGrid } from "@/components/features-grid";
import { ChecksCoverage } from "@/components/checks-coverage";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <PrivacyStrip />
        <FeaturesGrid />
        <ChecksCoverage />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
