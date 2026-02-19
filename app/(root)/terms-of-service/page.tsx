import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Nuvylux Terms of Service. By using our platform, you agree to these terms governing your access to Nuvylux services, marketplace, and community.",
  alternates: { canonical: "https://nuvylux.com/terms-of-service" },
  robots: { index: true, follow: false },
};

const page = () => {
  return (
    <div>
      <div className="container py-16">
        <PageHeader title="Nuvylux Terms of Service" />

        <div className="prose max-w-none text-sm lg:prose-lg mt-6 space-y-4 text-muted-foreground">
          <div className="text-sm italic grid gap-1 mb-6">
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
                Jurisdiction:
              </strong>{" "}
              Federal Republic of Nigeria (Global Operations)
            </p>
          </div>

          {/* 1. Introduction */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              1. Introduction & Agreement
            </h2>
            <p>
              Welcome to Nuvylux (“we”, “our”, or “us”). Nuvylux is a
              digital-first luxury ecosystem operating across beauty, fashion,
              technology, education, and creative services.
            </p>
            <p>
              These Terms of Service (“Terms”) govern your access to and use of
              all Nuvylux platforms, websites, applications, tools, digital
              products, content, services, and community features.
            </p>
            <p>
              By creating an account or using any part of Nuvylux, you confirm
              that you have read, understood, and agreed to these Terms and our
              Privacy Policy.
            </p>
          </div>

          {/* 2. Definitions */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              2. Definitions
            </h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>“User” – any individual or entity using Nuvylux services.</li>
              <li>“Account” – a registered Nuvylux user profile.</li>
              <li>
                “Services” – all Nuvylux platforms, tools, apps, courses,
                marketplaces, AI features, and creative services.
              </li>
              <li>
                “Content” – text, images, videos, designs, portfolios, posts,
                and other materials uploaded or generated on Nuvylux.
              </li>
              <li>
                “Digital Products” – non-physical products including courses,
                subscriptions, tools, templates, or premium features.
              </li>
            </ul>
          </div>

          {/* 3. Eligibility */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              3. Eligibility Requirements
            </h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>You must be at least 16 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Use Nuvylux only for lawful purposes</li>
              <li>Not be suspended or banned from prior use</li>
            </ul>
          </div>

          {/* 4. Account Responsibilities */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              4. Account Creation & Responsibilities
            </h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                You are responsible for safeguarding your login credentials
              </li>
              <li>Accounts are personal and non-transferable</li>
              <li>You may not impersonate another person or brand</li>
              <li>You are responsible for activity under your account</li>
            </ul>
          </div>

          {/* 5. Acceptable Use */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              5. Acceptable Use Policy
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Harass, exploit, or abuse other users</li>
              <li>Misuse AI tools or automate harmful actions</li>
              <li>Scrape, reverse engineer, or attack our systems</li>
              <li>Use Nuvylux for fraudulent or deceptive activities</li>
            </ul>
          </div>

          {/* 6. Content Ownership */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              6. Content Ownership & Licensing
            </h2>
            <p>
              You retain ownership of your content. However, by uploading or
              sharing content on Nuvylux, you grant us a worldwide, royalty-free
              license to use, display, promote, and distribute such content in
              connection with our services.
            </p>
          </div>

          {/* 7. Payments */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              7. Payments & Subscriptions
            </h2>
            <p>
              Certain Nuvylux services may require payment. Payments are
              processed through third-party providers. All purchases of digital
              products and subscriptions are final unless stated otherwise.
            </p>
          </div>

          {/* 8. No Refund Policy */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              8. Digital Products & No Refund Policy
            </h2>
            <p className="font-semibold">
              Due to the nature of digital products, all sales are final and
              non-refundable unless explicitly stated.
            </p>
          </div>

          {/* 9. Termination */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              9. Account Suspension & Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these Terms, misuse our services, or pose security or legal risks.
            </p>
          </div>

          {/* 10. Disclaimer */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              10. Disclaimer of Warranties
            </h2>
            <p>
              Nuvylux services are provided “as is” and “as available.” We do
              not guarantee uninterrupted access or error-free performance.
            </p>
          </div>

          {/* 11. Limitation of Liability */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              11. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Nuvylux shall not be
              liable for indirect, incidental, or consequential damages.
            </p>
          </div>

          {/* 12. Governing Law */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              12. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of
              Nigeria.
            </p>
          </div>

          {/* 13. Contact */}
          <div>
            <h2 className="font-medium text-xl md:text-2xl text-black dark:text-white">
              13. Contact Information
            </h2>
            <p>Nuvylux</p>
            <p>
              Email:{" "}
              <a
                href="mailto:hello@nuvylux.com"
                className="text-primary hover:underline"
              >
                hello@nuvylux.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
