// Fungsi bersama untuk semua halaman.
var G=["Kering","Basah","Alat"],U=["Kg","Pouch","Saset","Botol","Bungkus"],S={items:[],tx:[]},F={g:"",q:"",j:"",d1:"",d2:"",grp:""},NAVP="";
var PAGES=[["index","Beranda","Beranda"],["stok","Stok","Stok barang"],["habis","Habis","Barang habis"],["masuk","Masuk","Barang masuk"],["keluar","Keluar","Barang keluar (Alat)"],["sisa","Sisa","Sisa stok (Kering & Basah)"],["riwayat","Riwayat","Riwayat"],["barang","Barang","Data barang"],["cetak","Cetak","Cetak PDF"]];
var IC={index:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',stok:'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',habis:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',masuk:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>',keluar:'<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 17v3h16v-3"/>',sisa:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 14l2 2 4-4"/>',riwayat:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',barang:'<path d="M4 6h16M4 12h16M4 18h10"/>',cetak:'<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7"/>',logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',tema:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'};
function ico(k){return'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg>'}
try{if(localStorage.getItem("tema")==="gelap")document.documentElement.setAttribute("data-theme","dark")}catch(e){}
function gantiTema(){var d=document.documentElement,g=d.getAttribute("data-theme")==="dark";if(g)d.removeAttribute("data-theme");else d.setAttribute("data-theme","dark");try{localStorage.setItem("tema",g?"terang":"gelap")}catch(e){}}
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
var SIBUK=false;
var ROLE="",EDIT=["masuk","keluar","sisa","barang"];
function drawNav(){document.getElementById("nav").innerHTML='<img class="brand" src="img/logo.png" alt="">'+PAGES.filter(function(p){return ROLE==="editor"||EDIT.indexOf(p[0])<0}).map(function(p){return'<a class="'+(p[0]===NAVP?"on":"")+'" href="'+p[0]+'.html" title="'+esc(p[2])+'">'+ico(p[0])+'<span>'+p[1]+'</span></a>'}).join("")+'<button class="gap" onclick="gantiTema()" title="Mode terang / gelap">'+ico("tema")+'<span>Tema</span></button><button onclick="keluarAkun()" title="Keluar dari akun ('+(ROLE==="editor"?"Editor":"Pelihat")+')">'+ico("logout")+'<span>Logout</span></button>'}
async function keluarAkun(){await DB.logout();location.href="login.html"}
async function boot(page,title,render,after){
  var v=document.getElementById("v");v.innerHTML='<div class="empty">Memuat data...</div>';
  try{var u=await DB.user();if(!u){location.href="login.html";return}
    ROLE=await DB.role();if(EDIT.indexOf(page)>-1&&ROLE!=="editor"){location.href="index.html";return}
    NAVP=page;drawNav();S=await DB.load()}
  catch(e){v.innerHTML='<div class="card">Gagal terhubung ke database: '+esc(e.message)+'<br>Periksa js/config.js dan pastikan schema.sql sudah dijalankan.</div>';return}
  window.REDRAW=function(){v.innerHTML='<div class="top noprint"><h1>'+title+'</h1><div class="chips"><span class="chip">'+new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})+'</span><span class="chip dark">'+(ROLE==="editor"?"Editor":"Pelihat")+'</span></div></div><section class="panel">'+render()+'</section>';if(after)after()};
  REDRAW()}
