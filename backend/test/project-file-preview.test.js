const test = require('node:test');
const assert = require('node:assert/strict');

const projectsRoute = require('../src/routes/projects');

const previewModes = ['image', 'pdf', 'text', 'download'];

test('project file preview detection supports common file types', () => {
  assert.equal(typeof projectsRoute.getProjectFilePreviewMode, 'function');

  for (const type of previewModes) {
    assert.ok(type);
  }

  assert.equal(projectsRoute.getProjectFilePreviewMode('image/png'), 'image');
  assert.equal(projectsRoute.getProjectFilePreviewMode('application/pdf'), 'pdf');
  assert.equal(projectsRoute.getProjectFilePreviewMode('text/plain'), 'text');
  assert.equal(projectsRoute.getProjectFilePreviewMode('application/octet-stream'), 'download');
});
