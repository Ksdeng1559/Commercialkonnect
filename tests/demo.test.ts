import assert from 'node:assert/strict';
import test from 'node:test';
import { filterProjects, projectCsv, projects } from '../src/lib/demo.ts';

test('combined filters match signals, stage, location and score', () => {
  assert.equal(filterProjects(projects, ' FINANCING WINDOW ', 'Rezoning', 'North Vancouver, BC', 90)[0]?.id, 'BC-101');
  assert.equal(filterProjects(projects, 'Surrey', 'All stages', 'All locations', 0).length, 1);
  assert.equal(filterProjects(projects, '', 'All stages', 'All locations', 95).length, 0);
});
test('scores are explainable and sum to their fixture totals', () => {
  for (const p of projects) {
    assert.equal(p.scoreFactors.reduce((sum, factor) => sum + factor.points, 0), p.score);
    assert(p.scoreFactors.every(factor => factor.points <= factor.max));
    assert.equal(p.scoreFactors.reduce((sum, factor) => sum + factor.max, 0), 100);
  }
});
test('CSV discloses synthetic data and carries qualification and shortlist state', () => {
  const record = {...projects[0], name: 'Example "quoted", project'};
  const csv = projectCsv([record], [record.id], {[record.id]:'Qualified'});
  assert.equal(csv.split('\r\n').length, 2);
  assert(csv.includes('"SYNTHETIC DEMO — NOT VERIFIED"'));
  assert(csv.includes('"Example ""quoted"", project"'));
  assert(csv.includes('"Qualified","Yes"'));
});
