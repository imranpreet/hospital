const express = require('express');
const router = express.Router();
const geminiRouter = express.Router();
const groqRouter = express.Router();
const Doctor = require('../models/Doctor');

const departmentKeywords = [
  { department: 'Cardiology', keywords: ['chest pain', 'heart', 'palpitation', 'shortness of breath', 'breathlessness', 'pressure', 'tightness'] },
  { department: 'Neurology', keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'numbness', 'weakness', 'brain', 'confusion'] },
  { department: 'Pediatrics', keywords: ['child', 'baby', 'fever in child', 'cough in child', 'kid', 'infant', 'pediatric'] },
  { department: 'Orthopedics', keywords: ['joint pain', 'back pain', 'bone', 'knee', 'leg pain', 'arm pain', 'fracture', 'sprain', 'ankle'] },
  { department: 'Dermatology', keywords: ['rash', 'skin', 'acne', 'itching', 'hives', 'eczema', 'allergy on skin'] },
  { department: 'Gynecology', keywords: ['pregnancy', 'period', 'menstrual', 'pelvic pain', 'women health', 'vaginal', 'fertility'] },
  { department: 'General Medicine', keywords: ['fever', 'cough', 'cold', 'flu', 'sore throat', 'infection', 'body ache', 'fatigue'] }
];

function matchDepartment(symptoms) {
  const text = (symptoms || '').toLowerCase();

  for (const entry of departmentKeywords) {
    if (entry.keywords.some(keyword => text.includes(keyword))) {
      return entry.department;
    }
  }

  return 'General Medicine';
}

function parseAssistantJson(rawContent) {
  if (!rawContent) return null;

  try {
    const clean = rawContent.replace(/```json|```/gi, '').trim();
    return JSON.parse(clean);
  } catch (error) {
    const match = rawContent.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerError) {
        return null;
      }
    }
    return null;
  }
}

function buildLocalMedicalGuidance(symptoms, department) {
  const text = (symptoms || '').toLowerCase();
  const hasFever = text.includes('fever');
  const hasCough = text.includes('cough');
  const hasChestPain = text.includes('chest pain') || text.includes('heart');
  const hasHeadache = text.includes('headache') || text.includes('migraine');
  const hasRash = text.includes('rash') || text.includes('itching') || text.includes('skin');
  const hasJointPain = text.includes('joint pain') || text.includes('knee') || text.includes('back pain');
  const hasBreathingIssue = text.includes('breath') || text.includes('shortness');

  let summary = 'Your symptoms may need a proper clinical review. Please speak with a doctor if they persist or worsen.';
  let advice = 'Stay hydrated, rest, and continue monitoring your symptoms. Seek care sooner if they get worse or you develop severe symptoms.';
  let severity = 'moderate';

  if (hasFever || hasCough) {
    summary = 'These symptoms may be consistent with a common infection or seasonal illness, but a doctor should confirm the cause.';
    advice = 'Rest, drink fluids, and consult a doctor if fever continues for more than 48-72 hours or if breathing becomes difficult.';
  }

  if (hasChestPain || hasBreathingIssue) {
    summary = 'Chest pain or breathing difficulty should be taken seriously and needs urgent clinical review.';
    advice = 'If the pain is severe or you have shortness of breath, seek immediate emergency care.';
    severity = 'high';
  }

  if (hasHeadache) {
    summary = 'Headaches can be caused by common triggers, but persistent or severe headaches should be assessed by a clinician.';
    advice = 'Monitor the pattern and intensity, and consult a doctor if the headache is severe, sudden, or associated with weakness or confusion.';
  }

  if (hasRash) {
    summary = 'A skin rash may be due to irritation, allergy, or infection and may need assessment based on severity and spread.';
    advice = 'Seek care if the rash is spreading, painful, or accompanied by fever or swelling.';
  }

  if (hasJointPain) {
    summary = 'Joint or bone symptoms may need a musculoskeletal review to rule out inflammation, strain, or injury.';
    advice = 'Rest the area and see a doctor if pain is worsening, severe, or affects movement.';
  }

  return {
    summary,
    advice,
    severity,
    recommendedDepartment: department || 'General Medicine',
    emergency: hasChestPain || hasBreathingIssue
  };
}

