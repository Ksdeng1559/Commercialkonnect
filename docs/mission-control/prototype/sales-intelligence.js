// Sample UI only. No real project records, contacts, API keys or private payloads are bundled.
function salesIntelligenceCard(id){
 const o=state.opps.find(x=>x.id===id);if(!o){toast('Choose an opportunity first.');return}
 modal(o.company,'SALES INTELLIGENCE · ILLUSTRATIVE SAMPLE',`
 <span class="tag teal">Research candidate</span><span class="tag amber">Sample · not verified</span>
 <h3>${esc(o.name)}</h3><p>${esc(o.city)}, ${esc(o.province||'BC')} · ${esc(o.type)} · ${esc(o.phase)}</p>
 <h3>Observed signal in this sample</h3><p>${esc(o.signal)}. ${esc(o.note)}</p>
 <h3>Why a broker might investigate</h3><p><b>Inference:</b> ${esc(o.fit)} may be relevant if the sponsor confirms a funding gap, suitable timing and authority. A permit or project milestone does not establish borrowing intent.</p>
 <div class="details"><div><small>Project budget · sample</small>${money(o.budget)}</div><div><small>Requested financing</small>Unknown</div><div><small>Sponsor / borrower identity</small>Unverified</div><div><small>Financing need</small>${o.verified?'Recorded only in sample notes':'Unconfirmed'}</div></div>
 <h3>Who to identify</h3><p>Verify the legal owner or development sponsor and the person responsible for financing. A listed contractor, builder or permit applicant is not automatically the borrower.</p>
 <h3>Ask on a discovery call</h3><ul><li>Who owns the project and makes financing decisions?</li><li>Is financing already committed for the next stage?</li><li>What funding purpose, amount and timing should be reviewed?</li><li>Is a 15-minute capital readiness conversation useful?</li></ul>
 <h3>Suggested next step</h3><p>${esc(o.action)}. Verify the source and sponsor before preparing an introduction.</p>
 <details class="broker-details"><summary>Evidence & confidence</summary><p><b>Source:</b> ${esc(o.source)}</p><p><b>Verified date:</b> None. This card is illustrative and has no independent factual confidence. It is not a live provider lookup or a qualified borrower lead.</p><p>Real records should retain provider record ID, permit event date, collection date, field provenance and unresolved role conflicts. Do not infer a loan request from construction value.</p></details>`,
 `<button onclick="brokerDetail(${id})">Back to opportunity</button><button onclick="brokerBrief(${id})">Prepare for call</button><button class="primary" onclick="downloadSalesIntelligence(${id})">Download sample card</button>`)
}
function downloadSalesIntelligence(id){
 const o=state.opps.find(x=>x.id===id);if(!o)return;
 const text=`SALES INTELLIGENCE — ILLUSTRATIVE SAMPLE\n${o.company} | ${o.name}\n${o.city}, ${o.province||'BC'} | ${o.type}\nSignal: ${o.signal}\nContext: ${o.note}\nInference: ${o.fit} may be relevant only after sponsor confirmation.\nProject budget (sample): ${money(o.budget)}\nRequested financing: Unknown\nSponsor identity and contact authority: Unverified\nSource: ${o.source}\nVerified date: None\nNext step: ${o.action}\nQuestions: Who is the legal owner? Is funding already committed? What amount, purpose and timing apply?\nNo live provider data or verified borrowing intent.\n`;
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.href=url;a.download='sample-sales-intelligence.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
