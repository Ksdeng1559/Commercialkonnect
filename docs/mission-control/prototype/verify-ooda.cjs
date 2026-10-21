// Domain and DOM-stub verification; does not establish hosted browser refresh.
const fs=require('fs'),vm=require('vm'),path=require('path');let elements={};const el=s=>elements[s]??={innerHTML:'',textContent:'',value:'',checked:false,style:{},appendChild(){},showModal(){this.open=true},close(){this.open=false}};const c={structuredClone,document:{querySelector:el,createElement:()=>({})},window:{addEventListener(){}},location:{hash:''},localStorage:{getItem:()=>null,setItem(){}},setTimeout(){},clearTimeout(){},URL,Blob};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'),c);vm.runInContext(`
page='today';render();generateOoda();if(state.oodaCycle)throw Error('Cycle without brain');
state.brain={version:1,answers:{...blankBrain(),purposes:purposeOptions,properties:propertyOptions,regions:['BC'],min:0,max:100}};
const meetingsBefore=JSON.stringify(state.meetings),brainBefore=JSON.stringify(state.brain);
generateOoda();const cycle=state.oodaCycle;if(cycle.decisions.length!==3||cycle.decisions.some(d=>d.status!=='Needs Review'||!d.signal.sample))throw Error('Top-three cap or disclosure');
let d=cycle.decisions[0];if(oodaTransition(d.id,'execute')||d.status!=='Needs Review')throw Error('Executed without approval');
document.querySelector('#oodaActionNote').value='';if(oodaTransition(d.id,'approve'))throw Error('Empty approval');
document.querySelector('#oodaActionNote').value='Prepare only';if(!oodaTransition(d.id,'approve')||!oodaTransition(d.id,'execute')||!d.preparation||d.status!=='Completed')throw Error('Scoped action failed');
const n=d.audit.length;if(oodaTransition(d.id,'execute')||d.audit.length!==n)throw Error('Duplicate execution');
d=cycle.decisions[1];oodaTransition(d.id,'reject');if(d.status!=='Rejected'||oodaTransition(d.id,'execute'))throw Error('Rejected action executed');
d=cycle.decisions[2];oodaTransition(d.id,'approve');state.opps[0].action='Changed';if(oodaCurrent()||oodaTransition(d.id,'execute'))throw Error('Changed inputs bypassed hold');
generateOoda();if(state.oodaHistory.length!==1||state.oodaHistory[0].decisions[0].status!=='Completed')throw Error('History lost');
state.oodaCycle.date='2000-01-01';if(oodaCurrent())throw Error('Old daily approval current');
if(!oodaSignalError({subject:'Example',claim:'Professional signal',url:'javascript:alert(1)',observed:oodaDay()}))throw Error('Unsafe URL');
if(!oodaSignalError({subject:'Example',claim:'Professional signal',url:'https://example.com',observed:'2026-02-30'}))throw Error('Invalid date');
const signal={id:'test',subject:'Example',claim:'Published project milestone',url:'https://example.com/project',observed:oodaDay(),sample:false};state.oodaSignals=[signal,{...signal,id:'copy'}];if(oodaSignals().filter(s=>s.subject==='Example').length!==1)throw Error('Duplicate signals');
if(oodaSourceState({...signal,observed:'2020-01-01'}).indexOf('Stale')<0)throw Error('Freshness');
if(JSON.stringify(state.meetings)!==meetingsBefore||JSON.stringify(state.brain)!==brainBefore)throw Error('Mutated meetings or Brain');
page='chief';render();if(!document.querySelector('#main').innerHTML.includes('Open Today briefing'))throw Error('Chief entry missing');
`,c);console.log('PASS: OODA brain gate, top-three cap, sample labels, approval/rejection, scoped internal action, replay denial, stale inputs/date holds, history, source/date validation, dedup/freshness and no meeting/Brain changes.');
