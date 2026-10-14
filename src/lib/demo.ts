export type Project = {id:string;name:string;location:string;type:string;stage:string;value:number;score:number;lead:string;signals:string[]};
export const projects:Project[] = [
{id:"BC-101",name:"North Shore Mixed-Use",location:"North Vancouver, BC",type:"Mixed-use",stage:"Rezoning",value:28000000,score:92,lead:"Developer identified",signals:["Public hearing","Financing window"]},
{id:"BC-102",name:"Fraser Valley Townhomes",location:"Surrey, BC",type:"Residential",stage:"Permit application",value:14500000,score:86,lead:"Architect identified",signals:["Permit activity","Land assembly"]},
{id:"BC-103",name:"Vancouver Industrial Renewal",location:"Vancouver, BC",type:"Industrial",stage:"Planning",value:9200000,score:78,lead:"Owner research needed",signals:["Site redevelopment"]},
{id:"BC-104",name:"Burnaby Infill Development",location:"Burnaby, BC",type:"Multifamily",stage:"Pre-construction",value:6200000,score:73,lead:"Contractor identified",signals:["Early-stage opportunity"]},
];
