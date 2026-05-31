"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const sections = [
  {
    title: "1. Nature of This Service",
    content: `MoralEdu Care Upskill Prep is a private English language practice tool designed to help students prepare for the Cambridge UpSkill Assessment. This application is NOT affiliated with Cambridge Assessment English, CIIN (Cambridge International Institute of Nepal), or any official examination body.`,
  },
  {
    title: "2. No Guarantee of Exam Content",
    content: `By paying and using this service, you acknowledge and agree that:\n\nâ€¢ The practice questions, tasks, and content provided in this app do NOT represent the actual questions that will appear in any Cambridge UpSkill examination.\nâ€¢ This is a mock practice tool only.\nâ€¢ Moral Educare does not guarantee that use of this tool will result in any specific grade or outcome in the actual examination.`,
  },
  {
    title: "3. Payment & Refund Policy",
    content: `The access fee of NPR 499 is a one-time, non-refundable payment that grants access to all 7 practice sets. No refund will be issued once access has been granted, except in cases of technical failure where access was never provided. For payment issues, contact us within 48 hours of payment.`,
  },
  {
    title: "4. User Responsibilities",
    content: `You agree to:\nâ€¢ Use this platform only for personal study purposes.\nâ€¢ Not share your account credentials with others.\nâ€¢ Not reproduce, distribute, or resell any content from this application.\nâ€¢ Provide accurate information during registration.`,
  },
  {
    title: "5. Grading & Scores",
    content: `Scores and CEFR grades (A1, A2, B1) provided in this app are for self-assessment purposes only. They are based on a practice scoring rubric and do not reflect official Cambridge assessment standards or your actual Cambridge UpSkill result.`,
  },
  {
    title: "6. Privacy",
    content: `We collect your name, email address and mobile number for account management purposes only. Your data will not be sold or shared with third parties. Practice results are stored to help you track your progress.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content in this app â€” including practice questions, writing prompts, listening transcripts and speaking tasks â€” is the intellectual property of Moral Educare. Unauthorised reproduction is prohibited.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `Moral Educare shall not be liable for any direct, indirect, incidental or consequential damages arising from the use of this application, including but not limited to examination results.`,
  },
  {
    title: "9. Changes to Terms",
    content: `Moral Educare reserves the right to update these terms at any time. Continued use of the application after changes constitutes acceptance of the updated terms.`,
  },
  {
    title: "10. Contact",
    content: `For any questions or concerns, please contact us via:\nEmail: info@moraleducare.edu.np\nPhone: +977 9800000000`,
  },
];

export default function TermsPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", padding: "16px 20px 24px" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 13, marginBottom: 16 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Terms & Conditions</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4 }}>MoralEdu Care Upskill Prep</p>
      </div>

      {/* Important disclaimer */}
      <div style={{ background: "#fef3c7", border: "none", borderBottom: "2px solid #fde68a", padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <AlertTriangle size={20} color="#92400e" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Important Disclaimer</p>
          <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.6 }}>
            Payment for this practice tool does NOT guarantee that these exact questions appear in the Cambridge UpSkill exam. This is a practice and preparation tool only.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>Last updated: May 2026</p>

        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a8a", marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{s.content}</p>
          </div>
        ))}

        <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 14, padding: 16, marginTop: 8 }}>
          <p style={{ fontSize: 13, color: "#0369a1", lineHeight: 1.6 }}>
            By creating an account and making payment, you confirm that you have read, understood and agreed to these Terms & Conditions.
          </p>
        </div>
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}