function getNoteFocus(text) {
  const lower = text.toLowerCase();

  if (/(improved|better|stable|recover|healing|response)/.test(lower)) {
    return 'patient improvement and response to care';
  }
  if (/(diet|nutrition|food|hydration|meal)/.test(lower)) {
    return 'dietary and nutrition follow-up';
  }
  if (/(pain|ache|sore|swelling|fracture|injury)/.test(lower)) {
    return 'pain or physical condition monitoring';
  }
  if (/(fever|cough|rash|infection|flu|cold)/.test(lower)) {
    return 'symptom tracking and clinical monitoring';
  }
  if (/(medication|dose|tablet|injection|treatment)/.test(lower)) {
    return 'medication and treatment status';
  }
  if (/(follow-up|review|consult|observation|monitor)/.test(lower)) {
    return 'care plan and follow-up planning';
  }

  return 'clinical observation and patient status tracking';
}

function getNoteType(text) {
  const lower = text.toLowerCase();

  if (/(improved|better|stable|recovered|response)/.test(lower)) {
    return 'progress update';
  }
  if (/(diet|nutrition|meal|hydration)/.test(lower)) {
    return 'dietary note';
  }
  if (/(medication|tablet|dose|injection|treatment)/.test(lower)) {
    return 'treatment note';
  }
  if (/(follow-up|review|plan|monitor|observation)/.test(lower)) {
    return 'care plan note';
  }

  return 'clinical observation';
}

function buildNoteAssistantResponse(mode, content) {
  const text = String(content || '').trim();
  if (!text) {
    return { result: 'Please add note content before asking for help.' };
  }

  const noteType = getNoteType(text);
  const focus = getNoteFocus(text);
  const shortContext = text.length > 170 ? `${text.slice(0, 170)}...` : text;

  if (mode === 'improve') {
    const action = /(follow-up|review|monitor|observation)/i.test(text)
      ? 'Monitor the patient closely and confirm the next follow-up plan.'
      : /(diet|nutrition|hydration|meal)/i.test(text)
        ? 'Reinforce nutrition and hydration guidance and document adherence.'
        : /(improved|better|stable)/i.test(text)
          ? 'Continue the current treatment plan and reassess progress during the next review.'
          : 'Document the current condition clearly and align the next action with the observed findings.';

    return {
      result: `Suggested improvement:\n\n### Improved note\n**Observation:** ${text}\n\n**Clinical summary:** This is recorded as a ${noteType} focused on ${focus}.\n\n**Assessment:** The note should clearly describe the current condition, any relevant change, and why it matters.\n\n**Plan:** ${action}\n\n**Action items:**\n- Record the current status clearly\n- Note any improvement or risk\n- Define follow-up steps and responsibility`
    };
  }

  return {
    result: `Explanation:\nThis note is describing a ${noteType} related to ${focus}. The purpose is to record what is happening, why it matters, and what should happen next.\n\nSummary:\n- Current focus: ${focus}\n- Clinical meaning: the note captures an ongoing patient or staff observation\n- Next step: document follow-up actions, monitoring, or treatment adjustment\n\nOriginal note context:\n${shortContext}`
  };
}

function isCodeLikeFile(fileName = '') {
  const name = String(fileName || '').toLowerCase();
  return /\.(js|jsx|ts|tsx|py|java|cs|json|html|css|md|sql|php|rb|go|rs|swift|c|cpp|h|hpp|yml|yaml)$/i.test(name);
}

function getSafeCodeContent(code) {
  const text = String(code || '').trim();
  return text.length > 25000 ? text.slice(0, 25000) : text;
}

async function generateCodeExplanation(code, fileName = 'file') {
  const safeCode = getSafeCodeContent(code);
  if (!safeCode) {
    return 'Please provide valid code content to explain.';
  }

  const prompt = `Explain the following code in a simple and professional way.\n- Clearly describe what the code does.\n- Explain the main logic, inputs, outputs, and possible edge cases.\n- If there are issues, point them out gently.\n- Keep the explanation structured and easy to understand.\n\nFile: ${fileName || 'code'}\n\nCode:\n${safeCode}`;

  const geminiResult = await getGeminiResponse(prompt);
  if (geminiResult) return geminiResult;

  const groqResult = await getGroqResponse(prompt);
  if (groqResult) return groqResult;

  return `Code summary for ${fileName || 'this file'}:\n\nThis file appears to be source code. The main purpose is to perform a specific task or logic flow, and the exact behavior depends on the functions, imports, and data transformations used within it.\n\nA quick review suggests:\n- Identify the top-level function or entry point\n- Check how inputs are processed\n- Validate returned values or side effects\n- Review edge cases, error handling, and API calls\n\nIf you want a deeper review, paste the file contents and I can break it down step by step.`;
}

