let input='';for await(const chunk of process.stdin)input+=chunk;
const job=JSON.parse(input);
if(job.input?.industry==='fail'){process.stderr.write('PRIVATE_TEST_VALUE');process.exit(1);}
if(job.input?.industry==='invalid'){process.stdout.write('not-json');process.exit(0);}
if(job.input?.industry==='timeout'){await new Promise(r=>setTimeout(r,30000));}
process.stdout.write(JSON.stringify({companies:[{sourceKey:'fixture',businessName:'Synthetic Workshop',industry:'manufacturing',location:'BC',provenance:{url:'https://example.com/about',publisher:'Synthetic fixture',observedAt:'2026-10-29T12:00:00Z',license:'Synthetic test data',confidence:'low'}}]}));
