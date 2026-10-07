// Fungsi bersama untuk semua halaman.
var G=["Kering","Basah","Alat"],U=["Kg","Pouch","Saset","Botol","Bungkus","Kotak","PCS"],S={items:[],tx:[]},F={g:"",q:"",j:"",d1:"",d2:"",grp:""},NAVP="";
var PAGES=[["index","Beranda"],["stok","Stok barang"],["habis","Barang habis"],["masuk","Barang masuk"],["keluar","Barang keluar"],["sisa","Sisa stok"],["riwayat","Riwayat"],["barang","Data barang"],["cetak","Cetak PDF"]];
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function val(id){return document.getElementById(id).value}
function today(){var d=new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function item(id){return S.items.filter(function(i){return i.id===id})[0]}
function opt(arr,sel,all){return(all?'<option value="">'+all+'</option>':"")+arr.map(function(a){return'<option'+(a===sel?" selected":"")+'>'+esc(a)+'</option>'}).join("")}
function calc(it,from,to,sat){sat=sat||it.sat;var a=(sat===it.sat?it.awal:0)||0,m=0,k=0;S.tx.forEach(function(t){if(t.item!==it.id||(t.sat||it.sat)!==sat)return;var q=t.jml*(t.jenis==="masuk"?1:-1);
if(from&&t.tgl<from)a+=q;else if(!to||t.tgl<=to){if(t.jenis==="masuk")m+=t.jml;else k+=t.jml}});
var r=function(x){return Math.round(x*1000)/1000};return{awal:r(a),masuk:r(m),keluar:r(k),sisa:r(a-k),real:r(a-k+m)}}
function units(it){var u=[it.sat];S.tx.forEach(function(t){if(t.item===it.id&&t.sat&&u.indexOf(t.sat)<0)u.push(t.sat)});return u}
function stokTxt(it){return units(it).map(function(u){return calc(it,"","",u).real+" "+esc(u)}).join(", ")}
function stok(it){return calc(it,"","").real}
function status(it){var s=stok(it);if(!it.pantau)return"";return s<=0?'<span class="t o">Habis</span>':s<=it.min?'<span class="t l">Menipis</span>':'<span class="t k">Aman</span>'}
function low(){return S.items.filter(function(i){return i.pantau&&stok(i)<=i.min})}
function tbl(h,rows){return'<div class="tw"><table><tr>'+h.map(function(x){return'<th'+(x[0]==="#"?' class="n"':"")+'>'+x.replace("#","")+'</th>'}).join("")+'</tr>'+(rows||'<tr><td colspan="9" class="empty">Belum ada data.</td></tr>')+'</table></div>'}
var ROLE="",EDIT=["masuk","keluar","sisa","barang"];
function drawNav(){document.getElementById("nav").innerHTML=PAGES.filter(function(p){return ROLE==="editor"||EDIT.indexOf(p[0])<0}).map(function(p){return'<a class="'+(p[0]===NAVP?"on":"")+'" href="'+p[0]+'.html">'+p[1]+'</a>'}).join("")+'<button onclick="keluarAkun()">Keluar ('+(ROLE==="editor"?"Editor":"Pelihat")+')</button>'}
async function keluarAkun(){await DB.logout();location.href="login.html"}
async function boot(page,title,render,after){
  var v=document.getElementById("v");v.innerHTML='<div class="empty">Memuat data...</div>';
  try{var u=await DB.user();if(!u){location.href="login.html";return}
    ROLE=await DB.role();if(EDIT.indexOf(page)>-1&&ROLE!=="editor"){location.href="index.html";return}
    NAVP=page;drawNav();S=await DB.load()}
  catch(e){v.innerHTML='<div class="card">Gagal terhubung ke database: '+esc(e.message)+'<br>Periksa js/config.js dan pastikan schema.sql sudah dijalankan.</div>';return}
  window.REDRAW=function(){v.innerHTML='<h1 class="noprint">'+title+'</h1><section class="panel">'+render()+'</section>';if(after)after()};
  REDRAW()}
async function reload(){S=await DB.load();REDRAW()}
function filt(){F.g=val("fg");var e=document.getElementById("fq");F.q=e?e.value:"";REDRAW();e=document.getElementById("fq");if(e){e.focus();e.setSelectionRange(99,99)}}
function msg(m){document.getElementById("msg").textContent=m}
// Form barang masuk / keluar (dipakai masuk.html dan keluar.html)
function gudangDipilih(){try{return sessionStorage.getItem("gdg")||G[0]}catch(e){return G[0]}}
function itemOpts(g){return S.items.filter(function(i){return i.gudang===g}).sort(function(a,b){return a.nama>b.nama?1:-1}).map(function(i){return'<option value="'+i.id+'">'+esc(i.nama)+'</option>'}).join("")||'<option value="">(belum ada barang di gudang ini)</option>'}
function gantiGudang(){var g=val("fgd");try{sessionStorage.setItem("gdg",g)}catch(e){}document.getElementById("fi").innerHTML=itemOpts(g);unitLbl()}
function formTx(j,only){var g=only||gudangDipilih();return'<div class="card"><div class="row"><label>Gudang<select id="fgd" onchange="gantiGudang()">'+opt(only?[only]:G,g)+'</select></label><label>Tanggal<input type="date" id="ft" value="'+today()+'"></label></div><div class="row"><label>Barang<select id="fi" onchange="unitLbl()">'+itemOpts(g)+'</select></label><label>Jumlah<span style="display:flex;gap:6px"><input id="fj" type="number" min="0" step="any" value="1" style="width:100px" onkeydown="if(event.key===\'Enter\')addTx(\''+j+'\')"><select id="fs">'+opt(U)+'</select></span></label><button class="b p" onclick="addTx(\''+j+'\')">Simpan</button></div><div id="msg" class="mute"></div></div>'}
function unitLbl(){var it=item(val("fi")),s=document.getElementById("fs");if(!it)return;if([].slice.call(s.options).every(function(o){return o.value!==it.sat}))s.add(new Option(it.sat,it.sat));s.value=it.sat}
async function addTx(j){var n=parseFloat(val("fj"));if(!(n>0)){msg("Jumlah harus lebih dari 0.");return}
  var it=item(val("fi"));if(!it){msg("Pilih barang terlebih dahulu.");return}var u=val("fs"),cur=calc(it,"","",u).real;
  if(j==="keluar"&&n>cur&&!confirm("Jumlah melebihi stok ("+cur+" "+u+"). Tetap simpan?"))return;
  try{await DB.addTx({tgl:val("ft")||today(),item:it.id,jenis:j,jml:n,sat:u});S=await DB.load();msg("Tersimpan: "+it.nama+" "+j+" "+n+" "+u+". Stok "+u+" sekarang "+calc(it,"","",u).real+".");document.getElementById("fj").value="";document.getElementById("fi").focus()}
  catch(e){msg("Gagal menyimpan: "+e.message)}}

// Pilihan gudang berbentuk tombol (dipakai di Data barang); pilihan diingat selama tab terbuka
function pilihGudang(){var g=gudangDipilih();return'<div class="pills">'+G.map(function(x){return'<button type="button" class="pill'+(x===g?" on":"")+'" onclick="setGudang(\''+x+'\')">'+x+'</button>'}).join("")+'</div>'}
function setGudang(g){try{sessionStorage.setItem("gdg",g)}catch(e){}[].slice.call(document.querySelectorAll(".pill")).forEach(function(b){b.classList.toggle("on",b.textContent===g)})}
