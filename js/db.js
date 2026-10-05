// Semua komunikasi dengan database ada di file ini.
var sb = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
function toItem(r){return{id:r.id,nama:r.nama,gudang:r.gudang,sat:r.sat,min:+r.minimum,pantau:r.pantau,awal:+r.awal}}
function toTx(r){return{id:r.id,tgl:r.tgl,item:r.item_id,jenis:r.jenis,jml:+r.jml,sat:r.sat}}
function ok(r){if(r.error)throw r.error;return r.data}
var DB={
  async user(){var r=await sb.auth.getSession();return r.data.session&&r.data.session.user},
  login(email,pass){return sb.auth.signInWithPassword({email:email,password:pass})},
  logout(){return sb.auth.signOut()},
  async all(t){var out=[],from=0;for(;;){var d=ok(await sb.from(t).select("*").order("created_at").range(from,from+999));out=out.concat(d);if(d.length<1000)break;from+=1000}return out},
  async load(){var a=await Promise.all([DB.all("items"),DB.all("tx")]);return{items:a[0].map(toItem),tx:a[1].map(toTx)}},
  async addItem(i){ok(await sb.from("items").insert({nama:i.nama,gudang:i.gudang,sat:i.sat,minimum:i.min,awal:i.awal}))},
  async updItem(id,patch){var p={};for(var k in patch)p[k==="min"?"minimum":k]=patch[k];ok(await sb.from("items").update(p).eq("id",id))},
  async delItem(id){ok(await sb.from("items").delete().eq("id",id))},
  async addTx(t){ok(await sb.from("tx").insert({tgl:t.tgl,item_id:t.item,jenis:t.jenis,jml:t.jml,sat:t.sat}))},
  async delTx(id){ok(await sb.from("tx").delete().eq("id",id))}
};
