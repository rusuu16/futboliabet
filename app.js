import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = s => document.querySelector(s);

function escapeHtml(v=''){const d=document.createElement('div');d.textContent=v;return d.innerHTML}

async function loadMatches(){
  const {data,error}=await supabase.from('matches').select('*').order('created_at',{ascending:true});
  const box=$('#matchesContainer'); box.innerHTML='';
  if(error){box.innerHTML='<p class="muted">Məlumat yüklənmədi.</p>';return}
  let total=1;
  data.forEach(m=>{total*=Number(m.odd);box.insertAdjacentHTML('beforeend',`<div class="match"><div><strong>${escapeHtml(m.teams)}</strong><small>${escapeHtml(m.league||'')}</small></div><div class="prediction">${escapeHtml(m.prediction)} <span class="odd">${Number(m.odd).toFixed(2)}</span></div></div>`)});
  $('#totalOdd').textContent=total.toFixed(2);
  const statuses=data.map(x=>x.status);
  const status=statuses.includes('lost')?'lost':data.length&&statuses.every(x=>x==='won')?'won':'pending';
  $('#couponStatus').textContent=status==='lost'?'Uğursuz':status==='won'?'Uğurlu':'Gözləyir';
  $('#couponStatus').className='status '+status;
}

async function loadAnalyses(){
 const {data,error}=await supabase.from('analyses').select('*').order('created_at',{ascending:false});
 const box=$('#analysesContainer');box.innerHTML='';
 if(error||!data?.length){box.innerHTML='<p class="muted">Hələ analiz paylaşılmayıb.</p>';return}
 data.forEach(a=>box.insertAdjacentHTML('beforeend',`<article class="card analysis"><h3>${escapeHtml(a.title)}</h3><div class="meta">${escapeHtml(a.stadium||'Futbol Analizi')} • ${new Date(a.created_at).toLocaleDateString('az-AZ')}</div><p>${escapeHtml(a.content)}</p></article>`));
}

async function loadStats(){
 const {data,error}=await supabase.from('matches').select('status'); if(error)return;
 const total=data.length,won=data.filter(x=>x.status==='won').length,lost=data.filter(x=>x.status==='lost').length;
 const rate=(won+lost)?((won/(won+lost))*100).toFixed(1):0;
 $('#totalPredictions').textContent=total;$('#wonPredictions').textContent=won;$('#lostPredictions').textContent=lost;$('#successRate').textContent=rate+'%';$('#heroRate').textContent=rate+'%';
}

$('#adminBtn').onclick=async()=>{ $('#adminModal').classList.remove('hidden'); const {data:{session}}=await supabase.auth.getSession(); session?showAdmin():showLogin(); }
$('#closeAdmin').onclick=()=>$('#adminModal').classList.add('hidden');
function showAdmin(){$('#loginView').classList.add('hidden');$('#adminView').classList.remove('hidden')}
function showLogin(){$('#adminView').classList.add('hidden');$('#loginView').classList.remove('hidden')}
$('#loginForm').onsubmit=async e=>{e.preventDefault();const {error}=await supabase.auth.signInWithPassword({email:$('#email').value,password:$('#password').value});if(error)alert(error.message);else showAdmin();}
$('#logoutBtn').onclick=async()=>{await supabase.auth.signOut();showLogin()}
$('#matchForm').onsubmit=async e=>{e.preventDefault();const {error}=await supabase.from('matches').insert({teams:$('#teams').value,league:$('#league').value,prediction:$('#prediction').value,odd:Number($('#odd').value)});if(error)alert(error.message);else{e.target.reset();await loadMatches();await loadStats();}}
$('#analysisForm').onsubmit=async e=>{e.preventDefault();const {error}=await supabase.from('analyses').insert({title:$('#analysisTitle').value,stadium:$('#stadium').value,content:$('#analysisText').value});if(error)alert(error.message);else{e.target.reset();await loadAnalyses();}}
$('#copyCoupon').onclick=async()=>{const {data}=await supabase.from('matches').select('*').order('created_at');let text='⚽ FUTBOLIA BET - Günün Kuponu\n\n';let total=1;(data||[]).forEach(m=>{total*=Number(m.odd);text+=`${m.teams}\nTəxmin: ${m.prediction} | Əmsal: ${Number(m.odd).toFixed(2)}\n\n`});text+=`Ümumi Əmsal: ${total.toFixed(2)}`;await navigator.clipboard.writeText(text);alert('Kupon kopyalandı!')}
loadMatches();loadAnalyses();loadStats();