async function reload(){S=await DB.load();REDRAW()}
function filt(){F.g=val("fg");var e=document.getElementById("fq");F.q=e?e.value:"";REDRAW();e=document.getElementById("fq");if(e){e.focus();e.setSelectionRange(99,99)}}
function msg(m){document.getElementById("msg").textContent=m}
// Form barang masuk / keluar (dipakai masuk.html dan keluar.html)
function gudangDipilih(){try{return sessionStorage.getItem("gdg")||G[0]}catch(e){return G[0]}}
function itemOpts(g){return S.items.filter(function(i){return i.gudang===g}).sort(function(a,b){return a.nama>b.nama?1:-1}).map(function(i){return'<option value="'+i.id+'">'+esc(i.nama)+'</option>'}).join("")||'<option value="">(belum ada barang di gudang ini)</option>'}
function gantiGudang(){var g=val("fgd");try{sessionStorage.setItem("gdg",g)}catch(e){}document.getElementById("brs").innerHTML="";tambahBaris()}
function formTx(j,only){var g=only||gudangDipilih();return'<div class="card"><div class="row"><label>Gudang<select id="fgd" onchange="gantiGudang()">'+opt(only?[only]:G,g)+'</select></label><label>Tanggal<input type="date" id="ft" value="'+today()+'"></label></div><div class="tw"><table class="brt"><thead><tr><th>Barang</th><th>Jumlah</th><th>Satuan</th><th></th></tr></thead><tbody id="brs"></tbody></table></div><div class="row" style="margin-top:14px"><button type="button" class="b" onclick="tambahBaris()">+ Tambah baris</button><button class="b p" id="btnsimpan" onclick="addTx(\''+j+'\')">Simpan semua</button></div><div class="mute" style="font-size:.8rem">Tekan Enter di kolom Jumlah untuk pindah ke baris berikutnya. Baris tanpa jumlah diabaikan.</div><div id="msg" class="mute" style="white-space:pre-line;margin-top:10px"></div></div>'}
function tambahBaris(){var g=val("fgd"),tr=document.createElement("tr");tr.innerHTML='<td><select class="rb" onchange="satuanBaris(this)">'+itemOpts(g)+'</select></td><td><input class="rj" type="number" min="0" step="any" style="width:110px" onkeydown="entBaris(event,this)"></td><td><select class="rs">'+opt(U)+'</select></td><td><button type="button" class="b d" onclick="hapusBaris(this)" title="Hapus baris">&times;</button></td>';document.getElementById("brs").appendChild(tr);satuanBaris(tr.querySelector(".rb"));tr.querySelector(".rb").focus()}
function satuanBaris(sel){var it=item(sel.value),s=sel.closest("tr").querySelector(".rs");if(!it)return;if([].slice.call(s.options).every(function(o){return o.value!==it.sat}))s.add(new Option(it.sat,it.sat));s.value=it.sat}
function entBaris(e,inp){if(e.key!=="Enter")return;e.preventDefault();var tr=inp.closest("tr");if(!tr.nextSibling)tambahBaris();else tr.nextSibling.querySelector(".rb").focus()}
function hapusBaris(b){var tr=b.closest("tr");tr.parentNode.removeChild(tr);if(!document.querySelector("#brs tr"))tambahBaris()}
function unitLbl(){if(!document.querySelector("#brs tr"))tambahBaris()} // dipanggil masuk.html/keluar.html setelah halaman tampil
function btnState(b,lbl){var e=document.getElementById("btnsimpan");if(e){e.disabled=b;e.textContent=b?"Menyimpan...":(lbl||"Simpan")}}
async function addTx(j){if(SIBUK)return;
var tgl=val("ft")||today(),list=[],err=[];
[].slice.call(document.querySelectorAll("#brs tr")).forEach(function(tr,k){var v=tr.querySelector(".rj").value;if(v==="")return;var it=item(tr.querySelector(".rb").value),n=parseFloat(v);
if(!it||!(n>0)){err.push("Baris "+(k+1)+": barang atau jumlah tidak valid");return}
list.push({tgl:tgl,item:it.id,jenis:j,jml:n,sat:tr.querySelector(".rs").value})});
if(err.length){msg(err.join("\n"));return}
if(!list.length){msg("Belum ada jumlah yang diisi.");return}
if(j==="keluar"){var tot={};list.forEach(function(x){var k=x.item+"|"+x.sat;tot[k]=(tot[k]||0)+x.jml});
var lebih=Object.keys(tot).filter(function(k){var p=k.split("|");return tot[k]>calc(item(p[0]),"","",p[1]).real}).map(function(k){var p=k.split("|");return item(p[0]).nama+" ("+p[1]+")"});
if(lebih.length&&!confirm("Jumlah melebihi stok untuk:\n"+lebih.join("\n")+"\nTetap simpan?"))return}
var sama=list.filter(function(x){return S.tx.some(function(t){return t.item===x.item&&t.tgl===x.tgl&&t.jenis===x.jenis&&t.jml===x.jml&&(t.sat||item(x.item).sat)===x.sat})});
if(sama.length&&!confirm(sama.length+" baris sama persis dengan catatan yang sudah ada (barang, tanggal, jumlah, satuan). Tetap simpan semua?"))return;
SIBUK=true;btnState(true);
try{await DB.addTxMany(list);S=await DB.load();document.getElementById("brs").innerHTML="";tambahBaris();msg("Tersimpan "+list.length+" baris ("+j+") untuk tanggal "+tgl+".")}
catch(e){msg("Gagal menyimpan: "+e.message)}
SIBUK=false;btnState(false,"Simpan semua")}

// Pilihan gudang berbentuk tombol (dipakai di Data barang); pilihan diingat selama tab terbuka
function pilihGudang(){var g=gudangDipilih();return'<div class="pills">'+G.map(function(x){return'<button type="button" class="pill'+(x===g?" on":"")+'" onclick="setGudang(\''+x+'\')">'+x+'</button>'}).join("")+'</div>'}
function setGudang(g){try{sessionStorage.setItem("gdg",g)}catch(e){}[].slice.call(document.querySelectorAll(".pill")).forEach(function(b){b.classList.toggle("on",b.textContent===g)})}

// ---- Ekspor ke Excel (cadangan CSV bila Excel tidak bisa dimuat) ----
function unduhCSV(nama,rows){var csv="\ufeff"+rows.map(function(r){return r.map(function(c){c=c==null?"":(typeof c==="number"?String(c).replace(".",","):String(c));return/[;"\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(";")}).join("\r\n");var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download=nama+".csv";document.body.appendChild(a);a.click();a.remove()}
function muatXLSX(){return window.XLSX?Promise.resolve():new Promise(function(ok,gagal){var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";s.onload=ok;s.onerror=gagal;document.head.appendChild(s)})}
function unduhExcel(nama,rows){nama=nama+"-"+today();muatXLSX().then(function(){var ws=XLSX.utils.aoa_to_sheet(rows),w=[];rows.forEach(function(r){r.forEach(function(c,i){w[i]=Math.max(w[i]||8,String(c==null?"":c).length+2)})});ws["!cols"]=w.map(function(x){return{wch:Math.min(x,40)}});var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Data");XLSX.writeFile(wb,nama+".xlsx")}).catch(function(){unduhCSV(nama,rows);alert("File Excel tidak bisa disiapkan (periksa koneksi internet), jadi data diunduh sebagai CSV.")})}
// ---- Pasang di layar HP (PWA) ----
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
