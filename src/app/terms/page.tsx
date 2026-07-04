import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms of Service – RK Infracon",
  description: "Terms and conditions for using RK Infracon services and website.",
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <main>
      <Navbar />

      <section className="relative pt-32 pb-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-gold rounded-full " />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            Legal Agreement
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">
            Terms of <span className="text-gradient-gold">Service</span>
          </h1>
          <p className="text-white/60 mt-4 text-base">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-dark shadow-sm max-w-none text-slate-medium leading-relaxed space-y-6">
            
            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">1. Acceptance of Terms</h3>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">2. Property Information and Pricing</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>All property details, specifications, floor plans, and amenities mentioned on this website are subject to change without prior notice.</li>
              <li>Pricing information provided is indicative and may vary based on specific plot location, facing, size, and current market conditions.</li>
              <li>Visual representations, including images, renderings, and videos, are for illustrative purposes only and may not exactly represent the final product.</li>
              <li>Final terms of any property purchase will be governed strictly by the actual sale agreement and legal documents signed between the buyer and <strong className="text-navy">{settings.name}</strong>.</li>
            </ul>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">3. Intellectual Property Rights</h3>
            <p>
              The content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of <strong className="text-navy">{settings.name}</strong> or its content suppliers and is protected by copyright and other intellectual property laws.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">4. User Conduct</h3>
            <p>
              You agree not to use the website to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Upload, post, email, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, or defamatory.</li>
              <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
              <li>Attempt to gain unauthorized access to any portion of the website or any other systems or networks connected to the website.</li>
            </ul>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">5. Limitation of Liability</h3>
            <p>
              <strong className="text-navy">{settings.name}</strong> shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the website or services, including but not limited to damages for loss of profits, use, data, or other intangibles.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">6. External Links</h3>
            <p>
              Our website may contain links to external sites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies or terms of service.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">7. Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts located in Hyderabad, Telangana.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">8. Contact Information</h3>
            <p>
              If you have any questions regarding these Terms of Service, please contact us at:
            </p>
            <p className="bg-cream p-4 rounded-xl border border-cream-dark inline-block">
              <strong className="text-navy">Email:</strong> <a href={`mailto:${settings.email}`} className="text-gold hover:text-gold-dark">{settings.email}</a><br />
              <strong className="text-navy">Phone:</strong> <a href={`tel:${settings.phone}`} className="text-gold hover:text-gold-dark">{settings.phone}</a><br />
              <strong className="text-navy mt-1 block">Address:</strong> {settings.address}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