async function generateCodeExplanationWithProvider(code, fileName = 'file', provider = 'gemini') {
  const safeCode = getSafeCodeContent(code);
  if (!safeCode) {
    return 'Please provide valid code content to explain.';
  }

  const prompt = `Explain the following code in a simple and professional way.\n- Clearly describe what the code does.\n- Explain the main logic, inputs, outputs, and possible edge cases.\n- If there are issues, point them out gently.\n- Keep the explanation structured and easy to understand.\n\nFile: ${fileName || 'code'}\n\nCode:\n${safeCode}`;

  if (provider === 'gemini') {
    const result = await getGeminiResponse(prompt);
    if (result) return result;
    return 'Gemini is not available right now. Please try the Groq route or retry later.';
  }

  if (provider === 'groq') {
    const result = await getGroqResponse(prompt);
    if (result) return result;
    return 'Groq is not available right now. Please try the Gemini route or retry later.';
  }

  return generateCodeExplanation(code, fileName);
}

async function generateProjectDocs(code, fileName = 'project file') {
  const safeCode = getSafeCodeContent(code);
  if (!safeCode) {
    return 'Please provide code content to generate documentation.';
  }

  const prompt = `Generate clear project documentation for the following code. Include a short overview, main components, key functions, inputs/outputs, and usage notes.\n\nFile: ${fileName}\n\nCode:\n${safeCode}`;

  const geminiResult = await getGeminiResponse(prompt);
  if (geminiResult) return geminiResult;

  const groqResult = await getGroqResponse(prompt);
  if (groqResult) return groqResult;

  return `# ${fileName}\n\n## Overview\nThis file contains application logic relevant to the current project.\n\n## Main responsibilities\n- Process inputs\n- Execute business logic\n- Return or store output\n\n## Notes\nReview the function names and data flow carefully before making changes.`;
}

async function generateProjectDocsWithProvider(code, fileName = 'project file', provider = 'gemini') {
  const safeCode = getSafeCodeContent(code);
  if (!safeCode) {
    return 'Please provide code content to generate documentation.';
  }

  const prompt = `Generate clear project documentation for the following code. Include a short overview, main components, key functions, inputs/outputs, and usage notes.\n\nFile: ${fileName}\n\nCode:\n${safeCode}`;

  if (provider === 'gemini') {
    const result = await getGeminiResponse(prompt);
    if (result) return result;
    return 'Gemini documentation generation is unavailable right now.';
  }

  if (provider === 'groq') {
    const result = await getGroqResponse(prompt);
    if (result) return result;
    return 'Groq documentation generation is unavailable right now.';
  }

  return generateProjectDocs(code, fileName);
}

async function generateReadmeWithProvider(projectDescription, codeOverview = '', provider = 'gemini') {
  const titleField = typeof projectDescription === 'object' && projectDescription !== null ? projectDescription.title : '';
  const descriptionField = typeof projectDescription === 'object' && projectDescription !== null ? projectDescription.description : projectDescription;
  const codeText = typeof projectDescription === 'object' && projectDescription !== null ? String(projectDescription.codeOverview || codeOverview || '') : String(codeOverview || '');

  const title = String(titleField || 'Project README').trim();
  const description = String(descriptionField || '').trim();
  const safeCodeText = codeText.trim();

  const prompt = `Create a polished README.md for this project. Include the title, overview, features, setup, usage, and notes. Make it professional and easy to understand for a healthcare or hospital workflow.\n\nProject title:\n${title}\n\nProject description:\n${description || 'Project description not provided'}\n\nCode overview:\n${safeCodeText || 'No code details provided'}`;

  if (provider === 'gemini') {
    const result = await getGeminiResponse(prompt);
    if (result) return result;
    return 'Gemini README generation is unavailable right now.';
  }

  if (provider === 'groq') {
    const result = await getGroqResponse(prompt);
    if (result) return result;
    return 'Groq README generation is unavailable right now.';
  }

  return generateReadme(projectDescription, codeOverview);
}

