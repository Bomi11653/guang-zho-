import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app = { innerHTML: '', querySelector: () => null };
let click;
const storage = new Map();
const context = vm.createContext({ console, URLSearchParams, TextEncoder, Uint8Array, DataView, Blob,
  localStorage: { setItem: (key, value) => storage.set(key, value), getItem: (key) => storage.get(key) ?? null, removeItem: (key) => storage.delete(key) },
  window: { location: { search: '' }, matchMedia: () => ({ matches: false, addEventListener() {} }), scrollTo() {}, setTimeout() {}, clearTimeout() {} },
  document: { querySelector: (s) => s === '#app' ? app : null, addEventListener: (name, fn) => { if (name === 'click') click = fn; }, createElement: () => ({ remove() {} }), body: { appendChild() {} } },
});
vm.runInContext(fs.readFileSync(new URL('./question-bank.js', import.meta.url), 'utf8') + '\n' + fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8'), context);
const run = (s) => vm.runInContext(s, context);
async function act(action, extra = {}) { await click({ target: { closest: () => ({ dataset: { action, ...extra } }) } }); }
for (const category of ['luck', 'career', 'study']) {
  for (const answer of [0, 2, 4]) {
    await act('category', { category });
    await act('start');
    assert.equal(run('state.screen'), 'loading');
    await act('begin-quiz');
    const count = run('getQuestions().length');
    assert.equal(count, category === 'luck' ? 16 : 60);
    await act('answer', { answer: String(answer) });
    await act('next');
    await act('nav', { target: 'home' });
    await act('resume');
    assert.equal(run('state.screen'), 'quiz');
    assert.equal(run('state.questionIndex'), 1);
    assert.equal(run('state.selections[0]'), answer);
    await act('prev');
    run('state.selections[0] = null');
    await act('next');
    assert.equal(run('state.questionIndex'), 0);
    for (let i = 0; i < count; i++) {
      await act('answer', { answer: String(answer) });
      if (i === 1) { await act('prev'); assert.equal(run('state.selections[0]'), answer); await act('next'); }
      await act('next');
    }
    assert.equal(run('state.screen'), 'result');
    assert.equal(run('state.score'), count * (answer + 1) * (category === 'luck' ? 2 : 1));
    assert.ok(!app.innerHTML.includes('undefined'));
    if (category !== 'luck') assert.ok(run('dimensionResults().every(d => d.score === 10 * (state.selections[0] + 1))'));
    await act('to-glyph'); await act('burn'); await act('skip-burn');
    assert.equal(run('state.screen'), 'share');
    await act('secrets'); await act('nav', { target: 'share' });
    assert.equal(run('state.screen'), 'share');
    console.log('PASS', category, count, 'questions, answer', answer, 'score', run('state.score'));
  }
}
