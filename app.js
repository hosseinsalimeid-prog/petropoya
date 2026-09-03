window.onerror=function(m,s,l){var d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;right:0;background:#b71c1c;color:#fff;padding:10px;font:12px monospace;z-index:99999;direction:ltr';d.textContent='JS ERROR: '+m+' @line '+l;(document.body?document.body:document.documentElement).appendChild(d)};
var $=function(s){return document.querySelector(s)},$$=function(s){return[].slice.call(document.querySelectorAll(s))};
function D(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function SV(k,v){localStorage.setItem(k,JSON.stringify(v))}
function fa(s){return String(s).replace(/\d/g,function(d){return'۰۱۲۳۴۵۶۷۸۹'[d]})}
function N0(x){var v=parseFloat(x);return isNaN(v)?0:v}
function NV(x,d){var v=parseFloat(x);return isNaN(v)?d:v}
function STR(x,d){x=String(x==null?'':x).trim();return x?x:d}
function fmt(n){return fa(N0(n).toLocaleString('en-US'))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function today(){return new Date().toISOString().slice(0,10)}
function now(){return new Date().toTimeString().slice(0,5)}
function findIn(a,f){for(var i=0;i<a.length;i++){if(f(a[i]))return a[i]}return null}
function isCat(c){return function(x){return x.c===c}}
function key(c,n){return function(x){if(x.c!==c)return false;return x.n===n}}
function toast(m,e){var t=document.createElement('div');t.className='toast'+(e?' error':'');t.textContent=m;$('#tw').appendChild(t);requestAnimationFrame(function(){t.classList.add('show')});setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove()},350)},3000)}
function hsh(t){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)).then(function(b){return[].map.call(new Uint8Array(b),function(x){return('0'+x.toString(16)).slice(-2)}).join('')})}
var S={user:null,view:'dash'};
var ROLES={admin:['مدیر کل','👑'],factory:['مدیر کارخانه','🧭'],supervisor:['مسئول شیفت','🛡️'],operator:['اپراتور','👷'],warehouse:['انباردار','📦'],finance:['مالی','💰'],maint:['تعمیرکار','🔧'],viewer:['ناظر','👁️']};
var ACC={op:['admin','factory','supervisor','operator'],wh:['admin','factory','warehouse'],fin:['admin','factory','finance'],mt:['admin','factory','maint'],ad:['admin']};
var A={dash:'all',flow:'all',batch:'op',log:'op',buy:'wh',inv:'wh',sales:'fin',fin:'fin',tm:'mt',users:'ad',settings:'ad'};
var MENU=[['🏠 اصلی',[['dash','📊 داشبورد'],['flow','⚡ جریان فرآیند']]],['🔥 پخت و تولید',[['batch','🔥 Batch و چرخه پخت'],['log','🕐 ثبت ساعتی']]],['📦 عملیات و انبار',[['buy','🛒 خرید مواد'],['inv','📦 انبار سه‌بخشی']]],['💰 مالی و فروش',[['sales','🧾 فروش'],['fin','💳 امور مالی']]],['🔧 پشتیبانی',[['tm','🔧 تعمیرات']]],['⚙️ مدیریت',[['users','👥 کاربران و نقش‌ها'],['settings','⚙️ تنظیمات و SOP']]]];
function can(id){var a=A[id];if(a=='all')return true;var list=ACC[a];return list.indexOf(S.user.role)>=0}
function head(t,s){return'<div class="vhead"><h2>'+t+'</h2><p>'+s+'</p></div>'}
var mode='login';
function tabUI(m){mode=m;$('#tLogin').classList.toggle('on',m=='login');$('#tReg').classList.toggle('on',m!='login');$('#gName').classList.toggle('hidden',m!='register');$('#gPass2').classList.toggle('hidden',m!='register');$('#goBtn').textContent=m=='login'?'ورود به سامانه':'ایجاد حساب';['eE','eP','eP2','eTop'].forEach(function(i){$('#'+i).textContent=''})}
$('#tLogin').onclick=function(){tabUI('login')};
$('#tReg').onclick=function(){tabUI('register')};
$('#goBtn').onclick=function(){var em=$('#qEmail').value.trim().toLowerCase(),p=$('#qPass').value,ok=true;function E(i,m){$('#'+i).textContent=m;if(m)ok=false}
E('eE',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)?'':'ایمیل معتبر نیست.');
E('eP',p.length<6?'رمز حداقل ۶ کاراکتر.':'');
if(mode=='register'){E('eP2',$('#qPass2').value!==p?'تکرار رمز مطابقت ندارد.':'')}
if(!ok)return;
var us=D('pp_users',[]);
hsh(p).then(function(h){
if(mode=='register'){var dup=findIn(us,function(x){return x.email===em});if(dup){$('#eE').textContent='این ایمیل قبلاً ثبت شده.';return}
var role=us.length?'viewer':'admin';
var u={name:STR($('#qName').value,em.split('@')[0]),email:em,hash:h,role:role};
us.push(u);SV('pp_users',us);localStorage.setItem('pp_session',em);start(u);
toast(role=='admin'?'شما مدیر کل هستید 👑':'ثبت‌نام شدید؛ مدیر نقش شما را تعیین می‌کند.')}
else{var f=findIn(us,function(x){if(x.email!==em)return false;return x.hash===h});
if(!f){$('#eTop').textContent='ایمیل یا رمز اشتباه است.';return}
localStorage.setItem('pp_session',em);start(f);toast('خوش آمدید '+f.name)}})};
$('#outBtn').onclick=function(){localStorage.removeItem('pp_session');location.reload()};
function start(u){if(!ROLES[u.role])u.role='viewer';S.user=u;$('#gate').classList.add('hidden');$('#app').classList.remove('hidden');$('#uName').textContent=u.name;$('#uRole').textContent=ROLES[u.role][0]+' '+ROLES[u.role][1];renderAside();go('dash')}
function renderAside(){$('#aside').innerHTML=MENU.map(function(g){var ok=g[1].filter(function(i){return can(i[0])});if(!ok.length)return'';return'<div class="grp"><h4>'+g[0]+'</h4>'+ok.map(function(i){return'<button class="sitem" data-v="'+i[0]+'">'+i[1]+'</button>'}).join('')+'</div>'}).join('');$$('#aside .sitem').forEach(function(b){b.onclick=function(){go(b.getAttribute('data-v'))}})}
var RENDER={};
function go(id){S.view=id;$$('#aside .sitem').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===id)});RENDER[id]()}
RENDER.flow=function(){var F=[['🛒','خرید'],['⚖️','توزین'],['🧰','آماده‌سازی'],['📋','چک‌لیست'],['▶️','Start'],['📈','ثبت ساعتی'],['⚠️','بازه بحرانی'],['🔥','Cracking'],['🛢','روغن‌گیری'],['⏹','خاموشی'],['❄️','Cooling'],['📤','تخلیه'],['🧾','ثبت خروجی'],['💰','فروش'],['📊','سود']];$('#main').innerHTML=head('جریان کامل فرآیند','از خرید تا فروش و سود')+'<div class="panel"><div class="flow">'+F.map(function(f,i){return'<div class="fs"><div class="fi" style="animation-delay:'+(i*0.15)+'s">'+f[0]+'</div><span>'+f[1]+'</span></div>'+(i<F.length-1?'<div class="far">➜</div>':'')}).join('')+'</div></div>'};
RENDER.dash=function(){
var bs=D('pp_batches',[]),act=0;bs.forEach(function(b){if(b.st!=='done')act++});
var oil=0;bs.forEach(function(b){if(b.st==='done')oil+=N0(b.o2)});
var fin=D('pp_fin',[]),inc=0,exp=0;fin.forEach(function(f){if(f.t==='in')inc+=N0(f.a);else exp+=N0(f.a)});
var rec=0;D('pp_sales',[]).forEach(function(x){rec+=N0(x.q)*N0(x.p)-N0(x.paid)});
var low=0;D('pp_inv',[]).forEach(function(i){if(N0(i.q)<N0(i.m))low++});
$('#main').innerHTML=head('داشبورد','نقش شما: '+ROLES[S.user.role][0])+'<div class="kpis">'
+'<div class="kpi k-blue"><i>🔥</i><div><h5>Batch در جریان</h5><div class="v">'+fa(act)+'</div></div></div>'
+'<div class="kpi k-pur"><i>🛢</i><div><h5>روغن تولیدی (لیتر)</h5><div class="v">'+fmt(oil)+'</div></div></div>'
+'<div class="kpi k-green"><i>💰</i><div><h5>درآمد (ریال)</h5><div class="v">'+fmt(inc)+'</div></div></div>'
+'<div class="kpi k-org"><i>📉</i><div><h5>هزینه (ریال)</h5><div class="v">'+fmt(exp)+'</div></div></div>'
+'<div class="kpi '+(rec>0?'k-red':'k-green')+'"><i>🧾</i><div><h5>مطالبات مانده</h5><div class="v">'+fmt(rec)+'</div></div></div>'
+'<div class="kpi '+(low>0?'k-red':'k-blue')+'"><i>📦</i><div><h5>هشدار انبار</h5><div class="v">'+fa(low)+'</div></div></div></div>'
+'<div class="panel"><h3>دسترسی نقش شما</h3><div style="font-size:13px;line-height:2.2">بخش‌های مجاز نقش شما در منو نمایش داده شده است. 👑 مدیر کل همه بخش‌ها را می‌بیند و نقش کاربران را تعیین می‌کند.</div></div>'};
RENDER.buy=function(){var mats=D('pp_mat',['لاستیک','پلاستیک','روغن سوخته','گریس سوخته']),arr=D('pp_buy',[]);
var rows=arr.map(function(r){var tot=N0(r.p)+N0(r.t),kg=N0(r.w);return'<tr><td>'+esc(r.d)+'</td><td>'+esc(r.s)+'</td><td>'+esc(r.m)+'</td><td dir="ltr">'+fa(kg)+' kg</td><td dir="ltr">'+fmt(tot)+'</td><td class="warnc" dir="ltr">'+(kg>0?fa(Math.round(tot/kg)):'—')+'</td></tr>'}).join('');
$('#main').innerHTML=head('خرید مواد اولیه','خرید → موجودی انبار + هزینه مالی')+'<div class="panel"><h3>ثبت خرید</h3><div class="fgrid"><input class="inp" type="date" id="bD" value="'+today()+'"><input class="inp" id="bSup" placeholder="تأمین‌کننده"><select class="inp" id="bM">'+mats.map(function(m){return'<option>'+esc(m)+'</option>'}).join('')+'</select></div><div class="fgrid"><input class="inp" type="number" id="bW" placeholder="وزن (kg)"><input class="inp" type="number" id="bP" placeholder="قیمت کل (ریال)"><input class="inp" type="number" id="bT" placeholder="حمل و تخلیه (ریال)"></div><button class="fbtn" id="bAdd">ثبت خرید</button></div><div class="panel"><h3>خریدها ('+fa(arr.length)+')</h3><div class="tbw"><table><tr><th>تاریخ</th><th>تأمین‌کننده</th><th>ماده</th><th>وزن</th><th>هزینه</th><th>هر کیلو</th></tr>'+rows+'</table></div></div>';
$('#bAdd').onclick=function(){var w=N0($('#bW').value),p=N0($('#bP').value);if(!(w*p)){toast('وزن و قیمت را وارد کن.',1);return}
var r={d:$('#bD').value,s:STR($('#bSup').value,'—'),m:$('#bM').value,w:w,p:p,t:N0($('#bT').value)};
arr.push(r);SV('pp_buy',arr);
var inv=D('pp_inv',[]),f2=findIn(inv,key('raw',r.m));
if(f2){f2.q=N0(f2.q)+w}else{inv.push({c:'raw',n:r.m,q:w,u:'kg',m:1000})}
SV('pp_inv',inv);
var fin=D('pp_fin',[]);fin.push({d:r.d,t:'out',de:'خرید '+r.m+' — '+r.s,a:r.p+r.t});SV('pp_fin',fin);
toast('خرید ثبت شد ✅');RENDER.buy()}};
RENDER.inv=function(){var cat='raw';
function draw(){var inv=D('pp_inv',[]);
var rows=inv.filter(isCat(cat)).map(function(i){var low=N0(i.q)<N0(i.m);return'<tr><td>'+esc(i.n)+'</td><td dir="ltr">'+fmt(i.q)+'</td><td>'+esc(i.u)+'</td><td dir="ltr">'+fmt(i.m)+'</td><td class="'+(low?'badc':'okc')+'">'+(low?'کمبود!':'موجود')+'</td></tr>'}).join('');
$('#main').innerHTML=head('انبار سه‌بخشی','مواد اولیه / محصولات / قطعات + حد هشدار')+'<div class="seg"><button data-c="raw" class="'+(cat=='raw'?'on':'')+'">🌿 مواد اولیه</button><button data-c="prod" class="'+(cat=='prod'?'on':'')+'">🛢 محصولات</button><button data-c="part" class="'+(cat=='part'?'on':'')+'">🔧 قطعات</button></div><div class="panel"><h3>افزودن / به‌روزرسانی</h3><div class="fgrid"><input class="inp" id="iN" placeholder="نام کالا"><input class="inp" type="number" id="iQ" placeholder="موجودی"><input class="inp" id="iU" placeholder="واحد (kg/لیتر/عدد)"><input class="inp" type="number" id="iM" placeholder="حد هشدار"></div><button class="fbtn" id="iAdd">ذخیره</button></div><div class="panel"><h3>موجودی‌ها</h3><div class="tbw"><table><tr><th>کالا</th><th>موجودی</th><th>واحد</th><th>حد هشدار</th><th>وضعیت</th></tr>'+rows+'</table></div></div>';
$$('#main .seg button').forEach(function(b){b.onclick=function(){cat=b.getAttribute('data-c');draw()}});
$('#iAdd').onclick=function(){var n=$('#iN').value.trim();if(!n){toast('نام کالا را وارد کن.',1);return}
var inv2=D('pp_inv',[]),ex=findIn(inv2,key(cat,n));
var it={c:cat,n:n,q:N0($('#iQ').value),u:STR($('#iU').value,'kg'),m:N0($('#iM').value)};
if(ex){ex.q=it.q;ex.u=it.u;ex.m=it.m}else{inv2.push(it)}
SV('pp_inv',inv2);toast('انبار به‌روزرسانی شد.');draw()}}
draw()};
RENDER.batch=function(){var bs=D('pp_batches',[]),b=null;for(var i=0;i<bs.length;i++){if(bs[i].st!=='done'){b=bs[i];break}}
var CHK=[['وضعیت راکتور',1],['آب‌بندی و درب',1],['اتصالات',1],['مخزن ضدانفجار',1],['مسیر خروجی گاز',1],['کندانسور',1],['مشعل‌ها',1],['برق و کنترل',1],['سایر',0]];
var canStart=['admin','supervisor','factory'].indexOf(S.user.role)>=0;
function draw(){var html=head('Batch و چرخه پخت','ایجاد → چک‌لیست → START → پایان پخت → Cooling → تخلیه');
if(!b){var mats=D('pp_mat',['لاستیک','پلاستیک']);
html+='<div class="panel"><h3>ایجاد Batch جدید</h3><div class="fgrid"><input class="inp" id="nR" placeholder="راکتور (R-01)"><select class="inp" id="nM">'+mats.map(function(m){return'<option>'+esc(m)+'</option>'}).join('')+'</select><input class="inp" type="number" id="nT" placeholder="تناژ (تن)"><input class="inp" id="nS" placeholder="شیفت (A/B/C)"></div><button class="fbtn" id="nAdd">ایجاد Batch</button></div>'}
else{var chk=b.chk?b.chk:CHK.map(function(){return false}),lock=false;
for(var k=0;k<CHK.length;k++){var crit=CHK[k][1];if(crit){if(!chk[k]){lock=true;break}}}
html+='<div class="panel"><h3>Batch فعال: '+esc(b.id)+' — '+esc(b.m)+'</h3><div class="tbw"><table><tr><th>✔</th><th>مورد کنترل</th><th>نوع</th></tr>';
for(var j=0;j<CHK.length;j++){html+='<tr><td><input type="checkbox" class="tick" data-i="'+j+'" '+(chk[j]?'checked':'')+'></td><td style="text-align:right">'+CHK[j][0]+'</td><td>'+(CHK[j][1]?'<span class="badc">بحرانی</span>':'<span style="color:#7d9bbd">عادی</span>')+'</td></tr>'}
html+='</table></div>'+(lock?'<div class="stbox st-lock">🔴 START LOCKED — آیتم‌های بحرانی را تیک بزن</div>':'<div class="stbox st-open">🟢 START UNLOCKED</div>');
var stTxt={created:'چک‌لیست را کامل کن',running:'🔥 راکتور در کار — ثبت ساعتی از منو',cooling:'❄️ Cooling — دمای مجاز تخلیه تا ۵۰ درجه',unload:'📤 خروجی‌ها را ثبت کن'};
html+='<p class="muted2">'+(stTxt[b.st]?stTxt[b.st]:'')+'</p>';
if(b.st=='created'){if(canStart)html+='<button class="fbtn" id="stGo">🔥 START REACTOR</button>'}
if(b.st=='running')html+='<button class="fbtn warn" id="stEnd">🛑 پایان پخت ← Cooling</button>';
if(b.st=='cooling'){if(canStart)html+='<div class="fgrid" style="margin-top:10px"><input class="inp" type="number" id="cT" placeholder="دمای کنونی (°C)"></div><button class="fbtn" id="stCool">✅ تأیید دمای مجاز</button>'}
if(b.st=='unload')html+='<div class="panel" style="margin-top:12px"><h3>ثبت خروجی</h3><div class="fgrid"><input class="inp" type="number" id="oOil" placeholder="روغن (لیتر)"><input class="inp" type="number" id="oCar" placeholder="کربن بلک (kg)"><input class="inp" type="number" id="oWire" placeholder="سیم (kg)"><input class="inp" type="number" id="oWst" placeholder="ضایعات (kg)"></div><button class="fbtn" id="oAdd">ثبت و اتمام Batch</button></div>';
html+='</div>'}
var hist='';bs.slice().reverse().forEach(function(x){var st={created:'📋',running:'🔥 در کار',cooling:'❄️',unload:'📤',done:'✅ تمام'}[x.st];if(!st)st=x.st;hist+='<tr><td dir="ltr"><b>'+esc(x.id)+'</b></td><td>'+esc(x.m)+'</td><td dir="ltr">'+fa(x.t)+' تن</td><td>'+esc(x.op)+'</td><td>'+st+'</td><td dir="ltr">'+(x.o2?fa(x.o2)+' L':'—')+'</td></tr>'});
html+='<div class="panel"><h3>تاریخچه Batchها</h3><div class="tbw"><table><tr><th>شناسه</th><th>خوراک</th><th>تناژ</th><th>اپراتور</th><th>وضعیت</th><th>روغن</th></tr>'+hist+'</table></div></div>';
$('#main').innerHTML=html;
$$('#main .tick').forEach(function(t){t.onchange=function(){var nt=$$('#main .tick');b.chk=CHK.map(function(c,k2){return nt[k2].checked});SV('pp_batches',bs);draw()}});
var n=$('#nAdd');if(n)n.onclick=function(){var t=N0($('#nT').value);if(!t){toast('تناژ را وارد کن.',1);return}
bs.push({id:'B-'+today().replace(/-/g,'').slice(2)+'-'+String(Date.now()).slice(-3),m:$('#nM').value,t:t,op:S.user.name,sh:STR($('#nS').value,'A'),d:today(),st:'created',chk:CHK.map(function(){return false})});
SV('pp_batches',bs);toast('Batch ایجاد شد.');draw()};
var g=$('#stGo');if(g)g.onclick=function(){b.st='running';b.start=now();SV('pp_batches',bs);toast('🔥 استارت شد — ثبت ساعتی آغاز شود');draw()};
var e=$('#stEnd');if(e)e.onclick=function(){b.st='cooling';b.cook=now();SV('pp_batches',bs);toast('پایان پخت — Cooling');draw()};
var c=$('#stCool');if(c)c.onclick=function(){var t=N0($('#cT').value);if(t>50){toast('دمای مجاز تا ۵۰ است. الان: '+t,1);return}b.st='unload';SV('pp_batches',bs);toast('آماده تخلیه ✅');draw()};
var o=$('#oAdd');if(o)o.onclick=function(){var oil=N0($('#oOil').value),car=N0($('#oCar').value),wr=N0($('#oWire').value);if(!(oil+car)){toast('خروجی را وارد کن.',1);return}
b.o2=oil;b.c2=car;b.w2=wr;b.st='done';b.end=now();
var inv=D('pp_inv',[]);
function addP(n2,q,u){if(!q)return;var f2=findIn(inv,key('prod',n2));if(f2){f2.q=N0(f2.q)+q}else{inv.push({c:'prod',n:n2,q:q,u:u,m:0})}}
addP('روغن',oil,'لیتر');addP('کربن بلک',car,'kg');addP('سیم',wr,'kg');
SV('pp_inv',inv);toast('خروجی ثبت شد — انبار محصولات به‌روز شد ✅');draw()}}
draw()};
RENDER.log=function(){var bs=D('pp_batches',[]),rb=null;for(var i=0;i<bs.length;i++){if(['running','cooling'].indexOf(bs[i].st)>=0){rb=bs[i];break}}
if(!rb){$('#main').innerHTML=head('ثبت ساعتی','')+'<div class="panel"><p>Batch فعالی نیست — اول از «Batch و چرخه پخت» استارت کن.</p></div>';return}
var sop=D('pp_sop',{a:220,b:270,c:320});function clr(t){if(t>=sop.b)return'badc';if(t>=sop.a)return'warnc';return'okc'}
var arr=D('pp_log',[]).filter(function(l){return l.bid===rb.id});
var rows=arr.map(function(r){return'<tr><td><b dir="ltr">'+r.t+'</b></td><td class="'+clr(r.r)+'" dir="ltr">'+fa(r.r)+'°</td><td dir="ltr">'+fa(r.c)+'</td><td dir="ltr">'+fa(r.p)+'</td><td dir="ltr">'+fa(r.b)+'/6</td></tr>'}).join('');
$('#main').innerHTML=head('ثبت ساعتی — '+rb.id,'🟢 عادی · 🟠 بالای '+sop.a+' درجه · 🔴 بالای '+sop.b+' درجه')+'<div class="panel"><h3>رکورد جدید</h3><div class="fgrid"><input class="inp" id="lT" value="'+now()+'"><input class="inp" type="number" id="lR" placeholder="دمای راکتور °C"><input class="inp" type="number" id="lC" placeholder="کندانسور °C"><input class="inp" type="number" id="lP" placeholder="فشار Bar"><input class="inp" type="number" id="lB" placeholder="مشعل فعال (تا ۶)"><input class="inp" id="lN" placeholder="توضیح"></div><button class="fbtn" id="lAdd">ثبت رکورد</button></div><div class="panel"><h3>رکوردها ('+fa(arr.length)+')</h3><div class="tbw"><table><tr><th>ساعت</th><th>راکتور</th><th>کندانسور</th><th>فشار</th><th>مشعل</th></tr>'+rows+'</table></div></div>';
$('#lAdd').onclick=function(){if($('#lR').value===''){toast('دمای راکتور را وارد کن.',1);return}var all=D('pp_log',[]);all.push({bid:rb.id,t:$('#lT').value,r:N0($('#lR').value),c:N0($('#lC').value),p:N0($('#lP').value),b:N0($('#lB').value),n:$('#lN').value});SV('pp_log',all);toast('ثبت شد ✅');RENDER.log()}};
RENDER.sales=function(){var inv=D('pp_inv',[]),prods=inv.filter(isCat('prod')).filter(function(i){return N0(i.q)>0}),sl=D('pp_sales',[]);
var due=0;sl.forEach(function(x){due+=N0(x.q)*N0(x.p)-N0(x.paid)});
var rows=sl.slice().reverse().map(function(x){var m=N0(x.q)*N0(x.p),rem=m-N0(x.paid);return'<tr><td>'+esc(x.d)+'</td><td>'+esc(x.cu)+'</td><td>'+esc(x.pr)+'</td><td dir="ltr">'+fmt(x.q)+'</td><td dir="ltr">'+fmt(m)+'</td><td class="okc" dir="ltr">'+fmt(x.paid)+'</td><td class="'+(rem>0?'badc':'okc')+'" dir="ltr">'+fmt(rem)+'</td></tr>'}).join('');
$('#main').innerHTML=head('فروش','فروش → کسر موجودی + درآمد + مطالبات')+'<div class="panel"><h3>ثبت فروش</h3><div class="fgrid"><input class="inp" type="date" id="sD" value="'+today()+'"><input class="inp" id="sC" placeholder="مشتری"><select class="inp" id="sP">'+(prods.length?prods.map(function(p){return'<option>'+esc(p.n)+'</option>'}).join(''):'<option>— محصولی نیست —</option>')+'</select></div><div class="fgrid"><input class="inp" type="number" id="sQ" placeholder="مقدار"><input class="inp" type="number" id="sPr" placeholder="قیمت هر واحد (ریال)"><input class="inp" type="number" id="sPd" placeholder="دریافت‌شده (ریال)"></div><button class="fbtn" id="sAdd">ثبت فروش</button><p class="muted2">مطالبات وصول‌نشده: <b>'+fmt(due)+'</b> ریال</p></div><div class="panel"><h3>فروش‌ها</h3><div class="tbw"><table><tr><th>تاریخ</th><th>مشتری</th><th>محصول</th><th>مقدار</th><th>کل</th><th>دریافتی</th><th>مانده</th></tr>'+rows+'</table></div></div>';
$('#sAdd').onclick=function(){var pn=$('#sP').value,q=N0($('#sQ').value),pr=N0($('#sPr').value),paid=N0($('#sPd').value);
if(pn.indexOf('—')===0){toast('محصولی در انبار نیست.',1);return}
if(!q){toast('مقدار را وارد کن.',1);return}
if(!pr){toast('قیمت را وارد کن.',1);return}
var p=findIn(inv,key('prod',pn));
if(!p){toast('محصول یافت نشد.',1);return}
if(N0(p.q)<q){toast('موجودی کافی نیست.',1);return}
p.q=N0(p.q)-q;SV('pp_inv',inv);
sl.push({d:$('#sD').value,cu:STR($('#sC').value,'—'),pr:pn,q:q,p:pr,paid:paid});SV('pp_sales',sl);
var fin=D('pp_fin',[]);fin.push({d:$('#sD').value,t:'in',de:'فروش '+pn, a:paid});SV('pp_fin',fin);
toast('فروش ثبت شد ✅');RENDER.sales()}};
RENDER.fin=function(){var fin=D('pp_fin',[]),inc=0,exp=0;fin.forEach(function(f){if(f.t==='in')inc+=N0(f.a);else exp+=N0(f.a)});
var rows=fin.slice().reverse().map(function(f){return'<tr><td>'+esc(f.d)+'</td><td>'+(f.t==='in'?'<span class="okc">درآمد</span>':'<span class="badc">هزینه</span>')+'</td><td style="text-align:right">'+esc(f.de)+'</td><td dir="ltr">'+fmt(f.a)+'</td></tr>'}).join('');
$('#main').innerHTML=head('امور مالی','درآمد منهای هزینه = سود')+'<div class="kpis"><div class="kpi k-green"><i>📈</i><div><h5>درآمد</h5><div class="v">'+fmt(inc)+'</div></div></div><div class="kpi k-org"><i>📉</i><div><h5>هزینه</h5><div class="v">'+fmt(exp)+'</div></div></div><div class="kpi '+((inc-exp)>=0?'k-green':'k-red')+'"><i>💎</i><div><h5>سود خالص</h5><div class="v">'+fmt(inc-exp)+'</div></div></div></div><div class="panel"><h3>ثبت دستی</h3><div class="fgrid"><select class="inp" id="fT"><option value="in">درآمد</option><option value="out">هزینه</option></select><input class="inp" type="date" id="fD" value="'+today()+'"><input class="inp" id="fDe" placeholder="شرح"><input class="inp" type="number" id="fA" placeholder="مبلغ (ریال)"></div><button class="fbtn" id="fAdd">ثبت</button></div><div class="panel"><h3>دفتر تراکنش‌ها</h3><div class="tbw"><table><tr><th>تاریخ</th><th>نوع</th><th>شرح</th><th>مبلغ</th></tr>'+rows+'</table></div></div>';
$('#fAdd').onclick=function(){var a=N0($('#fA').value);if(!a){toast('مبلغ را وارد کن.',1);return}fin.push({d:$('#fD').value,t:$('#fT').value,de:STR($('#fDe').value,'—'),a:a});SV('pp_fin',fin);toast('ثبت شد ✅');RENDER.fin()}};
RENDER.tm=function(){var inv=D('pp_inv',[]),parts=inv.filter(isCat('part')),arr=D('pp_tm',[]);
var rows=arr.slice().reverse().map(function(x){return'<tr><td>'+esc(x.d)+'</td><td dir="ltr">'+esc(x.e)+'</td><td>'+esc(x.p)+'</td><td dir="ltr">'+fa(x.q)+'</td><td>'+esc(x.w)+'</td><td dir="ltr">'+fmt(x.c)+'</td></tr>'}).join('');
$('#main').innerHTML=head('تعمیرات و نگهداری','مصرف قطعه → کسر انبار + هزینه مالی')+'<div class="panel"><h3>ثبت تعمیر</h3><div class="fgrid"><input class="inp" type="date" id="tD" value="'+today()+'"><input class="inp" id="tE" value="R-01"><select class="inp" id="tP">'+(parts.length?parts.map(function(p){return'<option>'+esc(p.n)+'</option>'}).join(''):'<option value="">— قطعه‌ای نیست —</option>')+'</select></div><div class="fgrid"><input class="inp" type="number" id="tQ" placeholder="تعداد"><input class="inp" id="tW" placeholder="تعمیرکار"><input class="inp" type="number" id="tC" placeholder="هزینه (ریال)"></div><input class="inp" id="tX" placeholder="شرح کار" style="margin-bottom:10px"><button class="fbtn" id="tAdd">ثبت</button></div><div class="panel"><h3>سابقه</h3><div class="tbw"><table><tr><th>تاریخ</th><th>تجهیز</th><th>قطعه</th><th>تعداد</th><th>نیرو</th><th>هزینه</th></tr>'+rows+'</table></div></div>';
$('#tAdd').onclick=function(){var q=N0($('#tQ').value),c=N0($('#tC').value),pn=$('#tP').value;
if(pn){var f2=findIn(inv,key('part',pn));if(!f2){toast('قطعه در انبار نیست.',1);return}
if(N0(f2.q)<q){toast('موجودی قطعه کافی نیست.',1);return}
f2.q=N0(f2.q)-q;SV('pp_inv',inv)}
arr.push({d:$('#tD').value,e:STR($('#tE').value,'—'),p:pn?pn:'—',q:q,w:STR($('#tW').value,S.user.name),c:c,x:$('#tX').value});SV('pp_tm',arr);
if(c){var fin=D('pp_fin',[]);fin.push({d:$('#tD').value,t:'out',de:'تعمیر '+STR($('#tE').value,''),a:c});SV('pp_fin',fin)}
toast('ثبت شد 🔧');RENDER.tm()}};
RENDER.users=function(){var us=D('pp_users',[]);
var rows=us.map(function(u,i){var rn=ROLES[u.role]?(ROLES[u.role][1]+' '+ROLES[u.role][0]):u.role;return'<tr><td>'+esc(u.name)+'</td><td dir="ltr">'+esc(u.email)+'</td><td>'+rn+'</td><td><select class="rolesel" data-i="'+i+'">'+Object.keys(ROLES).map(function(k){return'<option value="'+k+'" '+(u.role===k?'selected':'')+'>'+ROLES[k][1]+' '+ROLES[k][0]+'</option>'}).join('')+'</select></td></tr>'}).join('');
$('#main').innerHTML=head('کاربران و نقش‌ها','نقش هر نفر را انتخاب و ذخیره کن')+'<div class="panel"><div class="tbw"><table><tr><th>نام</th><th>ایمیل</th><th>نقش فعلی</th><th>تغییر نقش</th></tr>'+rows+'</table></div><button class="fbtn"
