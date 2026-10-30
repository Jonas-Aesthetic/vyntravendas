const U=process.env.KV_REST_API_URL,T=process.env.KV_REST_API_TOKEN;
const rp=async c=>{const r=await fetch(U+'/pipeline',{method:'POST',headers:{Authorization:'Bearer '+T},body:JSON.stringify(c)});if(!r.ok)throw new Error('redis '+r.status);return(await r.json()).map(x=>{if(x.error)throw new Error(x.error);return x.result})};
const out=(res,s,o)=>{res.statusCode=s;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(o))};
const S=(v,n)=>String(v==null?'':v).slice(0,n);
const clean=l=>({id:+l.id||Date.now(),nome:S(l.nome,120),org:S(l.org,40),q:S(l.q,20),st:S(l.st,20),val:Math.max(0,+l.val||0),sel:S(l.sel,40),ts:+l.ts||Date.now()});
module.exports=async(req,res)=>{
 if(!U||!T)return out(res,503,{error:'Banco de dados não configurado'});
 try{
  if(req.method==='GET'){
   const[h]=await rp([['HGETALL','leads']]);
   if(h&&h.length){const L=[];for(let i=1;i<h.length;i+=2)L.push(JSON.parse(h[i]));return out(res,200,{leads:L})}
   const[ok]=await rp([['SET','leads:seeded','1','NX']]);
   return out(res,200,ok?{seed:true}:{leads:[]});
  }
  if(req.method!=='POST')return out(res,405,{error:'método'});
  const b=req.body&&typeof req.body==='object'?req.body:{},a=b.action,many=ls=>(Array.isArray(ls)?ls:[]).slice(0,5000).map(clean);
  if(a==='upsert'&&b.lead){const l=clean(b.lead);await rp([['HSET','leads',String(l.id),JSON.stringify(l)]])}
  else if(a==='delete'){await rp([['HDEL','leads',String(+b.id)]])}
  else if(a==='seed'||a==='reset'){const ls=many(b.leads);await rp([['DEL','leads'],...ls.map(l=>['HSET','leads',String(l.id),JSON.stringify(l)])])}
  else return out(res,400,{error:'ação inválida'});
  return out(res,200,{ok:1});
 }catch(e){console.error(e);return out(res,500,{error:'Erro interno'})}
};