function looksLikeHealthIssue(title = '', description = '') {
  const combined = `${title || ''} ${description || ''}`.toLowerCase();
  const healthKeywords = [
    'headache', 'migraine', 'pain', 'fever', 'cough', 'rash', 'vomit', 'nausea',
    'dizziness', 'fatigue', 'symptom', 'illness', 'ache', 'infection', 'injury',
    'problem', 'health', 'suffering', 'weakness', 'breath', 'chest', 'pressure'
  ];

  return healthKeywords.some((keyword) => combined.includes(keyword));
}

async function generateHealthGuidanceDocument(title, description) {
  const issueTitle = String(title || 'Health concern').trim() || 'Health concern';
  const problemText = String(description || '').trim();
  const symptomSummary = problemText || 'The user is describing an ongoing health issue.';

  const prompt = `Give clear, practical, empathetic medical guidance for this patient issue. Keep it safe and general, not a diagnosis. Include: what the issue may suggest, immediate self-care steps, warning signs, and when to see a doctor. Make it simple and useful for the user.\n\nIssue title: ${issueTitle}\nProblem description: ${symptomSummary}`;

  const geminiResult = await getGeminiResponse(prompt);
  if (geminiResult) return geminiResult;

  const groqResult = await getGroqResponse(prompt);
  if (groqResult) return groqResult;

  const lowerText = `${issueTitle} ${problemText}`.toLowerCase();
  const isMigraine = /(migraine|headache|head ache)/.test(lowerText);
  const isFever = /(fever)/.test(lowerText);
  const isBreathing = /(breath|chest|difficulty breathing|shortness)/.test(lowerText);
  const isRash = /(rash|skin)/.test(lowerText);
  const isPain = /(pain|ache|injury|swelling)/.test(lowerText);

  let issueSummary = 'This description suggests a medical issue that should be reviewed and monitored carefully.';
  if (isMigraine) {
    issueSummary = 'This pattern can be consistent with recurring headache or migraine symptoms, especially if it continues for several days.';
  } else if (isFever) {
    issueSummary = 'This may be a sign of an infection or another illness that needs proper evaluation.';
  } else if (isBreathing) {
    issueSummary = 'Breathing or chest-related symptoms should be taken seriously and assessed promptly.';
  } else if (isRash) {
    issueSummary = 'Skin symptoms can be caused by irritation, infection, or allergic reactions and need observation.';
  } else if (isPain) {
    issueSummary = 'Persistent pain needs assessment to understand the trigger and next steps.';
  }

  const adviceBullets = isMigraine
    ? [
        'Rest in a quiet, dark room and reduce screen time if possible.',
        'Drink water and eat regularly to avoid dehydration or skipped meals.',
        'Avoid obvious triggers such as stress, poor sleep, loud noise, or bright lights.',
        'If headaches are severe, frequent, or worsening, consult a doctor or neurologist.'
      ]
    : [
        'Rest, stay hydrated, and monitor the symptoms closely.',
        'Avoid overexertion and reduce stress where possible.',
        'Keep a note of frequency, duration, and triggers.',
        'See a doctor if symptoms persist, worsen, or start interfering with daily activities.'
      ];

  const emergencyNote = isBreathing
    ? 'Seek urgent medical care immediately if you have chest pain, severe shortness of breath, or dizziness.'
    : 'Seek urgent care sooner if symptoms become severe, sudden, or are accompanied by confusion, weakness, fever, fainting, or difficulty speaking.';

  return `# ${issueTitle}\n\n## Overview\n${issueSummary}\n\n**User concern:** ${symptomSummary}\n\n## What to do now\n${adviceBullets.map((item) => `- ${item}`).join('\n')}\n\n## Warning signs\n- Symptoms are worsening or not improving\n- Severe pain or sudden new onset of symptoms\n- Fever, vomiting, confusion, weakness, or fainting\n- Vision changes, severe dizziness, or severe headache\n\n## When to consult a doctor\nPlease speak with a doctor if the problem continues for more than a few days, comes back often, or starts to affect daily work or sleep. A clinician can review the cause and advise the right treatment or specialist.\n\n## Important note\n${emergencyNote}\n\n## Suggested follow-up\n1. Track the severity and timing of symptoms\n2. Note any triggers such as stress, sleep, diet, or screens\n3. Book a medical review if symptoms continue or worsen`;
}

