import type { APIRoute } from 'astro';
export const prerender = false;
const json=(body:object,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
const trim=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
const provinces=new Set(['British Columbia','Alberta','Ontario','Saskatchewan','Manitoba','Quebec','Nova Scotia','New Brunswick','Newfoundland and Labrador','Prince Edward Island','Yukon','Northwest Territories','Nunavut']);
export const POST:APIRoute=async({request})=>{
 if(Number(request.headers.get('content-length')||0)>12000)return json({error:'Payload too large'},413);
 let data:Record<string,unknown>;
 try{data=await request.json();if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('invalid')}catch{return json({error:'Invalid request'},400)}
 if(data.website)return json({ok:true});
 const full_name=trim(data.full_name,120),email=trim(data.email,254),agency=trim(data.agency,160),province=trim(data.province,70),client_focus=trim(data.client_focus,100),message=trim(data.message,1200);
 if(!full_name||!agency||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!provinces.has(province)||data.consent!=='on')return json({error:'Complete all required fields and consent.'},400);
 const origin=request.headers.get('origin'),host=request.headers.get('host');
 if(origin&&host){try{if(new URL(origin).host!==host)return json({error:'Invalid origin'},403)}catch{return json({error:'Invalid origin'},403)}}
 const url=import.meta.env.SUPABASE_URL,key=import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return json({error:'Intake temporarily unavailable'},503);
 try{
 const r=await fetch(url.replace(/\/$/,'')+'/rest/v1/ck_commercial_insurance_partner_enquiries',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'content-type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({full_name,email,agency,province,client_focus,message,consented_at:new Date().toISOString(),consent_purpose:'partner_enquiry_reply',source:'commercial-insurance-referral-landing',status:'new'})});
 if(!r.ok){console.error('Partner intake HTTP',r.status);return json({error:'Unable to accept enquiry right now'},502)}
 return json({ok:true},201);
 }catch{return json({error:'Unable to connect right now'},502)}
};
