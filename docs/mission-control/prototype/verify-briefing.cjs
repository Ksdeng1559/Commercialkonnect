// Domain and DOM-stub verification; does not establish hosted browser refresh.
const fs=require('fs'),vm=require('vm'),path=require('path');let elements={};const el=s=>elements[s]??={innerHTML:'',textContent:'',value:'',checked:false,style:{},appendChild(){},showModal(){this.open=true},close(){this.open=false}};const c={structuredClone,document:{querySelector:el,createElement:()=>({})},window:{addEventListener(){}},location:{hash:''},localStorage:{getItem:()=>null,setItem(){}},setTimeout(){},clearTimeout(){},URL,Blob};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'),c);vm.runInContext(`
page='briefing';render();if(!document.querySelector('#main').innerHTML.includes('No briefings yet'))throw Error('Missing empty state');
const source={publisher:'Registry',url:'https://registry.example/entity',published:'2026-10-01',event:'2026-09-01',retrieved:'2026-10-17'};
const claim={evidenceId:'E1',code:'V',claim:'Entity exists',caveat:'Record applies only to legal registration',sources:[source],primary:true};
if(briefClaimError(claim))throw Error('Valid source rejected');
for(const invalid of [{...claim,primary:false},{...claim,sources:[]},{...claim,sources:[{...source,url:'javascript:alert(1)'}]},{...claim,sources:[{...source,retrieved:'2099-01-01'}]},{...claim,code:'C',independent:true},{...claim,sources:[{...source,retrieved:'2026-02-30'}]}])if(!briefClaimError(invalid))throw Error('Invalid evidence accepted');
if(briefClaimError({...claim,code:'N',sources:[],primary:false}))throw Error('Explicit unknown rejected');
const b={id:'b1',company:'Example <script>',person:'Test',geography:'BC',purpose:'Financing',website:'',context:'',mode:'Battlecard',revision:1,brainVersion:0,brainContext:'Not activated',createdAt:'2026-10-17',claims:[claim],sections:{identity:'Exact legal target identified; namesakes excluded E1',verdict:'Registration evidence only E1',actions:'Confirm authority and financing need'}};
state.clientBriefs=[b];state.selectedBrief='b1';
if(briefReviewError(b))throw Error('Valid review rejected');if(!briefReviewError({...b,sections:{}}))throw Error('Empty report reviewed');
b.reviewedRevision=1;if(briefStatus(b)!=='Reviewed working brief')throw Error('Review missing');touchBrief(b);if(briefStatus(b)==='Reviewed working brief')throw Error('Changed report retained review');
b.claims.push({...claim,evidenceId:'E2'});removeClaim('b1',0);if(!briefText(b).includes('E2 ['))throw Error('Evidence IDs shifted after removal');
page='briefing';render();if(document.querySelector('#main').innerHTML.includes('Example <script>'))throw Error('Unescaped company');
for(const mode of briefModes){b.mode=mode;const text=briefText(b);if(!text.includes('Evidence register')||!text.includes('No automated research tools were run'))throw Error('Export scope omitted')}
state.brain={version:2,answers:{}};if(!briefReviewError(b).includes('Brain'))throw Error('Changed Brain not held');
researchBrief('b1');if(!document.querySelector('#modal').innerHTML.includes('NO RESEARCH DISPATCHED'))throw Error('False research status');
`,c);console.log('PASS: briefing rendering, evidence validation, unknown labels, review gating and invalidation, stable evidence IDs, escaped text, export modes, Brain staleness and research disclosure.');