async function generateReadme(projectDescription, codeOverview = '') {
  const titleField = typeof projectDescription === 'object' && projectDescription !== null ? projectDescription.title : '';
  const descriptionField = typeof projectDescription === 'object' && projectDescription !== null ? projectDescription.description : projectDescription;
  const codeText = typeof projectDescription === 'object' && projectDescription !== null ? String(projectDescription.codeOverview || codeOverview || '') : String(codeOverview || '');

  const title = String(titleField || 'Project README').trim();
  const description = String(descriptionField || '').trim();
  const safeCodeText = codeText.trim();

  const looksHealthRelated = looksLikeHealthIssue(title, description);

  if (looksHealthRelated) {
    return generateHealthGuidanceDocument(title, description);
  }

  if (!description && !safeCodeText) {
    return 'Please provide project description or code overview to generate a README.';
  }

  const prompt = `Create a polished README.md for this project. Include the title, overview, features, setup, usage, and notes. Make it professional and easy to understand for a healthcare or hospital workflow.\n\nProject title:\n${title}\n\nProject description:\n${description || 'Project description not provided'}\n\nCode overview:\n${safeCodeText || 'No code details provided'}`;

  const geminiResult = await getGeminiResponse(prompt);
  if (geminiResult) return geminiResult;

  const groqResult = await getGroqResponse(prompt);
  if (groqResult) return groqResult;

  const overview = description || 'This project contains a modern healthcare workflow with secure collaboration, AI assistance, and clear documentation.';

  return `# ${title}\n\n## Overview\n${overview}\n\n## Key Features\n- Clear project structure and healthcare workflow\n- User-friendly dashboards and records management\n- AI-assisted explanations and documentation\n- Read-only public sharing for project visibility\n\n## Getting Started\n1. Install dependencies\n2. Configure environment variables\n3. Start the backend service\n4. Start the frontend app\n5. Use the dashboard and project tools\n\n## Usage\nThis project is designed to help teams work together efficiently while keeping patient and operational information organized and accessible.\n\n## Notes\nUse this document as the public summary of the project for users, stakeholders, or visitors who need a reliable overview.`;
}

async function getGeminiResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Gemini request failed');
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    return text.trim() || null;
  } catch (error) {
    console.warn('Gemini provider failed:', error.message);
    return null;
  }
}

async function getGroqResponse(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        messages: [
          { role: 'system', content: 'You are a medical documentation assistant. Help explain and improve hospital notes clearly and professionally.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Groq request failed');
    }

    const json = await response.json();
    return json?.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn('Groq provider failed:', error.message);
    return null;
  }
}

router.post('/note-assist', async (req, res) => {
  try {
    const { note, mode } = req.body;
    if (!note || !String(note).trim()) {
      return res.status(400).json({ msg: 'Please provide note content.' });
    }

    const finalMode = mode === 'improve' ? 'improve' : 'explain';
    const localResult = buildNoteAssistantResponse(finalMode, note);
    const prompt = finalMode === 'improve'
      ? `Improve this clinical/operations note for clarity and structure. Keep it professional and concise.\n\nNote:\n${note}`
      : `Explain this clinical or operational note in simple, clear language for hospital staff.\n\nNote:\n${note}`;

    const geminiResult = await getGeminiResponse(prompt);
    if (geminiResult) {
      return res.json({ result: geminiResult });
    }

    const groqResult = await getGroqResponse(prompt);
    if (groqResult) {
      return res.json({ result: groqResult });
    }

    res.json(localResult);
  } catch (error) {
    console.error('Note assistant error:', error);
    res.status(500).json({ msg: 'Could not process note at the moment.' });
  }
});

router.post('/explain-code', async (req, res) => {
  try {
    const { code, fileName } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ msg: 'Please provide code content to explain.' });
    }

    const explanation = await generateCodeExplanation(code, fileName || 'code-file');
    return res.json({ explanation });
  } catch (error) {
    console.error('Explain-code route error:', error);
    res.status(500).json({ msg: 'Could not explain the code right now.' });
  }
});

