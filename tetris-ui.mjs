import {Tetris,SHAPES,seededRandom} from './tetris.mjs?v=leaderboard-1';
const $=id=>document.getElementById(id), canvas=$('board'),ctx=canvas.getContext('2d'),preview=$('next'),px=preview.getContext('2d');
let game=new Tetris(); let mode='ready',best=0,gravity=0,ground=0,resets=0,last=0,raf=0,holdTimer=0,repeatTimer=0;
try{best=Math.max(0,Number(localStorage.getItem('louis-tetris-best'))||0);}catch{}
let theme; function palette(){const c=getComputedStyle(document.documentElement);theme=Object.fromEntries(['paper','ink','muted','line','accent'].map(k=>[k,c.getPropertyValue('--'+k).trim()]));}
palette(); const media=matchMedia('(prefers-color-scheme: dark)');media.addEventListener('change',()=>{palette();draw();});
if(window.parent!==window)document.body.classList.add('embedded');
function block(context,x,y,size,color,ghost=false){context.fillStyle=color;context.strokeStyle=color;context.lineWidth=1.5;if(ghost)context.strokeRect(x*size+3,y*size+3,size-6,size-6);else context.fillRect(x*size+2,y*size+2,size-4,size-4);}
function draw(){
 ctx.fillStyle=theme.paper;ctx.fillRect(0,0,260,520);ctx.strokeStyle=theme.line;ctx.lineWidth=.4;
 for(let x=1;x<10;x++){ctx.beginPath();ctx.moveTo(x*26,0);ctx.lineTo(x*26,520);ctx.stroke();}
 for(let y=1;y<20;y++){ctx.beginPath();ctx.moveTo(0,y*26);ctx.lineTo(260,y*26);ctx.stroke();}
 game.board.forEach((row,y)=>row.forEach((cell,x)=>{if(cell)block(ctx,x,y,26,theme.ink);}));
 if(!game.over){const gy=game.ghostY();game.piece.forEach((row,y)=>row.forEach((cell,x)=>{if(cell){block(ctx,game.x+x,gy+y,26,theme.muted,true);block(ctx,game.x+x,game.y+y,26,theme.accent);}}));}
 px.clearRect(0,0,160,120);const piece=SHAPES[game.next];px.save();px.translate((160-piece.length*28)/2,15);piece.forEach((row,y)=>row.forEach((cell,x)=>{if(cell)block(px,x,y,28,theme.accent);}));px.restore();
 $('score').value=game.score.toLocaleString();$('lines').value=game.lines;$('best').value=best.toLocaleString();
}
function save(){if(game.score>best){best=game.score;try{localStorage.setItem('louis-tetris-best',String(best));}catch{}}}
function stopHold(){clearTimeout(holdTimer);clearInterval(repeatTimer);}
function setMode(next){mode=next;cancelAnimationFrame(raf);stopHold();$('veil').hidden=mode==='playing';$('pause').disabled=mode!=='playing';document.querySelectorAll('[data-action]').forEach(b=>b.disabled=mode!=='playing');
 if(mode==='paused'){$('state').textContent='Paused.';$('message').textContent='Pick up where you left off.';$('start').textContent='Resume';}
 if(mode==='over'){$('state').textContent='One more?';$('message').textContent=game.score.toLocaleString()+' points · '+game.lines+' lines';$('start').textContent='Play again';$('notice').textContent='Game over. '+game.score+' points.';}
 if(mode==='playing'){last=performance.now();canvas.focus({preventScroll:true});raf=requestAnimationFrame(tick);}
 draw();
}
function locked(cleared){gravity=0;ground=0;resets=0;save();if(cleared)$('notice').textContent=cleared===4?'Four lines. Nicely done.':cleared+' '+(cleared===1?'line':'lines')+' cleared.';if(game.over){setMode('over');offerEntry();}}
function action(name){if(mode!=='playing')return;const grounded=!game.fits(game.piece,game.x,game.y+1);let moved=false;
 record({left:'L',right:'R',rotate:'T',down:'V',drop:'D'}[name]);
 if(name==='left')moved=game.move(-1,0);if(name==='right')moved=game.move(1,0);if(name==='rotate')moved=game.rotate();
 if(name==='down'){if(game.move(0,1)){game.score++;gravity=0;ground=0;}save();}
 if(name==='drop')locked(game.hardDrop());
 if(moved&&grounded&&resets<15){ground=0;resets++;}draw();
}
function tick(now){if(mode!=='playing')return;const dt=Math.min(now-last,100);last=now;gravity+=dt;
 if(gravity>=game.speed){record('G');game.move(0,1);gravity=0;}
 if(!game.fits(game.piece,game.x,game.y+1)){ground+=dt;if(ground>=500){record('K');locked(game.lock());}}else ground=0;
 draw();if(mode==='playing')raf=requestAnimationFrame(tick);
}
$('start').addEventListener('click',async()=>{
 if(mode==='ready'||mode==='over'){
  $('start').disabled=true;$('show-scores').disabled=true;$('start').textContent='Starting…';$('score-entry').hidden=true;
  session=null;moves='';rankable=true;entryId=null;
  try{session=await request({action:'start'});game=new Tetris(seededRandom(session.seed));$('notice').textContent='';}
  catch{game=new Tetris();$('notice').textContent='Playing offline. This score cannot enter the shared board.';}
  gravity=ground=resets=0;$('start').disabled=false;$('show-scores').disabled=false;
 }
 setMode('playing');
});
$('pause').addEventListener('click',()=>{setMode('paused');$('start').focus();});
document.addEventListener('keydown',e=>{
 if(e.target instanceof HTMLInputElement||!$('leaderboard').hidden)return;
 if(e.code==='KeyP'||e.code==='Escape'){if(mode==='playing'){e.preventDefault();setMode('paused');$('start').focus();}else if(mode==='paused'&&e.code==='KeyP'){e.preventDefault();setMode('playing');}return;}
 if(mode!=='playing'||e.target!==canvas)return;
 const name={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotate',ArrowDown:'down',Space:'drop'}[e.code];
 if(name){e.preventDefault();if(!e.repeat||!['rotate','drop'].includes(name))action(name);}
});
document.querySelectorAll('[data-action]').forEach(button=>{
 button.addEventListener('click',()=>{action(button.dataset.action);if(mode==='playing')canvas.focus({preventScroll:true});});
 button.addEventListener('pointerdown',e=>{if(mode!=='playing'||!['left','right','down'].includes(button.dataset.action))return;stopHold();button.setPointerCapture(e.pointerId);holdTimer=setTimeout(()=>{action(button.dataset.action);repeatTimer=setInterval(()=>action(button.dataset.action),85);},220);});
 ['pointerup','pointercancel','lostpointercapture'].forEach(event=>button.addEventListener(event,stopHold));
});
window.addEventListener('blur',()=>{if(mode==='playing')setMode('paused');});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')setMode('paused');});
// Closing the host disclosure pauses immediately, including on touch devices.
try{window.frameElement?.closest('details')?.addEventListener('toggle',e=>{if(!e.target.open&&mode==='playing')setMode('paused');});}catch{}

const API=['localhost','127.0.0.1'].includes(location.hostname)?'/api/tetris':'https://louis-theodorou.oakglen-7189.chatgpt.site/api/tetris';
let session=null,moves='',rankable=true,entryId=null,rows=[],scoresLoaded=false,refreshing=false;
async function request(body){
 const response=await fetch(API,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(12000),credentials:'omit'});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Please try again.');return result;
}
function record(move){if(session&&rankable){if(moves.length>=60000)rankable=false;else moves+=move;}}
function renderScores(){
 $('scores-rows').replaceChildren();
 rows.forEach((row,index)=>{const tr=document.createElement('tr');if(row.id===entryId)tr.className='your-score';
  [String(index+1).padStart(2,'0'),row.name,Number(row.score).toLocaleString()].forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});$('scores-rows').append(tr);
 });
}
async function refreshScores(){
 if(refreshing)return;refreshing=true;$('refresh-scores').disabled=true;
 try{const result=await request();rows=result.scores;scoresLoaded=true;renderScores();$('scores-status').textContent=rows.length?'':'No scores yet. Set the first one.';}
 catch{$('scores-status').textContent=rows.length?'Could not refresh. Showing the last loaded scores.':'Leaderboard unavailable. Try refreshing in a moment.';}
 finally{refreshing=false;$('refresh-scores').disabled=false;}
}
async function offerEntry(){
 const finished=session?.id;await refreshScores();
 if(mode!=='over'||session?.id!==finished||!session||!rankable||game.score<=0)return;
 if(scoresLoaded&&rows.length===10&&game.score<=rows[9].score){$('notice').textContent='Game over. '+game.score.toLocaleString()+' points. Top ten starts above '+rows[9].score.toLocaleString()+'.';return;}
 $('state').textContent=scoresLoaded?'You made the board.':'Save your score.';$('score-entry').hidden=false;$('entry-status').textContent='Your name and score will be public.';
 try{$('initials').value=localStorage.getItem('louis-tetris-name')||'';}catch{}
 $('save-score').disabled=false;
}
function showScores(){if(mode==='playing')setMode('paused');$('play-panel').hidden=true;$('leaderboard').hidden=false;$('show-scores').hidden=true;refreshScores();$('back-game').focus({preventScroll:true});}
$('show-scores').addEventListener('click',showScores);
$('back-game').addEventListener('click',()=>{$('leaderboard').hidden=true;$('play-panel').hidden=false;$('show-scores').hidden=false;$('start').focus({preventScroll:true});});
$('refresh-scores').addEventListener('click',refreshScores);
$('initials').addEventListener('input',()=>{$('initials').value=$('initials').value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3);});
$('score-entry').addEventListener('submit',async e=>{
 e.preventDefault();if(!session||mode!=='over')return;const name=$('initials').value.toUpperCase();if(!/^[A-Z0-9]{3}$/.test(name))return;
 $('save-score').disabled=true;$('start').disabled=true;$('entry-status').textContent='Saving…';
 try{const result=await request({action:'submit',id:session.id,name,moves});rows=result.scores;scoresLoaded=true;entryId=result.id;renderScores();
  try{localStorage.setItem('louis-tetris-name',name);}catch{}
  $('score-entry').hidden=true;$('state').textContent='Score saved.';$('scores-status').textContent=rows.some(r=>r.id===entryId)?'Your score is highlighted.':'The top ten moved while you played. Try again.';
  $('play-panel').hidden=true;$('leaderboard').hidden=false;$('show-scores').hidden=true;$('back-game').textContent='Back to game';$('back-game').focus({preventScroll:true});
 }catch(error){$('entry-status').textContent=error.message||'Could not save. Try again.';$('save-score').disabled=false;}
 finally{$('start').disabled=false;}
});

setMode('ready');
refreshScores();

