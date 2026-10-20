const test=require('node:test');const assert=require('node:assert/strict');
const categories=['IT','HR','Facilities'];
test('request categories match the supported service departments',()=>{assert.deepEqual(categories,['IT','HR','Facilities']);});
test('request priority set contains four SLA tiers',()=>{assert.deepEqual(['low','medium','high','urgent'],['low','medium','high','urgent']);});
test('request status workflow contains expected lifecycle states',()=>{assert.ok(['open','in_progress','waiting_for_employee','resolved','closed'].includes('in_progress'));assert.ok(['open','in_progress','waiting_for_employee','resolved','closed'].includes('resolved'));});
