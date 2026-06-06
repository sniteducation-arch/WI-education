"use client";
import { useRouter } from "next/navigation";

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

const sections: { title: string; content: string }[] = [
  {
    title: "1. Nature of This Service",
    content: "WI Upskill Mock Test is a private English language practice tool operated by WI Education Global Pvt. Ltd. It is designed exclusively for IELTS preparation practice across four modules: Reading, Writing, Listening, and Speaking.\n\nThis service is targeted at learners operating at the A1 to B1 level on the Common European Framework of Reference (CEFR). It is NOT affiliated with, endorsed by, or connected to the British Council, IDP Education, Cambridge Assessment English, or any other official IELTS administering body.",
  },
  {
    title: "2. Practice-Only Disclaimer",
    content: "BY USING THIS SERVICE, YOU EXPLICITLY ACKNOWLEDGE AND AGREE THAT:\n\n- This is a PRACTICE TOOL ONLY. It does not simulate the actual IELTS examination.\n- The questions, tasks, listening materials, and writing prompts provided in this application are created solely for practice purposes.\n- NONE of the questions or content in this application will be replicated in any real IELTS examination or any other official English language test.\n- WI Education Global Pvt. Ltd. makes NO CLAIM that this content matches real exam questions.\n- Scores and CEFR grade estimates (A1, A2, B1) are indicative only and do NOT reflect official IELTS band scores or any certified language proficiency level.\n- Use of this tool does not guarantee any specific result in any official examination.",
  },
  {
    title: "3. Payment and Strict Refund Policy",
    content: "The one-time access fee is NPR 1,500.\n\nNO REFUND POLICY: Payment is strictly and completely non-refundable under any circumstances. This includes but is not limited to:\n- Change of mind after purchase\n- Dissatisfaction with content or scores\n- Failure in any official examination\n- Technical issues on the user side (device, internet, browser)\n- Account inactivity or unused access\n- Misunderstanding of the nature of the service\n\nThe only exception is a verifiable technical failure on WI Education Global Pvt. Ltd.'s servers that permanently prevented access from the time of payment. Such claims must be raised within 48 hours of payment via email to snit.education@gmail.com with proof of payment.",
  },
  {
    title: "4. Level and Scope",
    content: "This application is designed for learners at the A1 to B1 CEFR level. It provides practice across the four IELTS modules:\n\n- Reading: Comprehension passages and multiple-choice or short-answer questions.\n- Writing: Task prompts evaluated by AI against practice criteria.\n- Listening: Audio-based comprehension tasks.\n- Speaking: Prompt-based spoken responses evaluated by AI.\n\nThis tool is NOT appropriate as a standalone preparation resource for learners targeting IELTS Band 6.0 or above.",
  },
  {
    title: "5. User Responsibilities",
    content: "You agree to:\n- Use this platform for personal study only.\n- Not share, sell, or transfer your account credentials to any other person.\n- Not reproduce, screenshot, copy, distribute, or resell any content from this application.\n- Not attempt to extract or reverse-engineer the question bank, audio files, or evaluation models.\n- Provide accurate personal information during registration.",
  },
  {
    title: "6. Account Access",
    content: "Access is granted to one individual only. Accounts found to be shared will be suspended immediately without refund. WI Education Global Pvt. Ltd. reserves the right to revoke access at any time if these terms are violated.",
  },
  {
    title: "7. Privacy",
    content: "We collect your name, email address, and mobile number for account management purposes only. Your data will not be sold or shared with third parties. Practice results are stored to track your progress within the application.",
  },
  {
    title: "8. Intellectual Property",
    content: "All content in this application, including practice questions, writing prompts, listening transcripts, speaking tasks, and evaluation rubrics, is the intellectual property of WI Education Global Pvt. Ltd. Unauthorised reproduction or distribution is strictly prohibited and may result in legal action.",
  },
  {
    title: "9. Limitation of Liability",
    content: "WI Education Global Pvt. Ltd. is not liable for:\n- Any examination result, band score, or assessment outcome.\n- Indirect, incidental, or consequential damages of any kind.\n- Data loss due to user-side technical failures.\n- Decisions made by third parties based on scores from this application.\n\nTotal liability under these terms shall not exceed the amount paid by the user (NPR 1,500).",
  },
  {
    title: "10. Changes to Terms",
    content: "WI Education Global Pvt. Ltd. reserves the right to update these terms at any time. Continued use of the application after changes constitutes acceptance of the updated terms. We will not notify users of minor updates.",
  },
  {
    title: "11. Contact",
    content: "For queries or verifiable access issues, contact:\nEmail: snit.education@gmail.com\nWhatsApp: +977 9869400285\n\nResponse time: 1 to 3 business days.",
  },
];

export default function TermsPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#fbf9f8" }}>

      {/* Header */}
      <div style={{ background: "#000b21", padding: "16px 20px 20px" }}>
        <button
          onClick={() => router.back()}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 0, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#fff", marginBottom: 16 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          <span style={{ ...INTER, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>BACK</span>
        </button>
        <h1 style={{ ...CASLON, color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Terms & Conditions</h1>
        <p style={{ ...INTER, color: "rgba(255,255,255,0.6)", fontSize: 12 }}>WI Upskill Mock Test — WI Education Global Pvt. Ltd.</p>
      </div>

      {/* Disclaimer banner */}
      <div style={{ background: "#fff8e1", borderBottom: "2px solid #ffe082", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#775a19", flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1" }}>warning</span>
        <div>
          <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#775a19", marginBottom: 4 }}>Read Before You Pay</p>
          <p style={{ ...INTER, fontSize: 12, color: "#4a3900", lineHeight: 1.6 }}>
            Payment is strictly non-refundable. This is a practice tool only — questions here will NOT appear in any official IELTS or other exam.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "24px 16px 40px", overflowY: "auto" }}>
        <p style={{ ...INTER, fontSize: 11, color: "#75777e", marginBottom: 24 }}>Last updated: June 2026</p>

        {sections.map((s, i) => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ ...CASLON, fontSize: 15, fontWeight: 700, color: "#000b21", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #eae8e7" }}>{s.title}</h2>
            <p style={{ ...INTER, fontSize: 13, color: "#2d2f33", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{s.content}</p>
          </div>
        ))}

        {/* Acceptance box */}
        <div style={{ background: "#fff", border: "1px solid #c4c6ce", borderLeft: "3px solid #000b21", padding: 16, marginTop: 8 }}>
          <p style={{ ...INTER, fontSize: 13, color: "#000b21", lineHeight: 1.7, fontWeight: 500 }}>
            By creating an account and making payment, you confirm that you have read, understood, and fully agreed to these Terms & Conditions, including the strict no-refund policy.
          </p>
        </div>
      </div>
    </div>
  );
}
