import test from 'node:test';
import assert from 'node:assert/strict';
import {firstSearch} from '../render_first_search.mjs';

test('recorded first-use evidence proves completed writes, source links and replacement revisions', () => {
  assert.equal(firstSearch.version, '0.9.0');
  assert.equal(firstSearch.models_enabled, false);
  for (const example of Object.values(firstSearch.examples)) {
    const {initial, updated} = example;
    assert.equal(initial.receipt.document_id, updated.receipt.document_id);
    assert.equal(updated.receipt.revision_number, initial.receipt.revision_number + 1);
    for (const [record, content] of [[initial, example.text], [updated, example.updated_text]]) {
      assert.deepEqual(record.states.map(state => state.mutation_id).sort(), [...record.receipt.mutation_ids].sort());
      assert.ok(record.states.length && record.states.every(state => state.state === 'COMMITTED'));
      assert.ok(record.results.length);
      for (const result of record.results) {
        assert.ok(result.evidence_span.includes(content));
        assert.ok(result.provenance.some(source => source.source_ref === example.source && source.revision_id === record.receipt.revision_id));
      }
    }
    assert.ok(updated.results.every(result => !result.evidence_span.includes(example.text)));
  }
});
