import React from "react";

const DailyGoalReminderEmail = ({ name }:{name:string}) => {
const actionUrl = process.env.NEXT_PUBLIC_BASE_URL + "/topics";
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backgroundColor: "#fff7ed",
        color: "#0f172a",
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        borderRadius: "8px",
        border: "1px solid #fed7aa",
      }}
    >
      {/* EduNex Header */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ color: "#ea580c", fontSize: "28px", fontWeight: "700" }}>
          EduNex
        </h1>
      </div>

      {/* Greeting */}
      <h2 style={{ color: "#ea580c", marginBottom: "1rem" }}>
        👋 Hey {name},
      </h2>

      {/* Message */}
      <p style={{ fontSize: "16px", marginBottom: "1.5rem" }}>
        Just a friendly nudge to help you stay on track with your learning
        goals. You've got this!
      </p>


      {/* CTA Button */}
      <a
        href={actionUrl}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#ea580c",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "600",
        }}
      >
        Complete My Goals
      </a>

      {/* Footer */}
      <p style={{ fontSize: "14px", marginTop: "2rem", color: "#475569" }}>
        Stay consistent and you'll see progress every day. Happy learning! 🚀
      </p>

      <p style={{ fontSize: "13px", marginTop: "2rem", color: "#94a3b8" }}>
        If this wasn't for you, feel free to ignore this email.
      </p>
    </div>
  );
};

export default DailyGoalReminderEmail;
