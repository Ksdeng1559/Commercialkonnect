// Domain and DOM-stub verification; does not establish hosted browser refresh.
const fs=require('fs'),vm=require('vm'),path=require('path');let elements={};const el=s=>elements[s]??={innerHTML:'',textContent:'',value:'',checked:false,style:{},appendChild(){},showModal(){this.open=true},close(){this.open=false}};const c={structuredClone,document:{querySelector:el,createElement:()=>({})},window:{addEventListener(){}},location:{hash:''},localStorage:{getItem:()=>null,setItem(){}},setTimeout(){},clearTimeout(){},URL,Blob};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'),c);vm.runInContext(`
page='validation';render();if(!document.querySelector('#main').innerHTML.includes('Product-market fit is unproven'))throw Error('Missing status');
if(pilotTotals().teams!==0)throw Error('Synthetic CRM leaked into pilot evidence');
let p={team:'Pilot A',segment:pilotSegments[0],price:'399',date:'2026-10-01',notes:'Documented paid pilot with evidence notes.',origin:'Net-new discovery',meeting:true};
if(pilotInputError(p))throw Error('Valid input rejected');
for(const invalid of [{...p,date:'2099-01-01'},{...p,date:'2026-02-30'},{...p,price:'0'},{...p,notes:''},{...p,origin:'Assisted existing relationship'}]){if(!pilotInputError(invalid))throw Error('Invalid input accepted')}
state.pilotRecords=[{...p,id:'a',activated:true,weekly:true,renewed:false},{...p,team:'Pilot B',segment:pilotSegments[1],meeting:false}];
if(pilotTotals().teams!==2||pilotTotals().meeting!==1||pilotTotals(pilotSegments[0]).activated!==1)throw Error('Cohort aggregation');
if(!pilotInputError(p))throw Error('Duplicate team accepted');
removePilot('a');if(pilotTotals().teams!==1)throw Error('Removal failed');
`,c);console.log('PASS: empty evidence, view rendering, cohort aggregation, date/price/notes validation, attribution gate, duplicate teams, removal.');