router.post('/gemini/explain', async (req, res) => {
  try {
    const { code, fileName, text } = req.body;
    const payload = code ?? text ?? '';
    if (!payload || !String(payload).trim()) {
      return res.status(400).json({ msg: 'Please provide code or text to explain.' });
    }

    const explanation = await generateCodeExplanation(payload, fileName || 'code-file');
    return res.json({ explanation });
  } catch (error) {
    console.error('Gemini explain alias error:', error);
    res.status(500).json({ msg: 'Could not explain the provided content.' });
  }
});

router.post('/gemini/docs', async (req, res) => {
  try {
    const { code, fileName } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ msg: 'Please provide code to document.' });
    }

    const docs = await generateProjectDocs(code, fileName || 'project-file');
    return res.json({ documentation: docs });
  } catch (error) {
    console.error('Gemini docs alias error:', error);
    res.status(500).json({ msg: 'Could not generate documentation.' });
  }
});

router.post('/readme', async (req, res) => {
  try {
    const { title, description, codeOverview } = req.body || {};
    const readme = await generateReadme({ title, description, codeOverview }, codeOverview || '');
    return res.json({ readme });
  } catch (error) {
    console.error('README generation route error:', error);
    res.status(500).json({ msg: 'Could not generate README.' });
  }
});

geminiRouter.post('/explain', async (req, res) => {
  try {
    const { code, fileName, text } = req.body;
    const payload = code ?? text ?? '';
    if (!payload || !String(payload).trim()) {
      return res.status(400).json({ msg: 'Please provide code or text to explain.' });
    }

    const explanation = await generateCodeExplanationWithProvider(payload, fileName || 'code-file', 'gemini');
    return res.json({ explanation });
  } catch (error) {
    console.error('Gemini explain route error:', error);
    res.status(500).json({ msg: 'Could not explain the provided content.' });
  }
});

geminiRouter.post('/docs', async (req, res) => {
  try {
    const { code, fileName } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ msg: 'Please provide code to document.' });
    }

    const docs = await generateProjectDocsWithProvider(code, fileName || 'project-file', 'gemini');
    return res.json({ documentation: docs });
  } catch (error) {
    console.error('Gemini docs route error:', error);
    res.status(500).json({ msg: 'Could not generate documentation.' });
  }
});

geminiRouter.post('/readme', async (req, res) => {
  try {
    const { title, description, codeOverview } = req.body || {};
    const readme = await generateReadmeWithProvider({ title, description, codeOverview }, codeOverview || '', 'gemini');
    return res.json({ readme });
  } catch (error) {
    console.error('Gemini readme route error:', error);
    res.status(500).json({ msg: 'Could not generate README.' });
  }
});

groqRouter.post('/explain', async (req, res) => {
  try {
    const { code, fileName, text } = req.body;
    const payload = code ?? text ?? '';
    if (!payload || !String(payload).trim()) {
      return res.status(400).json({ msg: 'Please provide code or text to explain.' });
    }

    const explanation = await generateCodeExplanationWithProvider(payload, fileName || 'code-file', 'groq');
    return res.json({ explanation });
  } catch (error) {
    console.error('Groq explain route error:', error);
    res.status(500).json({ msg: 'Could not explain the provided content.' });
  }
});

groqRouter.post('/docs', async (req, res) => {
  try {
    const { code, fileName } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ msg: 'Please provide code to document.' });
    }

    const docs = await generateProjectDocsWithProvider(code, fileName || 'project-file', 'groq');
    return res.json({ documentation: docs });
  } catch (error) {
    console.error('Groq docs route error:', error);
    res.status(500).json({ msg: 'Could not generate documentation.' });
  }
});

groqRouter.post('/readme', async (req, res) => {
  try {
    const { title, description, codeOverview } = req.body || {};
    const readme = await generateReadmeWithProvider({ title, description, codeOverview }, codeOverview || '', 'groq');
    return res.json({ readme });
  } catch (error) {
    console.error('Groq readme route error:', error);
    res.status(500).json({ msg: 'Could not generate README.' });
  }
});

router.post('/gemini/readme', async (req, res) => {
  try {
    const { title, description, codeOverview } = req.body || {};
    const readme = await generateReadme({ title, description, codeOverview }, codeOverview || '');
    return res.json({ readme });
  } catch (error) {
    console.error('Gemini readme alias error:', error);
    res.status(500).json({ msg: 'Could not generate README.' });
  }
});

