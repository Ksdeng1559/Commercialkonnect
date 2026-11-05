// Limited synthetic behavior checks with a DOM stub; not browser or end-to-end verification.
const fs=require('fs'),vm=require('vm'),assert=require('assert');const els={};function el(s){return els[s]??={innerHTML:'',textContent:'',style:{},value:'',checked:false,open:false,appendChild(){},showModal(){this.open=true},close(){this.open=false}}}const c={console,structuredClone,document:{querySelector:el,createElement:()=>({textContent:''}),title:''},location:{hash:''},localStorage:{getItem:()=>null,setItem:()=>{}},window:{addEventListener:()=>{}},setTimeout:()=>{},navigator:{},URL,Blob};vm.createContext(c);vm.runInContext(fs.readFileSync(require('path').join(__dirname, 'app.js'),'utf8'),c);vm.runInContext(`
for(let p of ['overview','opportunities','pipeline','gtm','appointments','metrics','wireframe','settings','activity','brain']){page=p;render();if(!document.querySelector('#main').innerHTML)throw Error('Empty '+p)}
if(brainErrors(blankBrain()).length<3)throw Error('Missing interview validation');
state.brainDraft={...blankBrain(),name:'Industrial team',interviewee:'Owner',ideal:'Industrial owner-operators',purposes:['Owner-occupied property'],properties:['Industrial'],regions:['BC'],min:'5',max:'10',qualification:'Confirm property use and timing',channels:['Business growth → property conversation'],goal:'6',capacity:'2'};
if(brainErrors(state.brainDraft).length)throw Error('Valid interview rejected');
if(state.brain)throw Error('Draft activated prematurely');
brainStep=4;document.querySelector('#brainReviewed').checked=false;activateBrain();if(state.brain)throw Error('Unreviewed activation');
document.querySelector('#brainReviewed').checked=true;activateBrain();if(state.goal!==6||state.brain.version!==1)throw Error('Activation failed');
if(rankedOpps(true).length!==1||rankedOpps(true)[0].id!==5)throw Error('Specialization shortlist failed');
if(matchBrain(state.opps.find(o=>o.id===5)).score!==100)throw Error('Score failed');
if(matchBrain(state.opps[0]).eligible)throw Error('Out-of-mandate accepted');
if(recommendedPlays()[0]!==3)throw Error('Preferred play not prioritized');
let manual={id:100,name:'Equipment test',type:'Business / no property',amount:6,city:'Calgary',purpose:'Equipment financing',province:'AB'};if(matchBrain(manual).eligible)throw Error('Wrong province accepted');
state.brain.answers.purposes=['Equipment financing'];state.brain.answers.properties=['Business / no property'];state.brain.answers.regions=['AB'];if(matchBrain(manual).score!==100||!matchBrain(manual).eligible)throw Error('Business financing not matched');
delete manual.province;if(!matchBrain(manual).unknown)throw Error('Missing field not flagged');
state.brainDraft={...state.brainDraft,goal:'99'};if(state.goal!==6)throw Error('Draft goal affected dashboard');
for(let p of ['overview','opportunities','pipeline','gtm','appointments','metrics','wireframe','settings','activity','brain']){page=p;render();}
`,c);console.log('PASS: 10 views before/after activation; required answers; review gate; draft isolation; goal update; property, purpose, geography and amount matching; preferred playbooks; business financing; unknown-field review.');
