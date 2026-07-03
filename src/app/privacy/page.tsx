import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy – RK Infracon",
  description: "Privacy Policy and data protection guidelines for RK Infracon customers and website visitors.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />

      <section className="relative pt-32 pb-20 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-gold rounded-full " />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Data Protection
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">
            Privacy <span className="text-gradient-gold">Policy</span>
          </h1>
          <p className="text-white/60 mt-4 text-base">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-dark shadow-sm max-w-none text-slate-medium leading-relaxed space-y-6">
            
            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">1. Introduction</h3>
            <p>
              At <strong className="text-navy">{COMPANY_INFO.name}</strong>, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">2. The Data We Collect About You</h3>
            <p>
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-navy">Identity Data:</strong> includes first name, last name, username or similar identifier, title, and photograph.</li>
              <li><strong className="text-navy">Contact Data:</strong> includes billing address, email address, and telephone numbers.</li>
              <li><strong className="text-navy">Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong className="text-navy">Usage Data:</strong> includes information about how you use our website, products, and services.</li>
            </ul>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">3. How We Use Your Personal Data</h3>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To register you as a new customer or to process your inquiries regarding our plots and ventures.</li>
              <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
              <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting, and hosting of data).</li>
              <li>To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you.</li>
            </ul>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">4. Data Security</h3>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions, and they are subject to a duty of confidentiality.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">5. Data Retention</h3>
            <p>
              We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">6. Your Legal Rights</h3>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data, and (where the lawful ground of processing is consent) to withdraw consent.
            </p>

            <h3 className="font-heading text-2xl font-bold text-navy mt-8 mb-4">7. Contact Us</h3>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="bg-cream p-4 rounded-xl border border-cream-dark inline-block">
              <strong className="text-navy">Email:</strong> <a href={`mailto:${COMPANY_INFO.email}`} className="text-gold hover:text-gold-dark">{COMPANY_INFO.email}</a><br />
              <strong className="text-navy">Phone:</strong> <a href={`tel:${COMPANY_INFO.phone}`} className="text-gold hover:text-gold-dark">{COMPANY_INFO.phone}</a><br />
              <strong className="text-navy mt-1 block">Address:</strong> {COMPANY_INFO.address}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
