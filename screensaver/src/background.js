/* שומר מסך – מנוע רקע – חד בדרא – v1.6.1
   פעילות נקבעת לפי אירועי הקורא וגם לפי שינוי במצב הקורא (ספר, מיקום, כרטיסיות).
   שומר המסך נפתח רק אחרי הזמן שהוגדר ללא שום שינוי, ואם הוגדר – רק כשספר פתוח. */
(function(){
'use strict';
var D={enabled:true,idleMin:2,runMin:10,onlyInBook:true,quiet:false,quietFrom:'12:00',quietTo:'13:30'};
function inQuiet(s){if(!s.quiet)return false;var n=new Date(),t=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2),f=s.quietFrom,u=s.quietTo;return f<=u?(t>=f&&t<u):(t>=f||t<u)}
var last=Date.now(),shownAt=0,sig='',lastEn=null,GRACE=10000,TICK=5000;
function call(m,p){try{return Otzaria.call(m,p||{})}catch(e){return Promise.resolve({success:false})}}
async function get(k){try{var r=await call('storage.get',{key:k});return(r&&r.success)?r.data:null}catch(e){return null}}
function bump(){var n=Date.now();if(shownAt&&n-shownAt<GRACE)return;last=n}
['reader.current_ref_changed','reader.current_book_changed','reader.sectionContentChanged','reader.selection_changed','navigation.changed','workspace.changed','settings.changed','reader.toolbar_item_clicked'].forEach(function(e){try{Otzaria.on(e,bump)}catch(x){}});
async function poll(){
  var r=await call('reader.getCurrentState');if(!(r&&r.success&&r.data))return null;var d=r.data;
  var s=JSON.stringify([d.currentId,d.currentBookId,d.currentIndex,d.currentRef,(d.openTabs||[]).map(function(t){return[t.id,t.toolId,t.index,t.currentRef,t.isSelf]})]);
  if(sig&&s!==sig)bump();sig=s;return d;
}
async function tick(){
  try{
    var st=Object.assign({},D,(await get('settings'))||{}),en=await get('ss_enabled');if(typeof en==='boolean')st.enabled=en;
    if(lastEn!==null&&lastEn!==st.enabled)call('notifications.showInApp',{message:st.enabled?'שומר המסך הופעל':'שומר המסך כובה',type:st.enabled?'success':'info'});
    lastEn=st.enabled;
    var d=await poll();if(!st.enabled)return;
    var dis=(await get('ss_dismiss'))||0;if(shownAt&&dis>shownAt){shownAt=0;last=Date.now()}
    if(shownAt)return;
    if(inQuiet(st))return;
    if(Date.now()-Math.max(last,dis)<st.idleMin*60000)return;
    if(st.onlyInBook&&!(d&&d.currentType))return;   /* באמצע חיפוש/כלי אחר – לא מפריעים */
    shownAt=Date.now();
    var r=await call('plugin.openSelf',{param:{screensaver:true}});
    if(!(r&&r.success&&r.data)){shownAt=0;last=Date.now()}
  }catch(e){}
}
async function tbState(){var en=await get('ss_enabled'),on=(en!==false);return{title:on?'שומר מסך פעיל – לחצו לכיבוי':'שומר מסך כבוי – לחצו להדלקה',icon:on?'weather_moon_24_filled':'weather_moon_24_regular'}}
async function reg(){var s=await tbState();await call('reader.addToolbarItem',{id:'ss-toggle',title:s.title,icon:s.icon})}
async function toggle(){
  var en=await get('ss_enabled');await call('storage.set',{key:'ss_enabled',value:(en===false)});
  var s=await tbState();await call('reader.updateToolbarItem',{id:'ss-toggle',patch:{title:s.title,icon:s.icon}});last=Date.now();tick();
}
try{Otzaria.on('reader.toolbar_item_clicked',function(d){if(d&&d.itemId==='ss-toggle')toggle()})}catch(e){}
Otzaria.on('plugin.boot',function(){last=Date.now();reg();setInterval(tick,TICK)});
})();
