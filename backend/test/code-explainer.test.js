const test = require('node:test');
const assert = require('node:assert/strict');

const aiRouter = require('../src/routes/ai');

test('ai router exposes code explanation helper and gemini-compatible route names', () => {
  assert.equal(typeof aiRouter.generateCodeExplanation, 'function');
  assert.equal(typeof aiRouter.generateProjectDocs, 'function');
  assert.equal(typeof aiRouter.generateReadme, 'function');
});

test('provider routes are exposed separately for Gemini and Groq', () => {
  assert.ok(aiRouter.geminiRouter, 'Gemini router should be exported');
  assert.ok(aiRouter.groqRouter, 'Groq router should be exported');
  assert.equal(typeof aiRouter.geminiRouter.post, 'function');
  assert.equal(typeof aiRouter.groqRouter.post, 'function');
});

test('note assistant fallback response is based on the actual note input', () => {
  const noteA = 'Patient has improved and needs observation';
  const noteB = 'Patient needs to take diet properly';

  const resultA = aiRouter.buildNoteAssistantResponse('explain', noteA);
  const resultB = aiRouter.buildNoteAssistantResponse('explain', noteB);

  assert.equal(typeof resultA.result, 'string');
  assert.equal(typeof resultB.result, 'string');
  assert.notEqual(resultA.result, resultB.result);
  assert.match(resultA.result, /improved|observation/i);
  assert.match(resultB.result, /diet|nutrition|dietary/i);
});

test('readme generation incorporates the supplied title and description', async () => {
  const title = 'Hospital Health Intake Guide';
  const description = 'A patient wellness portal that helps users record symptoms, receive guidance, and find hospital resources.';

  const readme = await aiRouter.generateReadme({ title, description });

  assert.equal(typeof readme, 'string');
  assert.match(readme, /Hospital Health Intake Guide/i);
  assert.match(readme, /patient wellness portal/i);
  assert.match(readme, /# /i);
});

test('health guidance generation answers the actual user problem', async () => {
  const title = 'Migrane Problem';
  const description = 'I am suffering from headache from last 7 days.';

  const guidance = await aiRouter.generateReadme({ title, description });

  assert.equal(typeof guidance, 'string');
  assert.match(guidance, /headache|migraine|doctor|consult|hydration|rest/i);
});
