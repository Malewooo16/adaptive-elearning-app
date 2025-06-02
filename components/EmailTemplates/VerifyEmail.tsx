import React from 'react';


interface WelcomeEmailProps {
  userName: string;
    verificationLink: string;
}
const WelcomeEmail = ({ userName, verificationLink }: WelcomeEmailProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#fff7ed',
        margin: 0,
        padding: '40px 0',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 28 }}>Welcome to EduNex 🚀</h1>
        </div>

        <div style={{ padding: 32, color: '#374151', fontSize: 16, lineHeight: 1.6 }}>
          <p>
            Hi <strong>{userName}</strong>,
          </p>

          <p>
            We're thrilled to have you on board! To get started, please verify your email
            address by clicking the button below:
          </p>

          <a
            href={verificationLink}
            style={{
              display: 'inline-block',
              marginTop: 24,
              padding: '12px 24px',
              backgroundColor: '#f97316',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Verify Email
          </a>

          <p style={{ marginTop: 32 }}>
            If you didn’t sign up, you can safely ignore this email.
          </p>

          <p>Happy Learning!<br />— The EduNex Team</p>
        </div>

        <div
          style={{
            textAlign: 'center',
            padding: 24,
            fontSize: 14,
            color: '#9ca3af',
          }}
        >
          &copy; {currentYear} Adaptive Learn. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default WelcomeEmail;
