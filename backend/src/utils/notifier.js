const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text){
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[notifier] To: ${to} | Subject: ${subject} | Text: ${text}`);
    return { sent: false, reason: 'SMTP is not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  try{
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
    console.log('[notifier] email sent to', to);
    return { sent: true };
  }catch(err){
    console.error('[notifier] email error', err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = sendEmail;

module.exports.generateWorkspaceInvitation = async function generateWorkspaceInvitation({
  memberName,
  creatorName,
  projectName,
  description,
  department,
  projectUrl
}) {
  const fallback = {
    subject: `You have been invited to ${projectName}`,
    body: `Hello ${memberName},\n\n${creatorName} added you to the workspace "${projectName}"${department ? ` in the ${department} department` : ''}.\n\n${description || 'You can now collaborate with the team in this workspace.'}\n\nYou can view the workspace, add notes, upload files, and contribute to project activity.\n\nOpen the workspace: ${projectUrl}\n\nPlease sign in with this email address to continue.\n\nCityCare Hospital`
  };

  if (!process.env.GROQ_API_KEY) return fallback;

  const prompt = `Write a professional, warm workspace invitation email for a hospital collaboration platform. Return ONLY valid JSON with exactly two string fields: subject and body. Do not use markdown fences. Keep the subject under 90 characters and the body under 180 words. Mention the project name, creator, department if available, the project purpose, the workspace link, and that the member can add notes, upload files, and contribute. Do not invent facts.

Member: ${memberName}
Creator: ${creatorName}
Workspace: ${projectName}
Department: ${department || 'General'}
Description: ${description || 'No description provided'}
Workspace link: ${projectUrl}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        messages: [
          { role: 'system', content: 'You write concise professional email invitations.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) return fallback;
    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content?.trim() || '';
    const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/gi, '').trim());

    if (typeof parsed.subject === 'string' && typeof parsed.body === 'string' && parsed.subject.trim() && parsed.body.trim()) {
      return { subject: parsed.subject.trim(), body: parsed.body.trim() };
    }
  } catch (error) {
    console.warn('[notifier] AI invitation generation failed:', error.message);
  }

  return fallback;
};