router.post('/assess', async (req, res) => {
  try {
    const { symptoms, patientName } = req.body;

    if (!symptoms || !String(symptoms).trim()) {
      return res.status(400).json({ msg: 'Please describe the symptoms or illness first.' });
    }

    const recommendedDepartment = matchDepartment(symptoms);
    const doctors = await Doctor.find({
      department: { $regex: recommendedDepartment, $options: 'i' }
    }).limit(5).lean();

    const doctorSuggestions = doctors.map((doctor) => ({
      id: doctor._id.toString(),
      name: doctor.name,
      department: doctor.department,
      specialization: doctor.specialization || 'Specialist'
    }));

    const prompt = `You are a medical support assistant. Provide general health guidance only, not a diagnosis. The patient says: "${symptoms}".\n\nReturn valid JSON only with this exact structure:\n{\n  "summary": "brief 2-3 sentence explanation of likely concern and what it may indicate in general terms",\n  "advice": "clear advice what the patient should do now and when to seek medical care",\n  "severity": "mild|moderate|high",\n  "recommendedDepartment": "one department name only, like General Medicine or Cardiology",\n  "emergency": false\n}\n\nDo not claim certainty. Recommend a doctor consultation when symptoms are persistent, worsening, or severe.`;

    let aiData = buildLocalMedicalGuidance(symptoms, recommendedDepartment);

    const geminiMedicalResponse = process.env.GEMINI_API_KEY ? await getGeminiResponse(prompt) : null;
    if (geminiMedicalResponse) {
      const parsed = parseAssistantJson(geminiMedicalResponse);
      if (parsed) {
        aiData = { ...aiData, ...parsed };
      }
    }

    if (!geminiMedicalResponse && process.env.GROQ_API_KEY) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
            messages: [
              { role: 'system', content: 'You are a helpful clinical assistant. Respond as a medical information guide and never claim to diagnose a patient definitively.' },
              { role: 'user', content: prompt }
            ]
          })
        });

        if (groqResponse.ok) {
          const json = await groqResponse.json();
          const rawContent = json?.choices?.[0]?.message?.content || '{}';
          aiData = parseAssistantJson(rawContent) || aiData;
        }
      } catch (error) {
        console.warn('Groq fallback triggered:', error.message);
      }
    }

    const finalDepartment = aiData.recommendedDepartment || recommendedDepartment;
    const fallbackDoctors = doctorSuggestions.length
      ? doctorSuggestions
      : [{
          id: null,
          name: 'General Medicine Doctor',
          department: finalDepartment,
          specialization: 'Consultation'
        }];

    const responsePayload = {
      summary: aiData.summary || `The symptoms described may need medical evaluation. ${patientName ? `For ${patientName},` : 'For the patient,'} please speak with a doctor if the condition is ongoing or worsening.`,
      advice: aiData.advice || 'Stay hydrated, rest, and consult a doctor if symptoms worsen, persist more than a few days, or are severe.',
      severity: aiData.severity || 'moderate',
      emergency: Boolean(aiData.emergency),
      recommendedDepartment: finalDepartment,
      doctorSuggestions: fallbackDoctors,
      suggestedDoctor: fallbackDoctors[0] || null
    };

    res.json(responsePayload);
  } catch (error) {
    console.error('AI assessment error:', error);
    const fallbackDepartment = matchDepartment(req.body?.symptoms || '');
    const fallback = buildLocalMedicalGuidance(req.body?.symptoms || '', fallbackDepartment);

    res.json({
      msg: 'AI assistant is temporarily unavailable, but the medical guidance below is still useful.',
      summary: fallback.summary,
      advice: fallback.advice,
      severity: fallback.severity,
      emergency: fallback.emergency,
      recommendedDepartment: fallbackDepartment,
      doctorSuggestions: [{
        id: null,
        name: 'Recommended Specialist',
        department: fallbackDepartment,
        specialization: 'Consultation'
      }],
      suggestedDoctor: {
        id: null,
        name: 'Recommended Specialist',
        department: fallbackDepartment,
        specialization: 'Consultation'
      }
    });
  }
});

module.exports = router;
module.exports.geminiRouter = geminiRouter;
module.exports.groqRouter = groqRouter;
module.exports.generateCodeExplanation = generateCodeExplanation;
module.exports.generateProjectDocs = generateProjectDocs;
module.exports.generateReadme = generateReadme;
module.exports.buildNoteAssistantResponse = buildNoteAssistantResponse;
