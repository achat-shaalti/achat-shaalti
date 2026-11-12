/* שומר מסך לאוצריא – חד בדרא – v1.3.0 */
(function(){
'use strict';
var VERSION='1.7.0';
var DEFAULTS={enabled:true,keepAwake:true,onlyInBook:true,idleMin:2,runMin:10,style:'brand',v:2,slogan:'אוצריא מאגר תורני חינמי, רחב ומהיר לשימוש בכל מקום.',bg:'light',bgColor:'#f6ede5',showClock:false,showVerse:true,quotesLib:true,quiet:false,quietFrom:'12:00',quietTo:'13:30'};
var STYLES=[['brand','ספר וסלוגן','כמו באתר אוצריא','bk'],['splash','ספר נפתח','מקומות משתנים','bk'],['float','ספר צף','מרחף על המסך','bk'],['bubbles','בועות אוצריא','בועות עם הספר','bk'],['quotes','ציטוטים','עם קישור למקור','"'],['bookq','ספר וציטוטים','ספר פתוח ומתחתיו ציטוט','bk']];
var QUOTES=[
 {t:'וידוע לחכמי האמת שיש מלאך א\' נקרא ש"ד והוא שומר דפין על מי שמניח ספר פתוח ויוצא שמשכח תלמודו',src:'ש"ך יורה דעה רעז, ס"ק א',refs:['שפתי כהן יורה דעה רעז','ש"ך יורה דעה רעז']},
 {t:'לֹא יָמוּשׁ סֵפֶר הַתּוֹרָה הַזֶּה מִפִּיךָ, וְהָגִיתָ בּוֹ יוֹמָם וָלַיְלָה',src:'יהושע א, ח',refs:['יהושע א:ח','יהושע א']},
 {t:'וּבְתוֹרָתוֹ יֶהְגֶּה יוֹמָם וָלָיְלָה',src:'תהילים א, ב',refs:['תהילים א:ב','תהילים א']},
 {t:'וְדִבַּרְתָּ בָּם בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ וּבְשָׁכְבְּךָ וּבְקוּמֶךָ',src:'דברים ו, ז',refs:['דברים ו:ז','דברים ו']},
 {t:'כִּי שֶׁבַע יִפּוֹל צַדִּיק וָקָם',src:'משלי כד, טז',refs:['משלי כד:טז','משלי כד']},
 {t:'מה אהבתי תורתך, כל היום היא שיחתי',src:'תהילים קיט, צז',refs:['תהילים קיט:צז','תהילים קיט']},
 {t:'נר לרגלי דברך ואור לנתיבתי',src:'תהילים קיט, קה',refs:['תהילים קיט:קה','תהילים קיט']},
 {t:'גל עיני ואביטה נפלאות מתורתך',src:'תהילים קיט, יח',refs:['תהילים קיט:יח','תהילים קיט']},
 {t:'טוב לי תורת פיך מאלפי זהב וכסף',src:'תהילים קיט, עב',refs:['תהילים קיט:עב','תהילים קיט']},
 {t:'לולי תורתך שעשעי, אז אבדתי בעניי',src:'תהילים קיט, צב',refs:['תהילים קיט:צב','תהילים קיט']},
 {t:'תורת ה\' תמימה משיבת נפש',src:'תהילים יט, ח',refs:['תהילים יט:ח','תהילים יט']},
 {t:'למנות ימינו כן הודע, ונבא לבב חכמה',src:'תהילים צ, יב',refs:['תהילים צ:יב','תהילים צ']},
 {t:'עץ חיים היא למחזיקים בה, ותמכיה מאשר',src:'משלי ג, יח',refs:['משלי ג:יח','משלי ג']},
 {t:'כי נר מצוה ותורה אור',src:'משלי ו, כג',refs:['משלי ו:כג','משלי ו']},
 {t:'כי לקח טוב נתתי לכם, תורתי אל תעזבו',src:'משלי ד, ב',refs:['משלי ד:ב','משלי ד']},
 {t:'כי הוא חייך ואורך ימיך',src:'דברים ל, כ',refs:['דברים ל:כ','דברים ל']},
 {t:'רק השמר לך ושמר נפשך מאד, פן תשכח את הדברים',src:'דברים ד, ט',refs:['דברים ד:ט','דברים ד']},
 {t:'ודבר אלהינו יקום לעולם',src:'ישעיהו מ, ח',refs:['ישעיהו מ:ח','ישעיהו מ']},
 {t:'כל אשר תמצא ידך לעשות בכחך עשה',src:'קהלת ט, י',refs:['קהלת ט:י','קהלת ט']},
 {t:'עשה תורתך קבע',src:'אבות א, טו',refs:['פרקי אבות א','אבות א']},
 {t:'אל תאמר לכשאפנה אשנה, שמא לא תפנה',src:'אבות ב, ד',refs:['פרקי אבות ב','אבות ב']},
 {t:'לא עליך המלאכה לגמור, ולא אתה בן חורין להבטל ממנה',src:'אבות ב, טז',refs:['פרקי אבות ב','אבות ב']},
 {t:'הפך בה והפך בה, דכלא בה',src:'אבות ה, כב',refs:['פרקי אבות ה','אבות ה']}
];
/* מקורות – הנוסח מתוך הקובץ "ספר פתוח". r = שאילתות פתיחה בספרייה, לפי סדר */
var SRC_MAIN=[
 ['מקור הדין',[
  ['ב"ח יו"ד רעז ס"ק א: מהירושלמי "שלא ילך אדם לחוץ ויניח הספר פתוח אם אין עליו מפה"',['בית חדש יורה דעה רעז','ב"ח יורה דעה רעז']],
  ['ירושלמי מגילה פרק א הלכה ט',['ירושלמי מגילה א','מגילה ירושלמי']],
  ['ש"ך יו"ד רעז ס"ק א: הביא מעירובין צח ע"א, והוסיף "שומר דפין"',['שפתי כהן יורה דעה רעז','ש"ך יורה דעה רעז']],
  ['עירובין צח ע"א',['עירובין צח']],
  ['ט"ז יו"ד רעז ס"ק א',['טורי זהב יורה דעה רעז','ט"ז יורה דעה רעז']],
  ['שולחן ערוך יו"ד רעז סעיף א',['שולחן ערוך יורה דעה רעז']],
  ['ערוך השולחן יו"ד רעז סעיף ב: "דבזיון הוא... או יסגירם... או יכסה עליהם בגד"',['ערוך השולחן יורה דעה רעז']],
  ['סנהדרין מח ע"א: "כפה שנתנהו לספר" (הובא לענין כיסוי בכובע)',['סנהדרין מח']]]],
 ['כיסוי וסגירה (לפי הקובץ)',[
  ['יד שאול יו"ד רעז: בלימוד שצריך לצאת לרגע, אין צורך לסגור',['יד שאול יורה דעה רעז']],
  ['ערוך השולחן: "נ"ל דווקא כשיצא לרחוב" אבל מחדר לחדר "אין חשש"',['ערוך השולחן יורה דעה רעז']],
  ['כף החיים (פלאג\'י) כ אות יא: "אפילו על מנת לחזור תכף"',['כף החיים יורה דעה רעז']]]]
];
var SRC_PC={t:'מסך מחשב – סעיף י"ד בקובץ',
 note:'בקובץ מובאות שתי גישות. אין כאן הכרעה; לשאלה מעשית יש לפנות לרב.',
 groups:[
 ['מיקל – מותר להשאיר פתוח עם דברי תורה',[
  ['הגרח"ק (גם אני אודך ח"ב אות קפ"ט): "מותר"',null],
  ['הגר"א נבנצל (אהל יעקב): הספר פתוח על המסך – "לא" צריך להקפיד',null],
  ['שבט הקהתי: "אין חשש... ובזיון לא שייך שהרי הוא מכוסה"',null],
  ['אבני ישפה: "כיון שהדרך לא לכסות מסך של מחשב, מותר להשאיר אותו לא מכוסה"',null],
  ['דברי בניהו (חי"ד סי\' ל"ד): "אין זה נחשב לספר ואין כאן כתיבה"',null],
  ['ידיד ה\' (יו"ד סי\' ח\'): "דבר פשוט שמותר להשאירו פתוח"',null],
  ['ידי כהן (מעשה חושב ד, ב): "נראה דלא שייך ענין של שכחה כיון שאינו כתב ממש"',null]]],
 ['מחמיר',[
  ['משנת יוסף (חי"א סי\' קס"ח): "מן הראוי להחמיר" – בזיון לספר, ושייך גם בפלאפון',null]]],
 ['הסתפקות',[
  ['דרשת וחקרת (ח"ד או"ח סי\' צ"א): "ספק בזיון התורה לחומרא, ואין לי ראיה להכריע"',null],
  ['רבבות אפרים (אבני דרך ח"ו סי\' קל"ט): תלוי אם כתיבה במחשב נחשבת כתיבה',null]]]
 ],
 refs:[['ש"ך יו"ד רעז – לפתיחה בספרייה',['שפתי כהן יורה דעה רעז','ש"ך יורה דעה רעז']],['שולחן ערוך יו"ד רעז',['שולחן ערוך יורה דעה רעז']]]};
var LOG=[
 ['1.7.0',['יציבה. תיקון: הסלוגן הופיע בפינה העליונה בסגנונות "ספר נפתח" ו"ספר צף"','"אוצריא בהיר" = צבע הרקע של אוצריא, "אוצריא כהה" = צבע הבחירה בגוון כהה; מתעדכן מיד כשמשנים צבע באוצריא','ציטוטים: רק פסוקים ומאמרי חז"ל נבחרים על לימוד התורה וניצול הזמן — בלי קטעים אקראיים, סימונים או אנגלית','סגנון חדש: "ספר וציטוטים"','"הלכות": כותרות התוכן מלאות (לא נחתכות), בלי מילים באנגלית','פועל בלי אינטרנט']],
 ['1.6.1',['תיקון: הספר והסלוגן הופיעו בהגדרות; אוצריא בהיר/כהה נשאבים מצבעי האפליקציה (רקע / צבע הבחירה); הגדרה להסתרת ציטוט הש"ך; הגדרות בשתי עמודות']],
 ['1.6.0',['צבע אוצריא בהיר וכהה (הבהיר לפי צבע האתר); צבע הטקסט מתהפך אוטומטית לפי הרקע שנבחר','ספר וסלוגן כבראשית מחדל בעיצוב דומה לאתר: סמל, שם וסלוגן, והספר נפתח ונסגר באותו מקום']],
 ['1.5.0',['תיקון שגיאת העלאה לחנות (אירוע לא מוכר)','יומן שינויים, מקורות והלכות (הקובץ המלא) בכפתורים בסרגל','ברירת מחדל: הפעלה אחרי 2 דקות, רקע בצבע אוצריא, הסלוגן הרשמי','ציטוט הש"ך בסרגל ובתוך השומר','מסך ההגדרות ברוחב מלא וסגנונות בשורה אחת']],
 ['1.4.0',['שעה ותאריך עברי על המסך','שעות שקט (למשל בזמן שיעור)','ציטוטים אקראיים מספרי התנ"ך בספרייה','תצוגה מקדימה מונפשת בכל כרטיס סגנון']],
 ['1.3.0',['רקע לבחירה: כחול אוצריא, שחור או צבע אחר; הסמל הרשמי גם בציטוטים','הגדרות בעיצוב אוצריא (Material, צבעי ערכת הנושא)','סגנונות חדשים: ספר וסלוגן, ספר צף, בועות עם הספר; אנימציית הספר הרשמית','תיקון המתגים (לחיצה בכל מקום על השורה)','לא נפתח באמצע שימוש: זיהוי פעילות לפי מצב הקורא, ורק כשספר פתוח','מקורות "לא להשאיר ספר פתוח" עם קישורים לספרייה, כולל מסך מחשב','יומן שינויים מתקפל']],
 ['1.2.1',['תיקון שגיאת התקנה והעלאה לחנות','דיווח והצעות למפתח']],
 ['1.2.0',['הודעת מצב, מניעת כיבוי מסך']],
 ['1.1.0',['ריצה ברקע וכפתור בסרגל הקורא']],
 ['1.0.4',['אנימציית פתיחת הספר המקורית בלולאה ובמיקומים משתנים']]
];
var st=Object.assign({},DEFAULTS),$=function(i){return document.getElementById(i)};
var idleTimer,runTimer,quoteTimer,bookTimer,raf,active=false,auto=false,startedAt=0,startXY=null,wake=null,paused=false;

function call(m,p){try{if(typeof Otzaria!=='undefined'&&Otzaria.call)return Otzaria.call(m,p||{})}catch(e){}return Promise.resolve({success:false,data:null})}
function hex(h,a){try{return 'rgba('+parseInt(h.slice(1,3),16)+','+parseInt(h.slice(3,5),16)+','+parseInt(h.slice(5,7),16)+','+a+')'}catch(e){return h}}
var THEME=null;
function applyTheme(t){
  if(!t||!t.colorScheme)return;THEME=t;try{if(active)applyBg($('ss'))}catch(e){}var c=t.colorScheme,r=document.documentElement.style,m={'primary':'primary','on-primary':'onPrimary','secondary':'secondary','surface':'surface','on-surface':'onSurface','on-surface-variant':'onSurfaceVariant','surface-container-high':'surfaceContainerHigh','surface-container-highest':'surfaceContainerHighest','outline':'outline','error':'error'};
  for(var k in m){if(c[m[k]])r.setProperty('--color-'+k,c[m[k]])}
  if(c.primary)r.setProperty('--color-primary-subtle',hex(c.primary,.12));
  document.body.classList.toggle('dark-mode',t.mode==='dark');
  if(t.typography&&t.typography.uiFontFamily)r.setProperty('--font-ui',"'"+t.typography.uiFontFamily+"',system-ui,sans-serif");
}
try{Otzaria.on('plugin.boot',function(p){applyTheme(p&&p.theme)});Otzaria.on('theme.changed',applyTheme)}catch(e){}
setTimeout(async function(){if(!THEME){var r=await call('app.getTheme');if(r&&r.success&&r.data)applyTheme(r.data)}},900);

/* ---- אחסון ---- */
async function load(){
  var o=null;try{var r=await call('storage.get',{key:'settings'});if(r&&r.success&&r.data)o=r.data}catch(e){}
  if(!o){try{o=JSON.parse(localStorage.getItem('ss.settings'))}catch(e){}}
  if(o)st=Object.assign({},DEFAULTS,o);
  if(!st.slogan)st.slogan=DEFAULTS.slogan;
  if(!st.v||st.v<2){st.v=2;st.style='brand';st.bg=(st.bg==='navy'?'dark':(st.bg==='black'||st.bg==='custom'?st.bg:'light'))}
  try{var e2=await call('storage.get',{key:'ss_enabled'});if(e2&&e2.success&&typeof e2.data==='boolean')st.enabled=e2.data}catch(e){}
}
async function save(){
  await call('storage.set',{key:'settings',value:st});await call('storage.set',{key:'ss_enabled',value:!!st.enabled});
  try{localStorage.setItem('ss.settings',JSON.stringify(st))}catch(e){}
}
function readUI(){
  st.enabled=$('enabled').checked;st.keepAwake=$('keepAwake').checked;st.onlyInBook=$('onlyInBook').checked;
  st.idleMin=Math.min(240,Math.max(1,parseInt($('idleMin').value)||DEFAULTS.idleMin));
  st.runMin=Math.min(240,Math.max(1,parseInt($('runMin').value)||DEFAULTS.runMin));
  st.slogan=$('slogan').value.trim();st.bg=$('bg').value;st.bgColor=$('bgColor').value;st.showClock=$('showClock').checked;st.showVerse=$('showVerse').checked;st.quotesLib=$('quotesLib').checked;st.quiet=$('quiet').checked;st.quietFrom=$('quietFrom').value||'12:00';st.quietTo=$('quietTo').value||'13:30';
  var r=document.querySelector('input[name=style]:checked');if(r)st.style=r.value;
}
function fillUI(){
  $('enabled').checked=!!st.enabled;$('keepAwake').checked=!!st.keepAwake;$('onlyInBook').checked=!!st.onlyInBook;
  $('idleMin').value=st.idleMin;$('runMin').value=st.runMin;$('slogan').value=st.slogan||'';$('showClock').checked=!!st.showClock;$('showVerse').checked=!!st.showVerse;$('quotesLib').checked=!!st.quotesLib;$('quiet').checked=!!st.quiet;$('quietFrom').value=st.quietFrom;$('quietTo').value=st.quietTo;$('bg').value=st.bg;$('bgColor').value=st.bgColor;$('bgColor').style.display=st.bg==='custom'?'':'none';
  document.querySelectorAll('.sty').forEach(function(l){var i=l.querySelector('input');i.checked=(i.value===st.style);l.classList.toggle('sel',i.checked)});
}
function commit(){readUI();$('bgColor').style.display=st.bg==='custom'?'':'none';document.querySelectorAll('.sty').forEach(function(l){l.classList.toggle('sel',l.querySelector('input').checked)});save();armIdle()}

/* ---- בניית ממשק ---- */
var MINI={splash:'<div class="mini op"></div>',brand:'<div class="mini" style="margin-top:-8px"></div><small class="w">אוצריא</small>',float:'<div class="mini fl"></div>',bubbles:'<i class="bub" style="left:14px"></i><i class="bub" style="left:50px;animation-delay:-1s"></i><i class="bub" style="left:86px;animation-delay:-2s"></i>',quotes:'<span style="font-size:11px;padding:0 6px;line-height:1.3">״והגית בו יומם ולילה״</span>'};
function buildStyles(){
  var g=$('styles');STYLES.forEach(function(s){
    var l=document.createElement('label');l.className='sty';
    l.innerHTML='<input type="radio" name="style" value="'+s[0]+'"><div class="th">'+MINI[s[0]]+'</div><b>'+s[1]+'</b><small>'+s[2]+'</small>';
    l.querySelector('input').onchange=commit;g.appendChild(l)});
}
function srcLink(txt,refs){
  var li=document.createElement('li');
  if(refs){var a=document.createElement('a');a.textContent=txt;a.dataset.refs=JSON.stringify(refs);li.appendChild(a)}
  else li.textContent=txt;return li;
}
function buildSources(){
  var m=$('srcMain');SRC_MAIN.forEach(function(g){var h=document.createElement('h3');h.textContent=g[0];m.appendChild(h);var u=document.createElement('ul');g[1].forEach(function(x){u.appendChild(srcLink(x[0],x[1]))});m.appendChild(u)});
  var p=$('srcPc'),h=document.createElement('h3');h.textContent=SRC_PC.t;p.appendChild(h);
  var n=document.createElement('div');n.className='note';n.style.marginTop='0';n.textContent=SRC_PC.note;p.appendChild(n);
  SRC_PC.groups.forEach(function(g){var t=document.createElement('div');t.style.cssText='font-weight:600;margin-top:8px';t.textContent=g[0];p.appendChild(t);var u=document.createElement('ul');g[1].forEach(function(x){u.appendChild(srcLink(x[0],x[1]))});p.appendChild(u)});
  var u2=document.createElement('ul');u2.style.marginTop='8px';SRC_PC.refs.forEach(function(x){u2.appendChild(srcLink(x[0],x[1]))});p.appendChild(u2);
}
function buildLog(){var d=$('log');LOG.forEach(function(e){d.insertAdjacentHTML('beforeend','<div class="banner">גרסה '+e[0]+'</div><ul>'+e[1].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>')})}

/* ---- פתיחת מקור בספרייה ---- */
async function openRefs(refs){
  for(var i=0;i<refs.length;i++){
    var r=await call('library.resolveRef',{ref:refs[i],limit:3});
    if(r&&r.success&&r.data&&r.data.length){var x=r.data[0];
      var o=await call('reader.openBook',x.bookUid?{bookUid:x.bookUid,index:x.index}:{bookId:x.bookId,index:x.index});
      if(o&&o.success&&o.data)return true}
  }
  call('ui.showError',{message:'המקור לא נמצא בספרייה המותקנת'});return false;
}

var BGS={light:['#f6ede5','#201b13','#8a5a14'],dark:['#1e1913','#f6ede5','#cd9e4c'],black:['#000000','#f6ede5','#cd9e4c']};
function lumOf(h){var f=function(i){var v=parseInt(h.substr(i,2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(1)+.7152*f(3)+.0722*f(5)}
function hx6(v,d){v=(v||'').trim();if(/^#[0-9a-f]{8}$/i.test(v))v='#'+v.slice(3);return /^#[0-9a-f]{6}$/i.test(v)?v:d}
/* 1.7.0: "אוצריא בהיר" = צבע הרקע של אוצריא (אם אוצריא במצב כהה — גוון בהיר של הצבע הראשי, כדי שיישאר בהיר);
   "אוצריא כהה" = צבע הבחירה/הכפתורים הדלוקים בגוון כהה. מתעדכן מיד עם שינוי צבע בהגדרות אוצריא (theme.changed). */
function rgbOf(h){return[1,3,5].map(function(i){return parseInt(h.substr(i,2),16)})}
function toHex(a){return '#'+a.map(function(v){return('0'+Math.max(0,Math.min(255,Math.round(v))).toString(16)).slice(-2)}).join('')}
function mix(h,w,k){var a=rgbOf(h),b=rgbOf(w);return toHex(a.map(function(v,i){return v+(b[i]-v)*k}))}
function otzColors(){
  var cs=(THEME&&THEME.colorScheme)||{},sf=(THEME&&THEME.surfaces)||{};
  var prim=hx6(cs.primary,'#8a5a14'),bg=hx6(sf.reader,'')||hx6(cs.surface,'#f6ede5');
  if(lumOf(bg)<.4)bg=mix(prim,'#ffffff',.9);
  return{light:bg,dark:mix(prim,'#000000',.55),prim:prim};
}
function applyBg(ss){
  var o=otzColors(),k=st.bg,bg;
  if(k==='light')bg=o.light;else if(k==='dark')bg=o.dark;else if(k==='black')bg='#000000';else bg=hx6(st.bgColor,'#f6ede5');
  var light=lumOf(bg)>.4;
  ss.style.background=bg;ss.style.setProperty('--ss-fg',light?'#201b13':'#f6ede5');
  ss.style.setProperty('--ss-ac',light?mix(o.prim,'#000000',.15):mix(o.prim,'#ffffff',.45));
}
/* [1.6.0 – הוחלף ב-1.6.1] function applyBg(ss){
  var c=BGS[st.bg];
  if(st.bg==='custom'||!c){var hx=/^#[0-9a-f]{6}$/i.test(st.bgColor)?st.bgColor:'#f6ede5',light=lumOf(hx)>.4;c=[hx,light?'#201b13':'#f6ede5',light?'#8a5a14':'#cd9e4c']}
  ss.style.background=c[0];ss.style.setProperty('--ss-fg',c[1]);ss.style.setProperty('--ss-ac',c[2]);
} */
/* [1.5.0 – הוחלף ב-1.6.0] function bgCss(){
  if(st.bg==='black')return '#000';if(st.bg==='custom')return st.bgColor;if(st.bg==='navy')return '';
  var p=(getComputedStyle(document.documentElement).getPropertyValue('--color-primary')||'').trim(),c='#6f4810';
  if(/^#[0-9a-f]{6}$/i.test(p))c='#'+[1,3,5].map(function(i){return('0'+Math.round(parseInt(p.substr(i,2),16)*.8).toString(16)).slice(-2)}).join('');
  return 'radial-gradient(ellipse at 50% 45%,rgba(255,255,255,.12),transparent 62%),'+c;
} */
/* ---- שעות שקט ושעון ---- */
function inQuiet(){
  if(!st.quiet)return false;var n=new Date(),t=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2),f=st.quietFrom,u=st.quietTo;
  return f<=u?(t>=f&&t<u):(t>=f||t<u);
}
var clockTimer;
function tickClock(){var n=new Date();$('ssTm').textContent=('0'+n.getHours()).slice(-2)+':'+('0'+n.getMinutes()).slice(-2);
  try{$('ssDt').textContent=new Intl.DateTimeFormat('he-u-ca-hebrew',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(n)}catch(e){$('ssDt').textContent=n.toLocaleDateString('he-IL')}}
/* ---- הפעלה וכיבוי ---- */
function armIdle(){clearTimeout(idleTimer);if(!st.enabled||active||paused)return;idleTimer=setTimeout(function(){if(!paused&&document.visibilityState==='visible'&&!inQuiet())start(false)},st.idleMin*60000)}
async function holdAwake(){try{if(st.keepAwake&&navigator.wakeLock)wake=await navigator.wakeLock.request('screen')}catch(e){}}
function releaseAwake(){try{if(wake){wake.release();wake=null}}catch(e){}}
function start(isAuto){
  if(active)return;active=true;auto=!!isAuto;startedAt=Date.now();startXY=null;holdAwake();
  var ss=$('ss');ss.dataset.m=st.style;applyBg(ss);ss.classList.toggle('clock',!!st.showClock);ss.classList.toggle('nv',!st.showVerse);if(st.showClock){tickClock();clearInterval(clockTimer);clockTimer=setInterval(tickClock,15000)}ss.classList.add('on');
  ({splash:function(){runBook(false)},brand:function(){runBook(true)},bookq:function(){runBook(true);runQuotes()},float:runFloat,bubbles:runBubbles,quotes:runQuotes}[st.style]||function(){runBook(false)})();
  clearTimeout(runTimer);runTimer=setTimeout(function(){stop(true)},st.runMin*60000);
}
function stop(rearm){
  if(!active)return;active=false;$('ss').classList.remove('on');releaseAwake();
  cancelAnimationFrame(raf);clearInterval(quoteTimer);clearInterval(clockTimer);clearTimeout(bookTimer);clearTimeout(runTimer);
  call('storage.set',{key:'ss_dismiss',value:Date.now()});
  if(auto){auto=false;closeSelf()}
  if(rearm)armIdle();
}
async function closeSelf(){
  try{var r=await call('reader.getCurrentState');var t=r&&r.data&&r.data.openTabs;if(!t)return;
    for(var i=0;i<t.length;i++)if(t[i].isSelf){await call('reader.closeTab',{index:i});break}}catch(e){}
}
function activity(e){
  if(active){
    if(Date.now()-startedAt<900)return;
    if(e.type==='mousemove'){if(!startXY){startXY=[e.clientX,e.clientY];return}if(Math.abs(e.clientX-startXY[0])+Math.abs(e.clientY-startXY[1])<12)return}
    if(e.target&&e.target.id==='ssLink')return;
    stop(true);
  }else armIdle();
}
['mousemove','mousedown','keydown','touchstart','wheel','scroll'].forEach(function(v){window.addEventListener(v,activity,{passive:true,capture:true})});

/* ---- סגנונות ---- */
function runBook(brand){
  var b=$('ssBook'),spr=b.querySelector('.spr');b.classList.remove('st','oc','play');b.style.left=b.style.top='';b.style.opacity=1;$('ssSlog').textContent=st.slogan||'';
  if(brand){b.classList.add('oc');return}
  function place(){
    if(brand){b.style.left='50%';b.style.top='calc(50% - 40px)';return}
    var w=b.offsetWidth||136,mx=Math.max(w/2+18,Math.min(220,innerWidth*.12)),my=Math.max(w/2+18,Math.min(205,innerHeight*.12));
    b.style.left=(mx+Math.random()*Math.max(0,innerWidth-2*mx))+'px';b.style.top=(my+Math.random()*Math.max(0,innerHeight-2*my))+'px';
  }
  function cycle(){
    if(!active)return;place();b.classList.remove('play');spr.style.animation='none';void spr.offsetWidth;spr.style.animation='';b.style.opacity=1;b.classList.add('play');
    bookTimer=setTimeout(function(){b.style.opacity=0;bookTimer=setTimeout(cycle,brand?1400:450)},brand?5200:2300);
  }
  cycle();
}
function runFloat(){
  var b=$('ssBook');b.classList.add('st');b.classList.remove('play');b.style.opacity=1;
  var x=80,y=80,dx=1.1,dy=.9;
  (function loop(){var w=innerWidth-b.offsetWidth,h=innerHeight-b.offsetHeight;x+=dx;y+=dy;if(x<=0||x>=w)dx=-dx;if(y<=0||y>=h)dy=-dy;
    b.style.left=(Math.max(0,Math.min(w,x))+b.offsetWidth/2)+'px';b.style.top=(Math.max(0,Math.min(h,y))+b.offsetHeight/2)+'px';raf=requestAnimationFrame(loop)})();
}
function runBubbles(){
  var c=$('ssCanvas'),ctx=c.getContext('2d'),W=c.width=innerWidth,H=c.height=innerHeight,img=new Image(),bs=[];img.src='book-opening.png';
  function mk(i){return{r:20+Math.random()*44,x:Math.random()*W,y:i?Math.random()*H:H+90,v:.25+Math.random()*.7,ph:Math.random()*6.28,b:Math.random()<.5}}
  for(var i=0;i<20;i++)bs.push(mk(true));
  (function loop(){ctx.clearRect(0,0,W,H);
    bs.forEach(function(b,i){b.y-=b.v;b.ph+=.015;var x=b.x+Math.sin(b.ph)*22;
      ctx.beginPath();ctx.arc(x,b.y,b.r,0,6.283);ctx.fillStyle='rgba(205,158,76,.09)';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle='rgba(205,158,76,.5)';ctx.stroke();
      if(b.b&&img.complete&&img.naturalWidth){var fh=img.naturalHeight/24,s=b.r*1.15;ctx.drawImage(img,0,img.naturalHeight-fh,img.naturalWidth,fh,x-s/2,b.y-s/2,s,s)}
      if(b.y<-b.r*2)bs[i]=mk(false)});
    raf=requestAnimationFrame(loop)})();
}
var qi=0,LIBB=['בראשית','שמות','ויקרא','במדבר','דברים','יהושע','שופטים','ישעיהו','ירמיהו','יחזקאל','תהילים','משלי','איוב','קהלת','רות','אסתר','דניאל'];
async function libQuote(){
  try{var b=LIBB[Math.floor(Math.random()*LIBB.length)],r=await call('library.getBookContent',{bookId:b,offset:Math.floor(Math.random()*40000),limit:700});
    var t=(r&&r.success&&typeof r.data==='string')?r.data.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim():'';
    if(t.length<60)return null;t=t.slice(0,170);var i=t.lastIndexOf(' ');if(i>80)t=t.slice(0,i);
    return {t:t+'…',src:'מתוך ספר '+b,refs:[b]}}catch(e){return null}
}
/* 1.7.0: בלי קטעים אקראיים מהספרייה (יצאו חלקי פסוקים, סימונים ותרגומים לאנגלית) — רק רשימה נבחרת של פסוקים ומאמרי חז"ל
   על לימוד התורה וניצול הזמן. quotesLib = להוסיף לרשימה הבסיסית את הרשימה המורחבת; showVerse=false מוריד את ציטוט הש"ך */
var BASEQ=5;
function quoteList(){var l=st.quotesLib?QUOTES:QUOTES.slice(0,BASEQ);return st.showVerse===false?l.slice(1):l}
async function showQuote(){
  var L=quoteList(),q=L[qi%L.length];qi++;
  var box=$('ssQuote');box.style.opacity=0;
  setTimeout(function(){$('ssText').textContent=q.t;var a=$('ssLink');a.textContent=q.src+' ← לפתיחה בספר';
    a.onclick=function(ev){ev.stopPropagation();auto=false;stop(true);openRefs(q.refs)};box.style.opacity=1},600);
}
function runQuotes(){qi=Math.floor(Math.random()*quoteList().length);showQuote();clearInterval(quoteTimer);quoteTimer=setInterval(showQuote,14000)}

/* ---- דיווח / הצעה ---- */
var fbReady=false;
async function openFb(){var b=$('fb');b.style.display=b.style.display==='block'?'none':'block';if(fbReady)return;fbReady=true;
  var r=await call('feedback.hasReporterEmail');if(r&&r.success&&r.data===false)$('fbMailRow').style.display='block'}
async function sendFb(){
  var d=$('fbText').value.trim();if(!d){$('fbMsg').textContent='נא לכתוב תוכן';return}
  var k=$('fbKind').value,lb={bug:'דיווח על תקלה',suggestion:'הצעה לשיפור',content:'הערה על תוכן',other:'אחר'}[k]||'אחר';
  var p={details:'['+lb+'] שומר מסך '+VERSION+'\n'+d,reportType:k==='bug'?'bug':k==='content'?'content':'other'};
  var m=$('fbMail').value.trim();if(m)p.reporterEmail=m;
  $('fbSend').disabled=true;$('fbMsg').textContent='שולח…';var r=await call('feedback.report',p);$('fbSend').disabled=false;
  if(r&&r.success){if(r.data==='cancelled')$('fbMsg').textContent='בוטל';else{$('fbMsg').textContent=r.data==='sent'?'נשלח, תודה!':'יישלח כשיהיה חיבור';$('fbText').value='';setTimeout(function(){$('fb').style.display='none';$('fbMsg').textContent=''},1600)}}
  else $('fbMsg').textContent='השליחה נכשלה';
}

/* ---- חלוניות: הלכות / מקורות / יומן ---- */
var PANELS={hal:['הלכות – ספר פתוח',null],src:['מקורות: לא להשאיר ספר פתוח','pSrc'],log:['יומן שינויים','pLog']};
function openPanel(k){var p=PANELS[k];$('mT').textContent=p[0];$('mB').innerHTML=k==='hal'?(window.HALACHA_HTML||''):$(p[1]).innerHTML;$('modal').style.display='flex';$('mB').scrollTop=0}
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('[data-refs]');if(a){try{openRefs(JSON.parse(a.dataset.refs))}catch(x){}return}
  var g=e.target.closest&&e.target.closest('[data-go]');if(g){var t=document.getElementById(g.dataset.go);if(t)t.scrollIntoView({block:'start'});return}
  var p=e.target.closest&&e.target.closest('[data-p]');if(p)openPanel(p.dataset.p);
});
$('mClose').onclick=function(){$('modal').style.display='none'};
$('topQuote').onclick=function(){openRefs(QUOTES[0].refs)};
/* ---- אתחול ---- */
buildStyles();buildSources();buildLog();$('ver').textContent='גרסה '+VERSION;
['enabled','keepAwake','onlyInBook','showClock','showVerse','quotesLib','quiet','quietFrom','quietTo'].forEach(function(i){$(i).onchange=commit});
['idleMin','runMin'].forEach(function(i){$(i).onchange=commit});$('slogan').onchange=commit;$('bg').onchange=commit;$('bgColor').oninput=commit;
$('preview').onclick=function(){readUI();save();start(false)};
$('fbOpen').onclick=openFb;$('fbClose').onclick=function(){$('fb').style.display='none'};$('fbSend').onclick=sendFb;
load().then(function(){fillUI();armIdle()});
try{
  Otzaria.on('plugin.page_opened',function(d){if(d&&d.param&&d.param.screensaver){if(inQuiet())return;paused=false;load().then(function(){fillUI();setTimeout(function(){start(true)},250)})}});
  Otzaria.on('plugin.suspended',function(){paused=true;clearTimeout(idleTimer);if(active){auto=false;stop(false)}});
  Otzaria.on('plugin.resumed',function(){paused=false;load().then(function(){fillUI();armIdle()})});
}catch(e){}
/* סנכרון המתג עם לחצן הסרגל (שמשנה את האחסון מהרקע) */
setInterval(async function(){if(active||document.visibilityState!=='visible')return;
  var r=await call('storage.get',{key:'ss_enabled'});if(r&&r.success&&typeof r.data==='boolean'&&r.data!==st.enabled){st.enabled=r.data;$('enabled').checked=r.data;armIdle()}},3000);
})();
