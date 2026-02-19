import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Nuvylux Privacy Policy to understand how we collect, use, and protect your personal data when you use our platform.",
  alternates: { canonical: "https://nuvylux.com/privacy-policy" },
  robots: { index: true, follow: false },
};

const page = () => {
  return (
    <div>
      <div className="container py-10">
        <PageHeader title="Nuvylux Privacy Policy" />

        {/* --- START OF PRIVACY POLICY CONTENT --- */}
        <div className="prose max-w-none text-sm lg:prose-lg mt-6 space-y-4 text-muted-foreground">
          {/* Effective Date / Entity */}
          <div className="text-sm italic text-muted-foreground grid gap-1 mb-6">
            <p>
              <strong className="text-black dark:text-white">
                Effective Date:
              </strong>{" "}
              Upon Publication
            </p>
            <p>
              <strong className="text-black dark:text-white">Entity:</strong>{" "}
              Nuvylux
            </p>
            <p>
              <strong className="text-black dark:text-white">
                Governing Law:
              </strong>{" "}
              Federal Republic of Nigeria
            </p>
          </div>

          {/* 1. Introduction */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              1. Introduction
            </h2>
            <p>
              Nuvylux (“we”, “our”, or “us”) is a digital luxury and innovation
              platform built for beauty, fashion, and creative professionals,
              brands, and enthusiasts.
            </p>
            <p>
              This Privacy Policy explains how Nuvylux collects, uses, stores,
              protects, and shares information when users access the Nuvylux
              website, create accounts, engage with platform features, or
              interact with Nuvylux services.
            </p>
            <p>
              By accessing or using Nuvylux, you agree to the practices
              described in this Policy.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              2. Information We Collect
            </h2>
            <p>
              We collect information necessary to operate the platform, provide
              a personalized experience, maintain security, and improve our
              services.
            </p>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              2.1 Identity & Account Data
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Full name</li>
              <li>Username or display name</li>
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Profile information you choose to provide</li>
              <li>Account preferences and settings</li>
            </ul>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              2.2 Device & Technical Data
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Device type</li>
              <li>Operating system</li>
              <li>Browser type</li>
              <li>IP address</li>
              <li>Approximate location data</li>
              <li>Session activity and timestamps</li>
            </ul>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              2.3 Usage & Interaction Data
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Pages viewed</li>
              <li>Time spent on the platform</li>
              <li>Clicks, navigation, and feature usage</li>
              <li>Content interactions</li>
            </ul>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              2.4 Payment & Transaction Data
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Payment information processed via third-party payment providers
              </li>
              <li>Transaction history</li>
              <li>Billing and subscription records</li>
            </ul>
          </div>

          {/* 3. How We Use Your Information */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              3. How We Use Your Information
            </h2>
            <p>Nuvylux uses collected data for the following purposes:</p>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              3.1 Platform Operations
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Create and manage user accounts</li>
              <li>Deliver platform features and services</li>
              <li>Maintain platform performance and reliability</li>
            </ul>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              3.2 Personalisation & Experience
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Customize content and recommendations</li>
              <li>Improve usability and design</li>
              <li>Understand user preferences</li>
            </ul>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              3.3 Communications
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Send service-related notifications</li>
              <li>Share platform updates and announcements</li>
              <li>Marketing communications (opt-out available)</li>
            </ul>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              3.4 Payments & Billing
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Process payments and subscriptions</li>
              <li>Maintain financial records</li>
              <li>Prevent fraudulent transactions</li>
            </ul>

            <h3 className="font-medium mt-4 text-black dark:text-white">
              3.5 Legal & Security
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Comply with legal obligations</li>
              <li>Enforce platform policies</li>
              <li>Protect Nuvylux and users from abuse</li>
            </ul>
          </div>

          {/* 4. Third-Party Service Providers */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              4. Third-Party Service Providers
            </h2>
            <p>
              Nuvylux works with trusted third-party providers to support
              platform operations.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Cloud hosting providers (e.g., AWS)</li>
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Email and communication services</li>
            </ul>
            <p>Nuvylux does not sell, rent, or trade personal data.</p>
          </div>

          {/* 5. Data Retention */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              5. Data Retention
            </h2>
            <p>
              We retain personal data only for as long as necessary to fulfill
              operational, legal, and business requirements.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Account data: retained while account is active</li>
              <li>Inactive accounts: retained for up to 7 years</li>
              <li>Payment records: retained per financial regulations</li>
              <li>Analytics data: retained in aggregated form</li>
            </ul>
          </div>

          {/* 6. User Rights */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              6. User Rights
            </h2>
            <p>Users may request:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Access to personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </div>

          {/* 7. Cookies */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              7. Cookies & Tracking
            </h2>
            <p>
              Nuvylux uses cookies for functionality, analytics, and user
              experience improvement.
            </p>
            <p>Users may manage cookie preferences via browser settings.</p>
          </div>

          {/* 8. Data Security */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              8. Data Security
            </h2>
            <p>
              We implement industry-standard security measures including
              encryption, access controls, and regular system monitoring.
            </p>
          </div>

          {/* 9. Children’s Privacy */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              9. Children’s Privacy
            </h2>
            <p>Nuvylux is not intended for individuals under the age of 13.</p>
            <p>
              We do not knowingly collect personal information from children.
            </p>
          </div>

          {/* 10. Policy Updates */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              10. Changes to This Policy
            </h2>
            <p>
              Nuvylux may update this Privacy Policy periodically. Continued use
              of the platform constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* 11. Contact */}
          <div>
            <h2 className="font-medium text-lg md:text-xl mb-1 text-black dark:text-white">
              11. Contact Information
            </h2>
            <p>If you have questions about this Privacy Policy, contact:</p>
            <p>Nuvylux</p>
            <p>
              Email:{" "}
              <a
                href="mailto:privacy@nuvylux.com"
                className="text-primary hover:underline"
              >
                privacy@nuvylux.com
              </a>
            </p>
          </div>
        </div>
        {/* --- END OF PRIVACY POLICY CONTENT --- */}
      </div>
    </div>
  );
};

export default page;
