
const motorworxAnimalGraphics={'banana':'graphics/objects/banana.png','bone':'graphics/objects/bone.png','bowl':'graphics/objects/bowl.png','bunny':'graphics/animals/bunny.png','carrot':'graphics/objects/carrot.png','cheese':'graphics/objects/cheese.png','duckling':'graphics/animals/duckling.png','monkey':'graphics/animals/monkey.png','mouse':'graphics/animals/mouse.png','pond':'graphics/objects/pond.png','puppy':'graphics/animals/puppy.png'};
// The approved bunny is already stored in motorworxAnimalGraphics.
motorworxAnimalGraphics['carrot']='graphics/objects/carrot.svg';

motorworxAnimalGraphics['bunny_clean']='graphics/animals/bunny-alternate.svg';

motorworxAnimalGraphics['bowl']='graphics/objects/bowl.svg';
function motorworxAnimalGraphic(name){return motorworxAnimalGraphics[name]||"";}
const motorworxSeaSceneGraphics={"octopus":"graphics/ocean/octopus.png","cave":"graphics/ocean/cave.png","shell":"graphics/ocean/shell.png","seaweed":"graphics/ocean/seaweed.png","ocean-background":"graphics/ocean/ocean-background.png"};


(()=>{
 'use strict';
 const $=id=>document.getElementById(id), board=$('board'),ghost=$('ghost'),pumpkin=$('pumpkin'),trail=$('trail'),traced=$('traced'),feedback=$('feedback'),message=$('message'),reset=$('reset'),next=$('next');
 function animateObject(element,ok){
  if(!element)return;const art=element.querySelector('svg,.choice-art')||element;
  art.classList.remove('object-yes','object-no');void art.getBoundingClientRect();
  art.classList.add(ok?'object-yes':'object-no');
 }
 function show(id){document.querySelectorAll('.screen').forEach(el=>el.hidden=el.id!==id);window.scrollTo(0,0)}
 const paths=[{y:155,a:82,b:273},{y:124,a:82,b:273},{y:185,a:82,b:273}];
 let current=0,progress=0,drag=false,completed=false,pointerId=null;
 const path=()=>paths[current];
 function redraw(){ghost.querySelector('image')?.setAttribute('href',motorworxAnimalGraphic('bunny'));pumpkin.querySelector('image')?.setAttribute('href',motorworxAnimalGraphic('carrot'));let {y,a,b}=path();ghost.setAttribute('transform',`translate(${a-11+(b-a)*progress} ${y+1})`);pumpkin.setAttribute('transform',`translate(${b+15} ${y})`);trail.innerHTML=`<line class="guide" x1="${a}" y1="${y}" x2="${b}" y2="${y}"/><line class="dots" x1="${a}" y1="${y}" x2="${b}" y2="${y}"/>`;traced.setAttribute('x1',a);traced.setAttribute('x2',a+(b-a)*progress);traced.setAttribute('y1',y);traced.setAttribute('y2',y);$('sparkles').style.display='none';$('counter').textContent=`${current+1} of 3`;document.querySelectorAll('.steps span').forEach((s,i)=>s.classList.toggle('current',i<=current));}
 function startOver(){progress=0;drag=false;completed=false;pointerId=null;next.hidden=true;reset.hidden=false;feedback.textContent='Start at the bunny!';message.textContent='Ready to trace?';redraw()}
 function coordinates(e){let r=board.getBoundingClientRect();return {x:(e.clientX-r.left)*360/r.width,y:(e.clientY-r.top)*305/r.height};}
 function down(e){if(completed)return;const p=coordinates(e),{y,a,b}=path(),ghostX=a-11+(b-a)*progress;if(Math.abs(p.x-ghostX)<33&&Math.abs(p.y-(y+1))<39){drag=true;pointerId=e.pointerId;board.setPointerCapture(pointerId);feedback.textContent='Follow the dots!';message.textContent='Keep going!';e.preventDefault()}else{feedback.textContent='Touch the bunny first.';}}
 function move(e){if(!drag||pointerId!==e.pointerId)return;e.preventDefault();const p=coordinates(e),{y,a,b}=path(),target=Math.max(0,Math.min(1,(p.x-a)/(b-a)));if(Math.abs(p.y-y)>35){drag=false;message.textContent='Try staying on the path.';window.motorworxFeedback?.('retry','trace-path');feedback.textContent='Touch the bunny and try again.';return;}if(target<progress-0.075)return;if(target>progress+0.19){drag=false;message.textContent='Move slowly along the dots.';window.motorworxFeedback?.('retry','trace-speed');return;}progress=Math.max(progress,target);redraw();if(progress>=.97){progress=1;drag=false;completed=true;redraw();feedback.textContent='You did it!';window.motorworxFeedback?.('success','trace');message.textContent=current===2?'All three paths complete! Well done!':'Wonderful tracing!';next.textContent=current===2?'Play again ↻':'Next path →';next.hidden=false;reset.hidden=true;}}
 board.addEventListener('pointerdown',down);board.addEventListener('pointermove',move);board.addEventListener('pointerup',()=>drag=false);board.addEventListener('pointercancel',()=>drag=false);board.addEventListener('lostpointercapture',()=>drag=false);reset.addEventListener('click',startOver);$('play').addEventListener('click',()=>show('chooseScreen'));$('backHome').addEventListener('click',()=>{drag=false;show('chooseScreen')});next.addEventListener('click',()=>{current=current===2?0:current+1;startOver()});startOver();
 $('chooseBack').addEventListener('click',()=>show('homeScreen'));
 $('startTrace').addEventListener('click',()=>{show('gameScreen');current=0;startOver()});
 $('startMatch').addEventListener('click',()=>{show('matchScreen');round=0;renderMatch()});
 $('matchBack').addEventListener('click',()=>show('chooseScreen'));
 // The identical SVG is reused for the target and exactly one answer choice.
 // Level 1 uses bold whole-object differences and a small variety of cheerful objects.
 function matchPic(kind,color){
   const common='stroke="#76678b" stroke-width="3"';
   if(kind==='balloon')return `<svg viewBox="0 0 144 134" role="img" aria-label="${color} balloon"><ellipse cx="72" cy="57" rx="39" ry="47" fill="${color}" ${common}/><path d="M67 104 L77 104 L72 113Z" fill="${color}" stroke="#76678b" stroke-width="2"/><path d="M72 112 Q58 122 73 133" stroke="#76678b" stroke-width="2.5" fill="none"/><ellipse cx="57" cy="36" rx="9" ry="17" fill="white" opacity=".22" transform="rotate(23 57 36)"/></svg>`;
   if(kind==='star')return `<svg viewBox="0 0 144 134" role="img" aria-label="${color} star"><path d="M72 16 L84 47 L118 47 L91 66 L102 99 L72 80 L42 99 L53 66 L26 47 L60 47Z" fill="${color}" ${common} stroke-linejoin="round"/><circle cx="72" cy="64" r="4" fill="#ffffff" opacity=".28"/></svg>`;
   if(kind==='flower')return `<svg viewBox="0 0 144 134" role="img" aria-label="${color} flower"><circle cx="72" cy="67" r="17" fill="#ffd66b" stroke="#c9953d" stroke-width="3"/><circle cx="72" cy="37" r="18" fill="${color}" ${common}/><circle cx="100" cy="55" r="18" fill="${color}" ${common}/><circle cx="89" cy="89" r="18" fill="${color}" ${common}/><circle cx="55" cy="89" r="18" fill="${color}" ${common}/><circle cx="44" cy="55" r="18" fill="${color}" ${common}/></svg>`;
   return `<svg viewBox="0 0 144 134" role="img" aria-label="${color} ball"><circle cx="72" cy="67" r="40" fill="${color}" ${common}/><path d="M32 67 H112 M72 27 V107" stroke="#ffffff" stroke-width="4" opacity=".4"/></svg>`;
 }
 const rounds=[
   {target:{kind:'balloon',color:'#9158ca'},other:{kind:'star',color:'#f4a342'},correct:1},
   {target:{kind:'star',color:'#54bcb0'},other:{kind:'flower',color:'#f08cab'},correct:0},
   {target:{kind:'flower',color:'#f4a342'},other:{kind:'ball',color:'#54bcb0'},correct:1},
   {target:{kind:'ball',color:'#6fa8ff'},other:{kind:'balloon',color:'#f08cab'},correct:0}
 ];
 let round=0,matchDone=false;
 function renderMatch(){const r=rounds[round];matchDone=false;$('matchCounter').textContent=`${round+1} of ${rounds.length}`;$('matchTarget').innerHTML=matchPic(r.target.kind,r.target.color);for(let i=0;i<2;i++){const b=$('choice'+i);const item=i===r.correct?r.target:r.other;b.innerHTML=matchPic(item.kind,item.color);b.disabled=false;b.className='match-choice'}$('matchMessage').textContent='Choose the matching picture.';$('matchNext').hidden=true;document.querySelectorAll('#matchSteps span').forEach((el,i)=>el.classList.toggle('current',i<=round));}
 function selectMatch(i){if(matchDone)return;const r=rounds[round];if(i!==r.correct){$('matchMessage').textContent='Try the other picture!';window.motorworxFeedback?.('retry','match');animateObject($('choice'+i),false);return;}matchDone=true;window.motorworxFeedback?.('success','match');animateObject($('choice'+i),true);$('choice0').disabled=true;$('choice1').disabled=true;$('matchMessage').textContent=round===rounds.length-1?'You found all the matches! Well done!':'Yes! They are the same!';const btn=$('matchNext');btn.textContent=round===rounds.length-1?'Play again ↻':'Next picture →';btn.hidden=false;}
 $('choice0').addEventListener('click',()=>selectMatch(0));$('choice1').addEventListener('click',()=>selectMatch(1));$('matchNext').addEventListener('click',()=>{round=round===rounds.length-1?0:round+1;renderMatch()});
 // Activity 3: figure-ground. Same-sized natural hiding places; the target is
 // visibly peeking above the occluder (not a tiny detail or an ambiguous outline).
 const peekRounds=[
   {kind:'lion',cover:'bush',correct:1,name:'lion'},
   {kind:'zebra',cover:'bush',correct:0,name:'zebra'},
   {kind:'elephant',cover:'bush',correct:1,name:'elephant'},
   {kind:'lion',cover:'bush',correct:0,name:'lion'}
 ];
 let peekRound=0,peekDone=false;
 const motorworxBushGraphic='graphics/safari/bush.png';
 function coverPicture(kind){
   if(kind==='pumpkin')return `<path d="M77 98 Q76 76 86 73" fill="none" stroke="#5d995f" stroke-width="6" stroke-linecap="round"/><path d="M80 88 C48 69 23 100 31 132 C37 162 61 169 79 158 C102 173 136 156 139 126 C142 98 116 69 80 88Z" fill="#f6a655" stroke="#c97a41" stroke-width="3"/><path d="M62 87 Q46 127 63 157 M99 87 Q115 126 99 158" fill="none" stroke="#db873f" stroke-width="3"/>`;
   if(kind==='bush')return `<image href="${motorworxBushGraphic}" x="2" y="40" width="171" height="136" preserveAspectRatio="none"/>`;
   return `<path d="M18 139 Q12 115 40 110 Q43 82 74 96 Q91 70 113 96 Q149 88 148 119 Q169 141 139 157 H36 Q19 155 18 139Z" fill="#d3e9fa" stroke="#91b9d9" stroke-width="3"/>`;
 }
 const motorworxSafariGraphics={"lion":"graphics/safari/lion.png","zebra":"graphics/safari/zebra.png","elephant":"graphics/safari/elephant.png","giraffe":"graphics/safari/giraffe.png","monkey":"graphics/animals/monkey.png"};
 function peeker(kind){const y={lion:43,zebra:35,elephant:50}[kind];return `<defs><clipPath id="peekAnimalClip-${kind}"><rect x="0" y="0" width="175" height="156"/></clipPath></defs><image href="${motorworxSafariGraphics[kind]}" x="18" y="${y}" width="139" height="153" preserveAspectRatio="xMidYMid meet" clip-path="url(#peekAnimalClip-${kind})"/>`;}
 function peekScene(r,contains){return `<svg viewBox="0 0 175 180" role="img" aria-label="${contains?'Partially hidden '+r.name:'Only the hiding place'}"><rect x="4" y="4" width="167" height="171" rx="19" fill="#ffffff"/>${contains?peeker(r.kind):''}${coverPicture(r.cover)}</svg>`;}
 function renderPeek(){const r=peekRounds[peekRound];peekDone=false;$('peekCounter').textContent=`${peekRound+1} of ${peekRounds.length}`;$('peekInstruction').textContent=`Find the hiding ${r.name}.`;for(let i=0;i<2;i++){const b=$('peekChoice'+i);b.innerHTML=peekScene(r,i===r.correct);b.className='peek-choice';b.disabled=false;b.setAttribute('aria-label',`${i===0?'Left':'Right'} picture`)}$('peekMessage').textContent='Look closely!';$('peekNext').hidden=true;document.querySelectorAll('#peekSteps span').forEach((el,i)=>el.classList.toggle('current',i<=peekRound))}
 function choosePeek(i){if(peekDone)return;const r=peekRounds[peekRound];if(i!==r.correct){$('peekMessage').textContent='Look again. Where is it peeking out?';animateObject($('peekChoice'+i),false);window.motorworxFeedback?.('retry','peek');return;}peekDone=true;window.motorworxFeedback?.('success','peek');animateObject($('peekChoice'+i),true);$('peekChoice0').disabled=true;$('peekChoice1').disabled=true;$('peekMessage').textContent=peekRound===peekRounds.length-1?'All the hiding friends found!':'You found it! Well done!';const b=$('peekNext');b.textContent=peekRound===peekRounds.length-1?'Play again ↻':'Next picture →';b.hidden=false}
 $('startPeek').addEventListener('click',()=>{peekRound=0;renderPeek();show('peekScreen')});
 $('peekBack').addEventListener('click',()=>show('chooseScreen'));
 $('peekChoice0').addEventListener('click',()=>choosePeek(0));
 $('peekChoice1').addEventListener('click',()=>choosePeek(1));
 $('peekNext').addEventListener('click',()=>{peekRound=(peekRound+1)%peekRounds.length;renderPeek()});

 // Activity 4: visual memory, Level 1. The reference disappears BEFORE the two options appear.
 const memoryRounds=[
  {seen:'🧸',other:'🚗',correct:1,name:'teddy bear',otherName:'toy car'},
  {seen:'🚗',other:'⚽',correct:0,name:'toy car',otherName:'ball'},
  {seen:'🪁',other:'🧸',correct:1,name:'kite',otherName:'teddy bear'},
  {seen:'⚽',other:'🪁',correct:0,name:'ball',otherName:'kite'}
 ];
 let memoryRound=0,memoryPhase='look';
 function renderMemory(){
  const r=memoryRounds[memoryRound];memoryPhase='look';
  $('memoryCounter').textContent=`${memoryRound+1} of ${memoryRounds.length}`;
  $('memoryInstruction').textContent='Look at the picture.';
  $('memoryHint').textContent='Remember what you see.';
  $('memoryPicture').textContent=r.seen;
  $('memoryPicture').setAttribute('aria-label',r.name);
  $('memoryDisplay').hidden=false;
  $('memoryReadyControls').hidden=false;
  $('memoryChoices').hidden=true;
  $('memoryNext').hidden=true;
  $('memoryMessage').textContent='Take your time to look.';
  document.querySelectorAll('#memorySteps span').forEach((el,i)=>el.classList.toggle('current',i<=memoryRound));
 }
 $('startMemory').addEventListener('click',()=>{memoryRound=0;renderMemory();show('memoryScreen')});
 $('memoryBack').addEventListener('click',()=>show('chooseScreen'));
 $('memoryReady').addEventListener('click',()=>{
  if(memoryPhase!=='look')return;
  const r=memoryRounds[memoryRound];memoryPhase='choose';
  $('memoryDisplay').hidden=true;$('memoryReadyControls').hidden=true;
  $('memoryChoices').hidden=false;
  $('memoryInstruction').textContent='Remember the picture.';
  $('memoryHint').textContent='Tap the one you saw.';
  for(let i=0;i<2;i++){
   const btn=$('memoryChoice'+i),isCorrect=i===r.correct;
   btn.innerHTML=`<span class="choice-art">${isCorrect?r.seen:r.other}</span>`;
   btn.setAttribute('aria-label',isCorrect?r.name:r.otherName);
   btn.className='memory-option';btn.disabled=false;
  }
  $('memoryMessage').textContent='Which picture did you see?';
 });
 function chooseMemory(i){
  if(memoryPhase!=='choose')return;
  const r=memoryRounds[memoryRound];
  if(i!==r.correct){$('memoryMessage').textContent='Try remembering the picture again.';animateObject($('memoryChoice'+i),false);window.motorworxFeedback?.('retry','memory');return;}
  memoryPhase='done';window.motorworxFeedback?.('success','memory');animateObject($('memoryChoice'+i),true);
  $('memoryChoice0').disabled=true;$('memoryChoice1').disabled=true;
  $('memoryMessage').textContent=memoryRound===memoryRounds.length-1?'Great remembering! You finished all four!':'You remembered it!';
  $('memoryNext').textContent=memoryRound===memoryRounds.length-1?'Play again ↻':'Next picture →';
  $('memoryNext').hidden=false;
 }
 $('memoryChoice0').addEventListener('click',()=>chooseMemory(0));
 $('memoryChoice1').addEventListener('click',()=>chooseMemory(1));
 $('memoryNext').addEventListener('click',()=>{memoryRound=(memoryRound+1)%memoryRounds.length;renderMemory()});

 // Activity 5: underwater spatial relationships, drag fish to one large destination.
 // Coordinates are in SVG viewBox units; pointer coordinates work for phone and mouse.
 const spatialRounds=[
  {instruction:'Put the fish inside the cave.',scene:'cave',tx:222,ty:235},
  {instruction:'Put the fish above the shell.',scene:'shell',tx:240,ty:72},
  {instruction:'Put the fish under the seaweed.',scene:'seaweed',tx:235,ty:219},
  {instruction:'Put the fish outside the cave.',scene:'outside',tx:290,ty:235}
 ];
 const spatialBoard=$('spatialBoard'),spatialGhost=$('spatialGhost');
 $('spatialSeaBackdrop').setAttribute('href',motorworxSeaSceneGraphics['ocean-background']);
 let spatialRound=0,spatialDone=false,spatialDragging=false,spatialPointer=null,spatialX=61,spatialY=253;
 function spatialArt(scene){
  if(scene==='cave'||scene==='outside'){
   const outside=scene==='outside';
   const x=outside?92:100,y=outside?176.667:158.667,scale=outside?190/1536:220/1536;
   return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M380 870 V620 Q380 250 768 250 Q1180 250 1180 620 V870Z" fill="#000000"/><image href="${motorworxSeaSceneGraphics.cave}" x="0" y="0" width="1536" height="1024"/></g>`;
  }
  if(scene==='shell')return `<image href="${motorworxSeaSceneGraphics.shell}" x="158" y="154" width="160" height="130" preserveAspectRatio="xMidYMid meet"/>`;
  return `<image href="${motorworxSeaSceneGraphics.seaweed}" x="163" y="24" width="150" height="138" preserveAspectRatio="xMidYMid meet"/>`;
 }
 function spatialPoint(e){const r=spatialBoard.getBoundingClientRect();return{x:(e.clientX-r.left)*360/r.width,y:(e.clientY-r.top)*330/r.height}}
 function spatialPosition(x,y){spatialX=x;spatialY=y;spatialGhost.setAttribute('transform',`translate(${x} ${y})`)}
 function spatialDraw(){
  const r=spatialRounds[spatialRound];spatialDone=false;spatialDragging=false;spatialPointer=null;
  $('spatialInstruction').textContent=r.instruction;
  $('spatialCounter').textContent=`${spatialRound+1} of 4`;
  $('spatialScene').innerHTML=spatialArt(r.scene);
  // Outside destination sits clearly to the right of the house, never overlapping the structure.
  if(r.scene==='outside'){$('spatialScene').setAttribute('transform','translate(-48 0)')}else{$('spatialScene').removeAttribute('transform')}
  $('spatialTarget').innerHTML=`<circle class="drop-ring${r.scene==='cave'?' cave-target':''}" cx="${r.tx}" cy="${r.ty}" r="43"/>`;
  spatialPosition(61,253);
  $('spatialStars').hidden=true;
  $('spatialNext').hidden=true;$('spatialReset').hidden=false;
  $('spatialMessage').textContent='Touch the fish and drag it.';
  document.querySelectorAll('#spatialSteps span').forEach((el,i)=>el.classList.toggle('current',i<=spatialRound));
 }
 spatialBoard.addEventListener('pointerdown',e=>{
  if(spatialDone)return;
  const c=spatialPoint(e);
  if(Math.hypot(c.x-spatialX,c.y-spatialY)>51){$('spatialMessage').textContent='Touch the fish first.';return}
  spatialDragging=true;spatialPointer=e.pointerId;
  try{spatialBoard.setPointerCapture(e.pointerId)}catch(err){}
  $('spatialMessage').textContent='Move the fish to the dotted circle.';
  e.preventDefault();
 });
 spatialBoard.addEventListener('pointermove',e=>{
  if(!spatialDragging||e.pointerId!==spatialPointer)return;
  e.preventDefault();const c=spatialPoint(e);
  spatialPosition(Math.max(39,Math.min(321,c.x)),Math.max(45,Math.min(277,c.y)));
 });
 function spatialRelease(e){
  if(!spatialDragging||e.pointerId!==spatialPointer)return;
  spatialDragging=false;
  const r=spatialRounds[spatialRound];
  if(Math.hypot(spatialX-r.tx,spatialY-r.ty)<=49){
   spatialDone=true;window.motorworxFeedback?.('success','spatial');spatialPosition(r.tx,r.ty);$('spatialStars').hidden=false;
   $('spatialMessage').textContent=spatialRound===3?'Fantastic! You finished all four places!':'Well done! The fish is in the right place!';
   $('spatialNext').textContent=spatialRound===3?'Play again ↻':'Next place →';$('spatialNext').hidden=false;$('spatialReset').hidden=true;
  }else{$('spatialMessage').textContent='Good try! Move the fish into the circle.';window.motorworxFeedback?.('retry','spatial');spatialPosition(61,253)}
 }
 spatialBoard.addEventListener('pointerup',spatialRelease);
 spatialBoard.addEventListener('pointercancel',()=>{spatialDragging=false;spatialPosition(61,253)});
 $('startSpatial').addEventListener('click',()=>{spatialRound=0;spatialDraw();show('spatialScreen')});
 $('spatialBack').addEventListener('click',()=>{spatialDragging=false;show('chooseScreen')});
 $('spatialReset').addEventListener('click',spatialDraw);
 $('spatialNext').addEventListener('click',()=>{spatialRound=(spatialRound+1)%spatialRounds.length;spatialDraw()});


 // Game 6: visual closure with four large unmistakable missing parts.
 // The incorrect choice is deliberately a completely different object.
 const finishRounds=[
  {name:'apple',correct:0}, {name:'house',correct:1},
  {name:'bee',correct:0}, {name:'butterfly',correct:1}
 ];
 const makeSvg=(body,view='0 0 320 230')=>`<svg viewBox="${view}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
 const finParts={
  stemleaf:'<path d="M-7 30 Q-13 6 3 -6" fill="none" stroke="#5c944b" stroke-width="12" stroke-linecap="round"/><path d="M4 -5 Q26 -19 37 -1 Q17 9 4 -5Z" fill="#93d37f" stroke="#5c944b" stroke-width="5"/>',
  roof:'<path d="M-75 27 L0 -31 L75 27Z" fill="#e7a77d" stroke="#ba765d" stroke-width="6" stroke-linejoin="round"/>',
  beeWing:'<ellipse cx="-16" cy="-2" rx="18" ry="26" fill="#ecfbff" stroke="#89b6c4" stroke-width="5"/><ellipse cx="16" cy="-2" rx="18" ry="26" fill="#ecfbff" stroke="#89b6c4" stroke-width="5"/><path d="M-2 20 Q0 31 1 40" stroke="#89b6c4" stroke-width="3" fill="none"/>',
  butterflyWing:'<path d="M0 0 Q-40 -44 -86 -18 Q-64 10 -58 46 Q-18 35 0 12Z" fill="#f6a9c8" stroke="#c56b95" stroke-width="5" stroke-linejoin="round"/><path d="M-2 8 Q-34 34 -44 70 Q-14 62 -2 34Z" fill="#f2b6d1" stroke="#c56b95" stroke-width="5" stroke-linejoin="round"/>',
  star:'<path d="M0 -35 L10 -11 L36 -11 L16 5 L24 30 L0 15 L-24 30 L-16 5 L-36 -11 L-10 -11Z" fill="#f7cd62" stroke="#c18a39" stroke-width="5" stroke-linejoin="round"/>',
  circle:'<circle r="32" fill="#8bcfe8" stroke="#5499b1" stroke-width="5"/>',
  flower:'<circle cx="0" cy="0" r="12" fill="#ffd76b" stroke="#c4953e" stroke-width="4"/><circle cx="0" cy="-26" r="13" fill="#f5b8d0" stroke="#bf7892" stroke-width="4"/><circle cx="24" cy="-6" r="13" fill="#f5b8d0" stroke="#bf7892" stroke-width="4"/><circle cx="14" cy="22" r="13" fill="#f5b8d0" stroke="#bf7892" stroke-width="4"/><circle cx="-14" cy="22" r="13" fill="#f5b8d0" stroke="#bf7892" stroke-width="4"/><circle cx="-24" cy="-6" r="13" fill="#f5b8d0" stroke="#bf7892" stroke-width="4"/>',
  leaf:'<path d="M-30 12 Q2 -38 32 4 Q2 33 -30 12Z" fill="#9dd89b" stroke="#5f995d" stroke-width="5"/>',
  triangle:'<path d="M0 -34 L35 28 H-35Z" fill="#a6d8a3" stroke="#60955e" stroke-width="5"/>',
  square:'<rect x="-30" y="-30" width="60" height="60" rx="4" fill="#edabc5" stroke="#ba7394" stroke-width="5"/>'
 };
 const finConfig={
   apple:{missing:'stemleaf',wrong:'star',position:'translate(157 44)',art:'<path d="M157 60 C108 30 67 70 79 129 C87 187 121 204 157 188 C196 205 229 185 235 129 C247 71 207 30 157 60Z" fill="#ef6668" stroke="#c44d56" stroke-width="6"/><path d="M157 66 Q184 40 204 58" stroke="#e8898c" stroke-width="4" fill="none"/><circle cx="137" cy="129" r="7" fill="#fff4f2" opacity=".55"/>',hint:'stalk and leaf'},
   house:{missing:'roof',wrong:'circle',position:'translate(160 79)',art:'<rect x="88" y="106" width="144" height="110" rx="5" fill="#ffdfae" stroke="#be8662" stroke-width="6"/><rect x="145" y="154" width="37" height="62" fill="#d49f81" stroke="#b77d65" stroke-width="4"/><rect x="105" y="133" width="27" height="27" rx="4" fill="#bfe7f1" stroke="#8ea7b0" stroke-width="4"/>',hint:'roof'},
   bee:{missing:'beeWing',wrong:'flower',position:'translate(160 86)',art:'<ellipse cx="160" cy="138" rx="32" ry="45" fill="#f7cf57" stroke="#be9229" stroke-width="6"/><path d="M138 120 H182 M136 138 H184 M140 156 H180" stroke="#4e4141" stroke-width="8" stroke-linecap="round"/><circle cx="150" cy="130" r="4" fill="#3f3645"/><circle cx="170" cy="130" r="4" fill="#3f3645"/><path d="M154 145 Q160 150 166 145" stroke="#57424f" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M152 91 Q145 74 135 64 M168 91 Q175 74 185 64" stroke="#6f5967" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M160 180 L151 196 H169Z" fill="#4e4141"/>',hint:'wings'},
   butterfly:{missing:'butterflyWing',wrong:'leaf',position:'translate(118 105)',art:'<path d="M155 86 Q146 72 136 84 M165 86 Q174 72 184 84" stroke="#6f5967" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="160" cy="132" rx="11" ry="45" fill="#7aa6b6" stroke="#547b89" stroke-width="5"/><path d="M168 101 Q207 56 239 95 Q210 121 205 151 Q177 145 168 129Z" fill="#f6a9c8" stroke="#c56b95" stroke-width="5" stroke-linejoin="round"/><path d="M167 133 Q200 155 206 182 Q175 173 166 150Z" fill="#f2b6d1" stroke="#c56b95" stroke-width="5" stroke-linejoin="round"/><circle cx="155" cy="126" r="3" fill="#38495a"/><circle cx="165" cy="126" r="3" fill="#38495a"/>',hint:'wing'}
 };
 let finishIndex=0,finishDone=false,finishSelected=null,finishDrag=null;
 const finArtwork=$('finishArt');
 function finTarget(){
   const r=finishRounds[finishIndex];
   const points={apple:[157,44],house:[160,79],bee:[160,86],butterfly:[118,105]};
   return points[r.name];
 }
 function finPartSvg(i){
   const r=finishRounds[finishIndex],c=finConfig[r.name],name=i===r.correct?c.missing:c.wrong;
   return makeSvg(`<g transform="translate(95 90) scale(1.18)">${finParts[name]}</g>`,'0 0 190 180');
 }
 function finRender(){
   if(finishDrag)finClearDrag();
   const r=finishRounds[finishIndex],c=finConfig[r.name];finishDone=false;finishSelected=null;
   $('finishCounter').textContent=`${finishIndex+1} of 4`;
   document.querySelectorAll('#finishSteps span').forEach((el,i)=>el.classList.toggle('current',i<=finishIndex));
   const target=finTarget();
   const pos=r.name==='house'?'translate(160 79)':c.position;
   // The pale placeholder has exactly the same silhouette as the correct missing piece.
   finArtwork.innerHTML=makeSvg(c.art+`<g transform="${pos}" opacity=".22">${finParts[c.missing]}</g>`);
   [0,1].forEach(i=>{const el=$('finishChoice'+i);el.innerHTML=finPartSvg(i);el.disabled=false;el.classList.remove('correct','selected','dragging');el.setAttribute('aria-label',i===0?'Drag left piece to picture':'Drag right piece to picture')});
   $('finishMessage').textContent='Drag the missing piece into the empty shape.';$('finishNext').hidden=true;
 }
 function finClearDrag(){
   if(!finishDrag)return;
   finishDrag.ghost.remove();
   $('finishChoice'+finishDrag.idx).classList.remove('dragging');
   finishDrag=null;
 }
 function finComplete(idx){
   const r=finishRounds[finishIndex],c=finConfig[r.name];
   if(idx!==r.correct){animateObject($('finishChoice'+idx),false);$('finishMessage').textContent='That piece does not fit. Try the other one.';window.motorworxFeedback?.('retry','finish');return}
   finishDone=true;window.motorworxFeedback?.('success','finish');finishSelected=null;
   const pos=r.name==='house'?'translate(160 79)':c.position;
   finArtwork.innerHTML=makeSvg(c.art+`<g transform="${pos}">${finParts[c.missing]}</g>`);
   [0,1].forEach(i=>{$('finishChoice'+i).disabled=true;$('finishChoice'+i).classList.remove('selected')});
   animateObject($('finishChoice'+idx),true);finArtwork.classList.remove('ready');
   $('finishMessage').textContent=finishIndex===3?'Wonderful! All four pictures are complete!':'Well done! You completed the picture!';
   $('finishNext').textContent=finishIndex===3?'Play again ↻':'Next picture →';$('finishNext').hidden=false;
 }
 function finInTarget(clientX,clientY){
   const svg=finArtwork.querySelector('svg');if(!svg)return false;
   const rect=svg.getBoundingClientRect(),[x,y]=finTarget();
   const px=rect.left+x/320*rect.width,py=rect.top+y/230*rect.height;
   // Generous drop allowance for Level 1; never allows arbitrary drops elsewhere.
   const radius=Math.max(34, Math.min(56,rect.width*.16));
   return Math.hypot(clientX-px,clientY-py)<radius;
 }
 function finDrop(idx,x,y){
   if(finishDone)return;
   if(finInTarget(x,y)){finComplete(idx)}
   else $('finishMessage').textContent='Try placing the piece on the pale missing shape.';
 }
 [0,1].forEach(idx=>{
   const btn=$('finishChoice'+idx);
   btn.addEventListener('pointerdown',e=>{
     if(finishDone||finishDrag)return;
     if(e.button!==undefined&&e.button!==0)return;
     e.preventDefault();finishSelected=idx;
     [0,1].forEach(j=>$('finishChoice'+j).classList.toggle('selected',j===idx));
     const ghost=document.createElement('div');ghost.className='finish-floating';ghost.innerHTML=finPartSvg(idx);
     document.body.appendChild(ghost);ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';
     btn.classList.add('dragging');btn.setPointerCapture(e.pointerId);
     finishDrag={idx,ghost,id:e.pointerId,startX:e.clientX,startY:e.clientY,moved:false};
     $('finishMessage').textContent='Move the piece onto its matching shape.';
   });
   btn.addEventListener('pointermove',e=>{
     if(!finishDrag||finishDrag.id!==e.pointerId||finishDrag.idx!==idx)return;
     e.preventDefault();finishDrag.ghost.style.left=e.clientX+'px';finishDrag.ghost.style.top=e.clientY+'px';
     if(Math.hypot(e.clientX-finishDrag.startX,e.clientY-finishDrag.startY)>8)finishDrag.moved=true;
   });
   btn.addEventListener('pointerup',e=>{
     if(!finishDrag||finishDrag.id!==e.pointerId||finishDrag.idx!==idx)return;
     const moved=finishDrag.moved;finClearDrag();
     if(moved)finDrop(idx,e.clientX,e.clientY);
     else $('finishMessage').textContent='Now tap the empty shape, or drag the piece there.';
   });
   btn.addEventListener('pointercancel',finClearDrag);
   btn.addEventListener('lostpointercapture',finClearDrag);
   btn.addEventListener('click',()=>{
     if(finishDone)return;
     finishSelected=idx;
     [0,1].forEach(j=>$('finishChoice'+j).classList.toggle('selected',j===idx));
     $('finishMessage').textContent='Tap the empty shape to place the piece.';
   });
 });
 finArtwork.addEventListener('click',e=>{
   if(finishDone||finishSelected===null)return;
   if(finInTarget(e.clientX,e.clientY))finComplete(finishSelected);
   else $('finishMessage').textContent='Tap the pale missing shape.';
 });
 $('startFinish').addEventListener('click',()=>{finishIndex=0;finRender();show('finishScreen')});
 $('finishBack').addEventListener('click',()=>{finClearDrag();show('chooseScreen')});
 $('finishNext').addEventListener('click',()=>{
   if(!finishDone)return;
   finishIndex=finishIndex===finishRounds.length-1?0:finishIndex+1;
   finRender();
 });


 // Game 7 — repeated AB patterns. Only the symbols/starting positions vary.
 // Children recognise the next picture; no independent drawing required at Level 1.
 const patternRounds=[
   {items:['⭐','🎈','⭐'],choices:['🎈','⭐'],correct:0},
   {items:['🎈','⭐','🎈'],choices:['🎈','⭐'],correct:1},
   {items:['🌼','🔵','🌼'],choices:['🔵','🌼'],correct:0},
   {items:['🔵','🌼','🔵'],choices:['🔵','🌼'],correct:1}
 ];
 let patternIndex=0,patternComplete=false,patternDrag=null;
 function patternClearDrag(){
   if(!patternDrag)return;
   patternDrag.floating.remove();
   $('patternChoice'+patternDrag.which).classList.remove('dragging');
   patternDrag=null;
 }
 function patternRender(){
   patternClearDrag();
   const r=patternRounds[patternIndex];patternComplete=false;
   $('patternCounter').textContent=`${patternIndex+1} of ${patternRounds.length}`;
   $('patternExample').innerHTML=r.items.map((pic,i)=>`<div class="pattern-unit" aria-label="Picture ${i+1}: ${pic}">${pic}</div>`).join('')+'<div class="pattern-unit missing" id="patternMissing" aria-label="Empty position">?</div>';
   for(let i=0;i<2;i++){
     const b=$('patternChoice'+i);b.innerHTML=`<span class="choice-art">${r.choices[i]}</span>`;b.classList.remove('correct','dragging');b.disabled=false;
     b.setAttribute('aria-label',`Drag ${r.choices[i]} into the empty position`);
   }
   $('patternMessage').textContent='Drag the next picture into the empty space.';$('patternNext').hidden=true;
   [...$('patternSteps').children].forEach((el,i)=>el.classList.toggle('current',i<=patternIndex));
 }
 function patternChoose(which){
   if(patternComplete)return;
   const r=patternRounds[patternIndex];
   if(which!==r.correct){animateObject($('patternChoice'+which),false);$('patternMessage').textContent='Look again. Try the other picture.';window.motorworxFeedback?.('retry','pattern');return;}
   patternComplete=true;window.motorworxFeedback?.('success','pattern');
   const missing=$('patternMissing');missing.textContent=r.choices[r.correct];missing.classList.add('complete');missing.classList.remove('missing');animateObject(missing,true);
   for(let i=0;i<2;i++)$('patternChoice'+i).disabled=true;
   $('patternMessage').textContent=patternIndex===patternRounds.length-1?'All four patterns complete! Well done!':'Yes! You finished the pattern!';
   $('patternNext').textContent=patternIndex===patternRounds.length-1?'Play again ↻':'Next pattern →';$('patternNext').hidden=false;
 }
 function patternOnTarget(x,y){
   const target=$('patternMissing');if(!target)return false;
   const r=target.getBoundingClientRect();
   const cx=r.left+r.width/2,cy=r.top+r.height/2;
   return Math.abs(x-cx)<=r.width/2+34 && Math.abs(y-cy)<=r.height/2+34;
 }
 [0,1].forEach(which=>{
   const btn=$('patternChoice'+which);
   btn.addEventListener('pointerdown',e=>{
     if(patternComplete||patternDrag||e.button!==undefined&&e.button!==0)return;
     e.preventDefault();
     const floating=document.createElement('div');floating.className='pattern-floating';floating.textContent=patternRounds[patternIndex].choices[which];
     document.body.appendChild(floating);floating.style.left=e.clientX+'px';floating.style.top=e.clientY+'px';
     btn.classList.add('dragging');btn.setPointerCapture(e.pointerId);
     patternDrag={which,id:e.pointerId,floating};
     $('patternMessage').textContent='Drag the picture to the dotted space.';
   });
   btn.addEventListener('pointermove',e=>{
     if(!patternDrag||patternDrag.id!==e.pointerId||patternDrag.which!==which)return;
     e.preventDefault();patternDrag.floating.style.left=e.clientX+'px';patternDrag.floating.style.top=e.clientY+'px';
   });
   btn.addEventListener('pointerup',e=>{
     if(!patternDrag||patternDrag.id!==e.pointerId||patternDrag.which!==which)return;
     const goodDrop=patternOnTarget(e.clientX,e.clientY);patternClearDrag();
     if(goodDrop)patternChoose(which);
     else $('patternMessage').textContent='Move your picture into the dotted space.';
   });
   btn.addEventListener('pointercancel',patternClearDrag);
   btn.addEventListener('lostpointercapture',patternClearDrag);
 });
 $('startPattern').addEventListener('click',()=>{patternIndex=0;patternRender();show('patternScreen')});
 $('patternBack').addEventListener('click',()=>{patternClearDrag();show('chooseScreen')});
 $('patternNext').addEventListener('click',()=>{if(!patternComplete)return;patternIndex=(patternIndex+1)%patternRounds.length;patternRender()});

 // Game 8 — spot the different one. Two are the same and one is different.
 const diffRounds=[
  {items:['lion','lion','elephant'],correct:2},
  {items:['giraffe','monkey','giraffe'],correct:1},
  {items:['elephant','zebra','zebra'],correct:0},
  {items:['monkey','monkey','lion'],correct:2}
 ];
 let diffRound=0,diffDone=false;
 function renderDiff(){const r=diffRounds[diffRound];diffDone=false;$('diffCounter').textContent=`${diffRound+1} of ${diffRounds.length}`;for(let i=0;i<3;i++){const b=$('diffChoice'+i);b.innerHTML=`<span class="choice-art"><img src="${motorworxSafariGraphics[r.items[i]]}" alt="${r.items[i]}" draggable="false"></span>`;b.className='diff-choice';b.disabled=false;}$('diffMessage').textContent='Look carefully and choose the one that is different.';$('diffNext').hidden=true;document.querySelectorAll('#diffSteps span').forEach((el,i)=>el.classList.toggle('current',i<=diffRound));}
 function chooseDiff(i){if(diffDone)return;const r=diffRounds[diffRound];if(i!==r.correct){$('diffMessage').textContent='Try the different picture.';animateObject($('diffChoice'+i),false);window.motorworxFeedback?.('retry','diff');return;}diffDone=true;window.motorworxFeedback?.('success','diff');animateObject($('diffChoice'+i),true);[0,1,2].forEach(j=>$('diffChoice'+j).disabled=true);$('diffMessage').textContent=diffRound===diffRounds.length-1?'You found all the different pictures!':'Yes! That one is different!';$('diffNext').textContent=diffRound===diffRounds.length-1?'Play again ↻':'Next picture →';$('diffNext').hidden=false;}
 [0,1,2].forEach(i=>$('diffChoice'+i).addEventListener('click',()=>chooseDiff(i)));
 $('startDiff').addEventListener('click',()=>{diffRound=0;renderDiff();show('diffScreen')});
 $('diffBack').addEventListener('click',()=>show('chooseScreen'));
 $('diffNext').addEventListener('click',()=>{diffRound=(diffRound+1)%diffRounds.length;renderDiff()});

 // Game 9 — space visual tracking. The child hears the instruction first,
 // taps the stationary star to launch it, then taps the planet where it landed.
 // Each round uses different, very distinct space objects; only two landing choices.
 const starRounds=[
   {correct:0,choices:[{kind:'bluePlanet',name:'blue planet'},{kind:'pinkPlanet',name:'pink planet'}]},
   {correct:1,choices:[{kind:'moon',name:'moon'},{kind:'rocket',name:'rocket'}]},
   {correct:0,choices:[{kind:'ringPlanet',name:'ringed planet'},{kind:'satellite',name:'satellite'}]},
   {correct:1,choices:[{kind:'rocket',name:'rocket'},{kind:'moon',name:'moon'}]}
 ];
 const motorworxSpaceGraphics={"bluePlanet":"graphics/space/blue-planet.png","pinkPlanet":"graphics/space/pink-planet.png","moon":"graphics/space/moon.png","rocket":"graphics/space/rocket.png","ringPlanet":"graphics/space/ringed-planet.png","satellite":"graphics/space/satellite.png"};
 function starSpacePicture(kind,x,y){
  return `<g transform="translate(${x} ${y})"><image href="${motorworxSpaceGraphics[kind]}" x="-56" y="-56" width="112" height="112" preserveAspectRatio="xMidYMid meet"/></g>`;
 }
 function starAnimateChoice(which,correct){
   const art=$('star'+(which===0?'Left':'Right')+'Art');
   art.classList.remove('star-art-tap','star-art-wrong');
   void art.getBoundingClientRect();
   art.classList.add(correct?'star-art-tap':'star-art-wrong');
 }
 const previousStarDestination=[null,null,null,null];
 let starDestination=0;
 let starRound=0,starComplete=false,starReady=false,starFrame=0,starDelay=0,starRun=0,starPhase='intro',starIntroFallback=0;
 const movingStar=$('movingStar');
 function starCancel(){
   starRun++;
   if(starFrame)cancelAnimationFrame(starFrame);
   if(starDelay)clearTimeout(starDelay);
   if(starIntroFallback)clearTimeout(starIntroFallback);
   starFrame=0;starDelay=0;starIntroFallback=0;
 }
 function starPosition(x,y){movingStar.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);}
 function starIntroDone(){
   if(starPhase!=='intro'||$('starScreen').hidden)return;
   starPhase='launch';$('starLaunch').disabled=false;
   $('starMessage').textContent='Tap the star to start!';
 }
 window.motorworxStarIntroDone=starIntroDone;
 window.motorworxStarNeedsIntro=()=>starPhase==='intro';
 function starWatch(){
   starCancel();starComplete=false;starReady=false;starPhase='intro';
   const run=starRun;
   $('starCounter').textContent=`${starRound+1} of ${starRounds.length}`;
   $('starInstruction').textContent='Tap the star to start.';
   $('starHint').textContent='Then watch where it lands!';
   $('starMessage').textContent='Listen to the instruction.';
   $('starNext').hidden=true;
   movingStar.style.display='';
   $('starLaunch').hidden=false;$('starLaunch').disabled=true;
   const r=starRounds[starRound];
   // Random first play; a same-round replay changes the landing place.
   let destination=Math.random()<.5?0:1;
   if(previousStarDestination[starRound]===destination)destination=1-destination;
   previousStarDestination[starRound]=destination;
   starDestination=destination;
   [0,1].forEach(i=>{
     const b=$('starChoice'+i);b.disabled=true;b.classList.remove('selected');
     const art=$('star'+(i===0?'Left':'Right')+'Art');
     art.classList.remove('star-art-tap','star-art-wrong');
     art.innerHTML=starSpacePicture(r.choices[i].kind,i===0?82:279,215);
     b.setAttribute('aria-label',`Tap the ${r.choices[i].name}`);
   });
   document.querySelectorAll('#starSteps span').forEach((el,i)=>el.classList.toggle('current',i<=starRound));
   starPosition(180,59);
   // If the device cannot play speech or fails to report completion,
   // the child can still begin without waiting indefinitely.
   starIntroFallback=setTimeout(()=>{if(run===starRun)starIntroDone()},9000);
 }
 function starLaunch(){
   if(starPhase!=='launch'||$('starScreen').hidden)return;
   starPhase='moving';$('starLaunch').hidden=true;$('starLaunch').disabled=true;
   $('starInstruction').textContent='Watch the star!';
   $('starHint').textContent='Follow it with your eyes.';
   $('starMessage').textContent='Watch where it lands!';
   const run=starRun,endX=starDestination===0?82:279;
   let started=null;
   function animate(time){
     if(run!==starRun||$('starScreen').hidden)return;
     if(started===null)started=time;
     const t=Math.min(1,(time-started)/3200);
     const u=t*t*(3-2*t);
     const x=180+(endX-180)*u;
     const y=59+142*u-18*Math.sin(Math.PI*u);
     starPosition(x,y);
     if(t<1)starFrame=requestAnimationFrame(animate);
     else{
       starFrame=0;
       starDelay=setTimeout(()=>{
         if(run!==starRun||$('starScreen').hidden)return;
         movingStar.style.display='none';starReady=true;starPhase='choose';
         $('starInstruction').textContent='Where did the star land?';
         $('starHint').textContent='Tap where the star stopped.';
         $('starMessage').textContent='Tap the landing place!';
         [0,1].forEach(i=>$('starChoice'+i).disabled=false);
         window.motorworxSpeakCurrent?.();
       },850);
     }
   }
   starFrame=requestAnimationFrame(animate);
 }
 function starChoose(which){
   if(!starReady||starComplete)return;
   if(which!==starDestination){
     starAnimateChoice(which,false);
     $('starMessage').textContent='Have another look. Where did the star land?';
     window.motorworxFeedback?.('retry','star');return;
   }
   starComplete=true;starReady=false;starPhase='complete';
   starAnimateChoice(which,true);
   [0,1].forEach(i=>$('starChoice'+i).disabled=true);
   $('starMessage').textContent='Well done!';
   window.motorworxFeedback?.('success','star');
   $('starNext').textContent=starRound===starRounds.length-1?'Play again ↻':'Next star →';
   $('starNext').hidden=false;
 }
 $('starLaunch').addEventListener('click',starLaunch);
 [0,1].forEach(i=>$('starChoice'+i).addEventListener('click',()=>starChoose(i)));
 $('startStar').addEventListener('click',()=>{starRound=0;show('starScreen');starWatch()});
 $('starReplay').addEventListener('click',starWatch);
 $('starBack').addEventListener('click',()=>{starCancel();starPhase='away';show('chooseScreen')});
 $('starNext').addEventListener('click',()=>{if(!starComplete)return;starRound=(starRound+1)%starRounds.length;starWatch()});

 // Game 10: match a large, solid sea-creature silhouette to one of two pictures.
 // The silhouette uses the EXACT same shape as the correct picture.
 const shadowRounds=[
  {target:'fish',other:'starfish',correct:1},
  {target:'turtle',other:'fish',correct:0},
  {target:'starfish',other:'crab',correct:1},
  {target:'crab',other:'turtle',correct:0}
 ];
 const shadowNames={fish:'fish',turtle:'turtle',starfish:'starfish',crab:'crab'};
 const motorworxSeaGraphics={"fish":"graphics/ocean/fish.png","turtle":"graphics/ocean/turtle.png","crab":"graphics/ocean/crab.png","starfish":"graphics/ocean/starfish.png"};
 motorworxSeaGraphics.octopus=motorworxSeaSceneGraphics.octopus;
 // Reuse the upgraded sea artwork across placing, matching and ocean-window activities.
 $('spatialFishImage').setAttribute('href',motorworxSeaGraphics.fish);
 [['startSpatial','fish'],['startShadow','fish'],['startWipe','crab']].forEach(([id,name])=>{
  $(id).querySelector('.tile-emoji').innerHTML=`<img src="${motorworxSeaGraphics[name]}" alt="" style="width:86px;height:72px;object-fit:contain;display:block"/>`;
 });
 function seaCreature(kind,silhouette){
  const filterId='motorworx-sea-shadow-'+kind;
  const shadowFilter=silhouette?`<defs><filter id="${filterId}" x="0" y="0" width="180" height="160" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .270588 0 0 0 0 .356863 0 0 0 0 .474510 0 0 0 1 0"/></filter></defs>`:'';
  return `<svg viewBox="0 0 180 160" role="img" aria-label="${shadowNames[kind]+(silhouette?' shadow':'')}">${shadowFilter}<image href="${motorworxSeaGraphics[kind]}" x="10" y="8" width="160" height="144" preserveAspectRatio="xMidYMid meet" ${silhouette?`filter="url(#${filterId})"`:''}/></svg>`;
 }
 let shadowRound=0,shadowDone=false;
 function shadowRender(){
  shadowDone=false;
  const r=shadowRounds[shadowRound];
  $('shadowCounter').textContent=`${shadowRound+1} of ${shadowRounds.length}`;
  $('shadowTarget').innerHTML=seaCreature(r.target,true);
  [0,1].forEach(i=>{
   const b=$('shadowChoice'+i),kind=i===r.correct?r.target:r.other;
   b.innerHTML=seaCreature(kind,false);b.disabled=false;b.setAttribute('aria-label',shadowNames[kind]);
  });
  document.querySelectorAll('#shadowSteps span').forEach((el,i)=>el.classList.toggle('current',i<=shadowRound));
  $('shadowMessage').textContent='Tap the picture with the matching shape.';
  $('shadowNext').hidden=true;
 }
 function shadowChoose(i){
  if(shadowDone)return;
  if(i!==shadowRounds[shadowRound].correct){
   $('shadowMessage').textContent='Look for the sea friend shaped like the shadow.';
   animateObject($('shadowChoice'+i),false);
   window.motorworxFeedback?.('retry','shadow');return;
  }
  shadowDone=true;animateObject($('shadowChoice'+i),true);
  window.motorworxFeedback?.('success','shadow');
  [0,1].forEach(j=>$('shadowChoice'+j).disabled=true);
  $('shadowMessage').textContent='Well done!';
  $('shadowNext').textContent=shadowRound===shadowRounds.length-1?'Play again ↻':'Next shadow →';
  $('shadowNext').hidden=false;
 }
 [0,1].forEach(i=>$('shadowChoice'+i).addEventListener('click',()=>shadowChoose(i)));
 $('startShadow').addEventListener('click',()=>{shadowRound=0;shadowRender();show('shadowScreen')});
 $('shadowBack').addEventListener('click',()=>show('chooseScreen'));
 $('shadowNext').addEventListener('click',()=>{if(!shadowDone)return;shadowRound=(shadowRound+1)%shadowRounds.length;shadowRender()});

 // Game 11 — Level 1 visual memory: two pictures, then one clearly disappears.
 // Only the original two pictures are offered as choices, so one is unambiguous.
 const disappearRounds=[
  {items:['🚗','🧸'],missing:0,order:[1,0]},
  {items:['⚽','🚂'],missing:1,order:[0,1]},
  {items:['🪁','🚗'],missing:0,order:[0,1]},
  {items:['🧸','⚽'],missing:1,order:[1,0]}
 ];
 let disappearRound=0,disappearPhase='look';
 function disappearRender(){
  const r=disappearRounds[disappearRound];disappearPhase='look';
  $('disappearCounter').textContent=`${disappearRound+1} of ${disappearRounds.length}`;
  document.querySelectorAll('#disappearSteps span').forEach((el,i)=>el.classList.toggle('current',i<=disappearRound));
  $('disappearInstruction').textContent='Look at both pictures.';
  $('disappearHint').textContent='Remember what you see.';
  $('disappearStageLabel').textContent='Look carefully';
  [0,1].forEach(i=>{const el=$('disappearItem'+i);el.textContent=r.items[i];el.classList.remove('vanished');el.setAttribute('aria-label',i===0?'First object':'Second object')});
  $('disappearReadyControls').hidden=false;$('disappearPick').hidden=true;
  $('disappearNext').hidden=true;$('disappearMessage').textContent='Look at the two pictures.';
 }
 function disappearHide(){
  if(disappearPhase!=='look')return;
  disappearPhase='choose';const r=disappearRounds[disappearRound];
  const missing=$('disappearItem'+r.missing);missing.textContent='?';missing.classList.add('vanished');
  $('disappearReadyControls').hidden=true;$('disappearPick').hidden=false;
  $('disappearInstruction').textContent='Which picture went away?';
  $('disappearHint').textContent='Tap the picture that disappeared.';
  $('disappearStageLabel').textContent='One picture is missing';
  r.order.forEach((itemIndex,i)=>{
   const b=$('disappearChoice'+i);b.innerHTML=`<span class="choice-art" aria-hidden="true">${r.items[itemIndex]}</span>`;
   b.disabled=false;b.setAttribute('aria-label',`Choice ${i+1}`);
  });
  $('disappearMessage').textContent='What is missing?';
 }
 function disappearChoose(i){
  if(disappearPhase!=='choose')return;
  const r=disappearRounds[disappearRound],correct=r.order[i]===r.missing;
  animateObject($('disappearChoice'+i),correct);
  if(!correct){$('disappearMessage').textContent='Have another look. Which one went away?';window.motorworxFeedback?.('retry','disappear');return}
  disappearPhase='done';window.motorworxFeedback?.('success','disappear');
  $('disappearItem'+r.missing).textContent=r.items[r.missing];$('disappearItem'+r.missing).classList.remove('vanished');
  [0,1].forEach(j=>$('disappearChoice'+j).disabled=true);
  $('disappearMessage').textContent='Well done!';
  $('disappearNext').textContent=disappearRound===disappearRounds.length-1?'Play again ↻':'Next picture →';
  $('disappearNext').hidden=false;
 }
 $('startDisappear').addEventListener('click',()=>{disappearRound=0;disappearRender();show('disappearScreen')});
 $('disappearBack').addEventListener('click',()=>show('chooseScreen'));
 $('disappearReady').addEventListener('click',disappearHide);
 [0,1].forEach(i=>$('disappearChoice'+i).addEventListener('click',()=>disappearChoose(i)));
 $('disappearNext').addEventListener('click',()=>{if(disappearPhase!=='done')return;disappearRound=(disappearRound+1)%disappearRounds.length;disappearRender()});
 // Game 12: simple spatial reaching with a single large target. Different positions, same difficulty.
 const bubblePositions=[[50,43],[29,59],[72,37],[47,65]];
 let bubbleRound=0,bubbleDone=false,bubbleAdvanceTimer=null;
 function cancelBubbleAdvance(){if(bubbleAdvanceTimer!==null){clearTimeout(bubbleAdvanceTimer);bubbleAdvanceTimer=null;}}
 function bubbleRender(){
  cancelBubbleAdvance();bubbleDone=false;
  const target=$('bubbleTarget'),pos=bubblePositions[bubbleRound];
  target.disabled=false;target.classList.remove('popped');target.style.left=pos[0]+'%';target.style.top=pos[1]+'%';
  $('bubbleCounter').textContent=`${bubbleRound+1} of ${bubblePositions.length}`;
  document.querySelectorAll('#bubbleSteps span').forEach((el,i)=>el.classList.toggle('current',i<=bubbleRound));
  $('bubbleMessage').textContent='Tap the bubble!';$('bubbleNext').hidden=true;
 }
 $('startBubble').addEventListener('click',()=>{cancelBubbleAdvance();bubbleRound=0;bubbleRender();show('bubbleScreen')});
 $('bubbleBack').addEventListener('click',()=>{cancelBubbleAdvance();show('chooseScreen')});
 $('bubbleTarget').addEventListener('click',()=>{
  if(bubbleDone)return;bubbleDone=true;
  $('bubbleTarget').classList.add('popped');$('bubbleTarget').disabled=true;
  $('bubbleMessage').textContent='Pop! Well done!';window.motorworxFeedback?.('success','bubble');
  if(bubbleRound===bubblePositions.length-1){
   $('bubbleMessage').textContent='All the bubbles popped! Well done!';
   $('bubbleNext').textContent='Play again ↻';$('bubbleNext').hidden=false;
  }else{
   // Allow the pop animation and encouraging voice to finish before moving on.
   bubbleAdvanceTimer=setTimeout(()=>{
    bubbleAdvanceTimer=null;
    if(!$('bubbleScreen').hidden&&bubbleDone){
     bubbleRound++;bubbleRender();
     window.motorworxSpeakInstruction?.('bubbleScreen');
    }
   },2300);
  }
 });
 $('bubbleNext').addEventListener('click',()=>{if(!bubbleDone)return;cancelBubbleAdvance();bubbleRound=0;bubbleRender()});

 // Game 13 — controlled finger tracing with one simple corner per round.
 const turnBoard=$('turnBoard');
 // Repeat the same easy two-segment L skill, changing the direction and friend.
 const turnRounds=[
   {points:[[80,237],[213,237],[213,105]],friend:'duckling',destination:'pond',start:'🐥',end:'🪷',friendAsset:'duckling',endAsset:'pond'},
   {points:[[83,92],[230,92],[230,236]],friend:'bunny',destination:'carrot',start:'🐰',end:'🥕',friendAsset:'bunny',endAsset:'carrot'},
   {points:[[277,231],[107,231],[107,92]],friend:'puppy',destination:'bone',start:'🐶',end:'🦴',friendAsset:'puppy',endAsset:'bone'}
 ];
 let turnRound=0,turnDistance=0,turnDragging=false,turnPointer=null,turnDone=false,turnLastPos=null,turnApproaching=false;
 const turnPts=()=>turnRounds[turnRound].points;
 const turnLength=()=>Math.hypot(turnPts()[1][0]-turnPts()[0][0],turnPts()[1][1]-turnPts()[0][1])+Math.hypot(turnPts()[2][0]-turnPts()[1][0],turnPts()[2][1]-turnPts()[1][1]);
 function turnPointAt(d){const p=turnPts(),first=Math.hypot(p[1][0]-p[0][0],p[1][1]-p[0][1]),whole=turnLength();d=Math.max(0,Math.min(whole,d));if(d<=first)return [p[0][0]+(p[1][0]-p[0][0])*d/first,p[0][1]+(p[1][1]-p[0][1])*d/first];const t=(d-first)/(whole-first);return [p[1][0]+(p[2][0]-p[1][0])*t,p[1][1]+(p[2][1]-p[1][1])*t];}
 function turnMoveFriend(){const spot=turnPointAt(turnDistance),r=turnRounds[turnRound];$('turnStart').setAttribute('x',spot[0]);$('turnStart').setAttribute('y',spot[1]); if((r.friendAsset||'').includes('bunny')){ $('turnStartImage').setAttribute('x',spot[0]-26); $('turnStartImage').setAttribute('y',spot[1]-38);} else { $('turnStartImage').setAttribute('x',spot[0]-30); $('turnStartImage').setAttribute('y',spot[1]-46);} }
 function turnPathTo(d){const a=turnPts()[0],b=turnPts()[1],len1=Math.hypot(b[0]-a[0],b[1]-a[1]);const mid=turnPointAt(d);return `M${a[0]} ${a[1]} ${d>len1?`L${b[0]} ${b[1]} `:''}L${mid[0]} ${mid[1]}`;}
 function turnRender(){const p=turnPts(),base=`M${p[0][0]} ${p[0][1]} L${p[1][0]} ${p[1][1]} L${p[2][0]} ${p[2][1]}`;
  turnDistance=0;turnDragging=false;turnPointer=null;turnDone=false;turnLastPos=null;turnApproaching=false;
  $('turnWide').setAttribute('d',base);$('turnDots').setAttribute('d',base);$('turnProgress').setAttribute('d',turnPathTo(0));
  const r=turnRounds[turnRound];
  $('turnStart').textContent=r.start;$('turnEnd').textContent=r.end;
  $('turnStartImage').setAttribute('href',`${motorworxAnimalGraphic(r.friendAsset)}`);$('turnEndImage').setAttribute('href',`${motorworxAnimalGraphic(r.endAsset)}`);
  turnMoveFriend();
  turnBoard.appendChild($('turnStartImage'));
  $('turnEnd').setAttribute('x',r.endAsset==='carrot'?p[2][0]:p[2][0]);$('turnEnd').setAttribute('y',r.endAsset==='carrot'?p[2][1]+30:p[2][1]-42);if(r.endAsset==='pond'){$('turnEndImage').setAttribute('x',p[2][0]-38);$('turnEndImage').setAttribute('y',p[2][1]-89);$('turnEndImage').setAttribute('width',85);$('turnEndImage').setAttribute('height',57);}else if(r.endAsset==='carrot'){$('turnEndImage').setAttribute('x',p[2][0]-28);$('turnEndImage').setAttribute('y',p[2][1]+9);$('turnEndImage').setAttribute('width',56);$('turnEndImage').setAttribute('height',67);}else{$('turnEndImage').setAttribute('x',p[2][0]-38);$('turnEndImage').setAttribute('y',p[2][1]-89);$('turnEndImage').setAttribute('width',60);$('turnEndImage').setAttribute('height',78);}
  $('turnScreen').querySelector('.instruction').textContent=`Trace the dots to the ${r.destination}.`;
  $('turnScreen').querySelector('.hint').textContent=`Start at the ${r.friend}. Follow the dots and turn the corner.`;
  turnBoard.setAttribute('aria-label',`Trace a wide L-shaped trail from the ${r.friend} to the ${r.destination}`);
  $('turnCounter').textContent=`${turnRound+1} of ${turnRounds.length}`;
  document.querySelectorAll('#turnSteps span').forEach((e,i)=>e.classList.toggle('current',i<=turnRound));
  $('turnNext').hidden=true;$('turnReset').hidden=false;$('turnMessage').classList.remove('turn-error');$('turnMessage').textContent=`Start on the ${r.friend}.`;
 }
 function turnCoordinates(e){const r=turnBoard.getBoundingClientRect();return {x:(e.clientX-r.left)*360/r.width,y:(e.clientY-r.top)*320/r.height};}
 function turnClosest(pos){const pts=turnPts();let best={dist:1e6,along:0},offset=0;
  for(let j=0;j<2;j++){const a=pts[j],b=pts[j+1],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),t=Math.min(1,Math.max(0,((pos.x-a[0])*dx+(pos.y-a[1])*dy)/(len*len))),x=a[0]+dx*t,y=a[1]+dy*t,dist=Math.hypot(pos.x-x,pos.y-y);if(dist<best.dist)best={dist,along:offset+t*len};offset+=len;}
  return best;
 }
 // Keep every successfully traced segment when the child leaves the dots.
 // On a retry, the child resumes at the green line's end, not at the animal.
 function turnStartLabel(){return `Start on the ${turnRounds[turnRound].friend}.`;}
 function turnResumeLabel(){return turnDistance>3?`Touch the ${turnRounds[turnRound].friend} to keep going.`:turnStartLabel();}
 function turnPauseAttempt(){
  turnDragging=false;turnPointer=null;turnLastPos=null;turnApproaching=false;
  // Deliberately do not change turnDistance or the green progress path.
 }
 function turnMistake(message){
  turnPauseAttempt();
  $('turnMessage').textContent=message;
  const area=$('turnMessage');
  area.classList.remove('turn-error');void area.offsetWidth;area.classList.add('turn-error');
  window.motorworxFeedback?.('retry','turn');
 }
 function turnCoordinatesAccurate(e){
  const pt=turnBoard.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;
  const ctm=turnBoard.getScreenCTM();
  if(ctm){const local=pt.matrixTransform(ctm.inverse());return {x:local.x,y:local.y};}
  return turnCoordinates(e);
 }
 function turnIsAtAnimal(pos){
  const a=turnPts()[0];
  return Math.hypot(pos.x-a[0],pos.y-a[1])<=32;
 }
 function turnResumePoint(){const xy=turnPointAt(turnDistance);return {x:xy[0],y:xy[1]};}
 function turnValidResumeTouch(pos){
  if(turnDistance<=3)return turnIsAtAnimal(pos);
  // A toddler-friendly touch target around the last green dot.
  const end=turnResumePoint();
  return Math.hypot(pos.x-end.x,pos.y-end.y)<=32;
 }
 turnBoard.addEventListener('pointerdown',e=>{
  if(turnDone)return;
  e.preventDefault();
  const p=turnCoordinatesAccurate(e);
  if(!turnValidResumeTouch(p)){
   // A misplaced touch is guidance, not a loss of completed tracing.
   turnMistake(turnResumeLabel());
   return;
  }
  turnDragging=true;turnPointer=e.pointerId;
  const a=turnPts()[0];
  // The moving animal is centred on the currently traced endpoint.
  turnApproaching=false;
  turnLastPos=turnResumePoint();
  try{turnBoard.setPointerCapture(e.pointerId)}catch(_){}
  $('turnMessage').classList.remove('turn-error');
  $('turnMessage').textContent='Follow the dots!';
 });
 turnBoard.addEventListener('pointermove',e=>{
  if(!turnDragging||turnPointer!==e.pointerId||turnDone)return;
  e.preventDefault();
  const pos=turnCoordinatesAccurate(e),previous=turnLastPos||pos;
  if(turnApproaching){
   const a=turnPts()[0];
   if(Math.abs(pos.x-a[0])>23 || pos.y<a[1]-86 || pos.y>a[1]+18){
    turnMistake('Oops, stay on the path! '+turnStartLabel());return;
   }
   if(Math.hypot(pos.x-a[0],pos.y-a[1])>14)return;
   turnApproaching=false;turnLastPos={x:a[0],y:a[1]};
   return;
  }
  const tolerance=14;
  const travel=Math.hypot(pos.x-previous.x,pos.y-previous.y);
  const samples=Math.max(1,Math.ceil(travel/3));
  let ahead=turnDistance;
  let error=null;
  for(let i=1;i<=samples;i++){
   const t=i/samples;
   const sample={x:previous.x+(pos.x-previous.x)*t,y:previous.y+(pos.y-previous.y)*t};
   const near=turnClosest(sample);
   if(near.dist>tolerance){error='Oops, stay on the path!';break;}
   if(near.along<ahead-15){error='Oops, follow the dots forwards!';break;}
   if(near.along>ahead+23){error='Oops, follow the dotted path!';break;}
   ahead=Math.max(ahead,near.along);
  }
  // Preserve valid progress up to the exact place the finger went wrong.
  turnDistance=Math.max(turnDistance,ahead);
  $('turnProgress').setAttribute('d',turnPathTo(turnDistance));
  turnMoveFriend();
  if(error){turnMistake(error+' '+turnResumeLabel());return;}
  turnLastPos=pos;
  if(turnDistance>=turnLength()-10){
   turnDistance=turnLength();turnDragging=false;turnDone=true;turnLastPos=null;turnPointer=null;
   $('turnProgress').setAttribute('d',turnPathTo(turnDistance));turnMoveFriend();
   $('turnMessage').classList.remove('turn-error');$('turnMessage').textContent='Well done!';
   window.motorworxFeedback?.('success','turn');
   $('turnNext').textContent=turnRound===turnRounds.length-1?'Play again ↻':'Next path →';
   $('turnNext').hidden=false;$('turnReset').hidden=true;
  }
 });
 turnBoard.addEventListener('pointerup',e=>{
  if(turnPointer!==e.pointerId)return;
  if(turnDragging&&!turnDone)turnMistake('Keep your finger on the path. '+turnResumeLabel());
  else turnPauseAttempt();
 });
 turnBoard.addEventListener('pointercancel',()=>{
  if(turnDragging&&!turnDone)turnMistake('Follow the dots. '+turnResumeLabel());
 });
 turnBoard.addEventListener('lostpointercapture',()=>{
  if(turnDragging&&!turnDone)turnMistake('Follow the dots. '+turnResumeLabel());
 });
 $('startTurn').addEventListener('click',()=>{turnRound=0;turnRender();show('turnScreen')});
 $('turnBack').addEventListener('click',()=>{turnDragging=false;show('chooseScreen')});
 $('turnReset').addEventListener('click',turnRender);
 $('turnNext').addEventListener('click',()=>{if(!turnDone)return;turnRound=(turnRound+1)%turnRounds.length;turnRender()});

 // Game 14 — Level 1 spatial awareness. Repeat only TOP and BOTTOM, one at a time.
 // Both pictures are deliberately identical and equally large; only position differs.
 const whichRounds=[
   {pic:'🧸',name:'teddy',place:'TOP',correct:0},
   {pic:'🚗',name:'car',place:'BOTTOM',correct:1},
   {pic:'🎈',name:'balloon',place:'TOP',correct:0},
   {pic:'⭐',name:'star',place:'BOTTOM',correct:1}
 ];
 let whichRound=0,whichDone=false;
 function whichRender(){
   const r=whichRounds[whichRound];whichDone=false;
   $('whichCounter').textContent=`${whichRound+1} of ${whichRounds.length}`;
   $('whichInstruction').textContent=`Tap the ${r.name} at the ${r.place}.`;
   for(let i=0;i<2;i++){
     const b=$('whichChoice'+i),picture=b.querySelector('.which-picture');
     b.disabled=false;b.className='which-choice';picture.textContent=r.pic;
     picture.className='which-picture';
     b.setAttribute('aria-label',`${r.name} at the ${i===0?'top':'bottom'}`);
   }
   $('whichMessage').textContent='Choose the right place.';
   $('whichNext').hidden=true;
   [...$('whichSteps').children].forEach((e,i)=>e.classList.toggle('current',i<=whichRound));
 }
 function whichPick(i){
   if(whichDone)return;
   const r=whichRounds[whichRound],b=$('whichChoice'+i);
   b.classList.remove('try-again','celebrate');void b.offsetWidth;
   if(i!==r.correct){
     b.classList.add('try-again');$('whichMessage').textContent=`Oops! Find the ${r.name} at the ${r.place.toLowerCase()}.`;
     window.motorworxFeedback?.('retry','which');return;
   }
   whichDone=true;b.classList.add('celebrate');
   $('whichChoice0').disabled=true;$('whichChoice1').disabled=true;
   $('whichMessage').textContent='Well done!';
   $('whichNext').textContent=whichRound===whichRounds.length-1?'Play again ↻':'Next picture →';
   $('whichNext').hidden=false;window.motorworxFeedback?.('success','which');
 }
 [0,1].forEach(i=>$('whichChoice'+i).addEventListener('click',()=>whichPick(i)));
 $('startWhich').addEventListener('click',()=>{whichRound=0;whichRender();show('whichScreen')});
 $('whichBack').addEventListener('click',()=>show('chooseScreen'));
 $('whichNext').addEventListener('click',()=>{if(!whichDone)return;whichRound=(whichRound+1)%whichRounds.length;whichRender()});

 // Game 15: repeated supported hand-eye movement, with one food and one bowl.
 const feedRounds=[
  {animal:'🐰',name:'bunny',asset:'bunny',food:'🥕',foodName:'carrot',foodAsset:'carrot'},
  {animal:'🐶',name:'puppy',asset:'puppy',food:'🦴',foodName:'bone',foodAsset:'bone'},
  {animal:'🐵',name:'monkey',asset:'monkey',food:'🍌',foodName:'banana',foodAsset:'banana'},
  {animal:'🐭',name:'mouse',asset:'mouse',food:'🧀',foodName:'cheese',foodAsset:'cheese'}
 ];
 let feedRound=0,feedDone=false,feedDragging=false,feedPointer=null,feedStart=null;
 const feedBoard=$('feedBoard'),feedFood=$('feedFood');
 function feedHome(){feedFood.style.left=feedBoard.clientWidth<=390?'29%':'26%';feedFood.style.top=feedBoard.clientWidth<=390?'235px':'258px'}
 function feedRender(){
  const r=feedRounds[feedRound];feedDone=false;feedDragging=false;feedPointer=null;
  $('feedCounter').textContent=`${feedRound+1} of ${feedRounds.length}`;
  $('feedBowl').innerHTML=`<img src="${motorworxAnimalGraphic('bowl')}" alt="Food bowl" draggable="false">`;
  $('feedAnimal').innerHTML=`<img src="${motorworxAnimalGraphic(r.asset)}" alt="${r.name}" draggable="false">`;feedFood.innerHTML=`<img src="${motorworxAnimalGraphic(r.foodAsset)}" alt="${r.foodName}" draggable="false">`;
  $('feedInstruction').textContent=`Give the ${r.name} the ${r.foodName}.`;
  feedFood.setAttribute('aria-label',`Drag the ${r.foodName} into the bowl`);
  feedFood.className='feed-food';feedFood.style.visibility='visible';
  $('feedBowl').classList.remove('success');feedHome();
  $('feedNext').hidden=true;$('feedMessage').textContent='Drag the food into the bowl.';
  [...$('feedSteps').children].forEach((el,i)=>el.classList.toggle('current',i<=feedRound));
 }
 function feedPosition(clientX,clientY){
  const b=feedBoard.getBoundingClientRect();
  feedFood.style.left=Math.max(48,Math.min(b.width-48,clientX-b.left))+'px';
  feedFood.style.top=Math.max(48,Math.min(b.height-44,clientY-b.top))+'px';
 }
 function feedDrop(clientX,clientY){
  const b=$('feedBowl').getBoundingClientRect();
  return clientX>=b.left-20&&clientX<=b.right+20&&clientY>=b.top-22&&clientY<=b.bottom+22;
 }
 function feedSuccess(){
  if(feedDone)return;feedDone=true;
  const b=$('feedBowl').getBoundingClientRect();feedPosition(b.left+b.width/2,b.top+b.height/2);
  $('feedBowl').classList.add('success');feedFood.style.visibility='hidden';
  $('feedMessage').textContent='Well done!';
  $('feedNext').textContent=feedRound===feedRounds.length-1?'Play again ↻':'Next animal →';
  $('feedNext').hidden=false;window.motorworxFeedback?.('success','feed');
 }
 feedFood.addEventListener('pointerdown',e=>{
  if(feedDone||feedDragging||(e.button!==undefined&&e.button!==0))return;
  e.preventDefault();feedDragging=true;feedPointer=e.pointerId;feedStart={x:e.clientX,y:e.clientY};
  feedFood.classList.add('dragging');feedFood.setPointerCapture(e.pointerId);
 });
 feedFood.addEventListener('pointermove',e=>{
  if(!feedDragging||feedPointer!==e.pointerId)return;e.preventDefault();feedPosition(e.clientX,e.clientY);
 });
 feedFood.addEventListener('pointerup',e=>{
  if(!feedDragging||feedPointer!==e.pointerId)return;e.preventDefault();feedDragging=false;feedFood.classList.remove('dragging');
  if(feedDrop(e.clientX,e.clientY))feedSuccess();
  else{feedFood.classList.remove('wiggle');void feedFood.offsetWidth;feedFood.classList.add('wiggle');$('feedMessage').textContent='Oops! Put the food in the bowl.';window.motorworxFeedback?.('retry','feed');feedHome()}
 });
 feedFood.addEventListener('pointercancel',()=>{feedDragging=false;feedFood.classList.remove('dragging');feedHome()});
 feedFood.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!feedDone){e.preventDefault();feedSuccess()}});
 $('startFeed').addEventListener('click',()=>{feedRound=0;feedRender();show('feedScreen')});
 $('feedBack').addEventListener('click',()=>{feedDragging=false;show('chooseScreen')});
 $('feedNext').addEventListener('click',()=>{if(!feedDone)return;feedRound=(feedRound+1)%feedRounds.length;feedRender()});

 // Game 16: broad finger movements reveal one large sea animal at a time.
 const wipeRounds=[{animal:'🦀',name:'crab',x:30,y:34},{animal:'🐙',name:'octopus',x:69,y:35},{animal:'🐠',name:'fish',x:34,y:68},{animal:'🐢',name:'turtle',x:68,y:67}];
 let wipeRound=0,wipeDone=false,wipeDrawing=false,wipePointer=null;
 const wipeCanvas=$('wipeCanvas'),wipeCtx=wipeCanvas.getContext('2d'),wipeStage=$('wipeStage');
 wipeStage.style.backgroundImage=`url("${motorworxSeaSceneGraphics['ocean-background']}")`;
 let lastWipePoint=null;
 // Only the area occupied by the sea creature needs to be uncovered.
 // Coordinates are expressed in the canvas's 420 × 324 drawing space.
 // An oval provides a generous Level 1 target corresponding to the large emoji.
 const CREATURE_REVEAL_FRACTION=0.998; // 99.8% of the creature area, not the full window
 function creatureClearedFraction(){
  const r=wipeRounds[wipeRound];
  const cx=420*r.x/100,cy=324*r.y/100;
  const rx=62,ry=59; // Fit the large rendered sea creature more closely
  const left=Math.max(0,Math.floor(cx-rx)),top=Math.max(0,Math.floor(cy-ry));
  const right=Math.min(420,Math.ceil(cx+rx)),bottom=Math.min(324,Math.ceil(cy+ry));
  const w=right-left,h=bottom-top;
  const pixels=wipeCtx.getImageData(left,top,w,h).data;
  let revealed=0,total=0;
  for(let y=2;y<h;y+=4){
   for(let x=2;x<w;x+=4){
    const px=left+x,py=top+y;
    if(((px-cx)/rx)**2+((py-cy)/ry)**2>1)continue;
    total++;
    if(pixels[(y*w+x)*4+3]<32)revealed++;
   }
  }
  return total?revealed/total:0;
 }
 // Reuse upgraded sea-creature images where available.
 function wipeReset(){
  wipeDone=false;wipeDrawing=false;wipePointer=null;lastWipePoint=null;
  wipeCanvas.style.pointerEvents='auto';
  const r=wipeRounds[wipeRound];
  const seaAsset=motorworxSeaGraphics[r.name];
  $('wipeAnimal').innerHTML=seaAsset?`<img src="${seaAsset}" alt="" style="width:clamp(115px,32vw,165px);height:clamp(100px,29vw,145px);object-fit:contain;display:block"/>`:r.animal;
  $('wipeAnimal').style.left=r.x+'%';$('wipeAnimal').style.top=r.y+'%';
  $('wipeCounter').textContent=`${wipeRound+1} of ${wipeRounds.length}`;
  wipeStage.classList.remove('finished');
  wipeCtx.globalCompositeOperation='source-over';wipeCtx.clearRect(0,0,420,324);
  const mist=wipeCtx.createLinearGradient(0,0,420,324);
  mist.addColorStop(0,'#d9f0f5');mist.addColorStop(.5,'#bedde8');mist.addColorStop(1,'#a9cfdc');
  wipeCtx.fillStyle=mist;wipeCtx.fillRect(0,0,420,324);
  // Soft mist and glass reflections replace the flat striped placeholder.
  wipeCtx.lineCap='round';wipeCtx.strokeStyle='#f2fdff88';wipeCtx.lineWidth=28;
  wipeCtx.beginPath();wipeCtx.moveTo(28,146);wipeCtx.bezierCurveTo(62,50,183,47,250,18);wipeCtx.stroke();
  wipeCtx.strokeStyle='#eaf9fd66';wipeCtx.lineWidth=20;
  wipeCtx.beginPath();wipeCtx.moveTo(195,308);wipeCtx.bezierCurveTo(273,285,345,232,392,165);wipeCtx.stroke();
  wipeCtx.fillStyle='#ffffff77';
  [[46,41,5],[361,69,7],[322,282,5],[75,262,6]].forEach(([x,y,rad])=>{wipeCtx.beginPath();wipeCtx.ellipse(x,y,rad,rad*1.4,0,0,Math.PI*2);wipeCtx.fill()});
  $('wipeMessage').textContent='Rub the window with your finger.';$('wipeNext').hidden=true;
  document.querySelectorAll('#wipeSteps span').forEach((el,i)=>el.classList.toggle('current',i<=wipeRound));
 }
 function wipeCoords(e){const b=wipeCanvas.getBoundingClientRect();return{x:(e.clientX-b.left)*420/b.width,y:(e.clientY-b.top)*324/b.height}}
 function wipeMark(x,y){
  wipeCtx.globalCompositeOperation='destination-out';wipeCtx.beginPath();wipeCtx.arc(x,y,31,0,Math.PI*2);wipeCtx.fill();
 }
 function wipeAt(e){
  if(wipeDone)return; // Do not erase anything after the reveal threshold is reached.
  const pt=wipeCoords(e);if(lastWipePoint){const steps=Math.max(1,Math.ceil(Math.hypot(pt.x-lastWipePoint.x,pt.y-lastWipePoint.y)/13));
   for(let i=1;i<=steps;i++){const a=i/steps;wipeMark(lastWipePoint.x+(pt.x-lastWipePoint.x)*a,lastWipePoint.y+(pt.y-lastWipePoint.y)*a)}
  }else wipeMark(pt.x,pt.y);
  lastWipePoint=pt;
  if(!wipeDone&&creatureClearedFraction()>=CREATURE_REVEAL_FRACTION){
   // Finish after at least 99.8% of the creature area is uncovered.
   wipeDone=true;wipeDrawing=false;lastWipePoint=null;
   if(wipePointer!==null){try{wipeCanvas.releasePointerCapture(wipePointer)}catch(e){}}
   wipePointer=null;wipeCanvas.style.pointerEvents='none';
   wipeCtx.globalCompositeOperation='destination-out';wipeCtx.fillRect(0,0,420,324);
   wipeStage.classList.add('finished'); // Jiggle only; preserve the animal's location.
   $('wipeMessage').textContent='You found your sea friend! Well done!';
   $('wipeNext').textContent=wipeRound===wipeRounds.length-1?'Play again ↻':'Next sea friend →';
   $('wipeNext').hidden=false;
   // Shared success system supplies spoken congratulations, but NO emoji
   // overlay for this specific activity. The animal itself jiggles.
   window.motorworxFeedback?.('success','wipe');
  }
 }
 wipeCanvas.addEventListener('pointerdown',e=>{
  if(wipeDone||(e.button!==undefined&&e.button!==0))return;
  e.preventDefault();wipeDrawing=true;wipePointer=e.pointerId;lastWipePoint=null;
  wipeCanvas.setPointerCapture(e.pointerId);wipeAt(e);
 });
 wipeCanvas.addEventListener('pointermove',e=>{if(!wipeDrawing||wipePointer!==e.pointerId||wipeDone)return;e.preventDefault();wipeAt(e)});
 function wipeStop(){wipeDrawing=false;lastWipePoint=null;wipePointer=null}
 wipeCanvas.addEventListener('pointerup',wipeStop);wipeCanvas.addEventListener('pointercancel',wipeStop);wipeCanvas.addEventListener('lostpointercapture',wipeStop);
 $('startWipe').addEventListener('click',()=>{wipeRound=0;wipeCanvas.style.pointerEvents='auto';wipeReset();show('wipeScreen')});
 $('wipeBack').addEventListener('click',()=>{wipeStop();show('chooseScreen')});
 $('wipeNext').addEventListener('click',()=>{if(!wipeDone)return;wipeRound=(wipeRound+1)%wipeRounds.length;wipeCanvas.style.pointerEvents='auto';wipeReset()});


 // Game 17: one large move onto a short tower; repeated without increasing difficulty.
 const towerRounds=[
  {piece:'#f5c562',name:'yellow',fixed:'#a5d3f3',stackX:74,startX:22,startY:73},
  {piece:'#f5a7ba',name:'pink',fixed:'#a9d9b2',stackX:32,startX:77,startY:73},
  {piece:'#98d9d1',name:'green',fixed:'#e6b4ec',stackX:64,startX:19,startY:69},
  {piece:'#bcaaf1',name:'purple',fixed:'#f3c68a',stackX:37,startX:79,startY:67}
 ];
 let towerRound=0,towerDone=false,towerPointer=null,towerDragging=false;
 const towerStage=$('towerStage'),towerPiece=$('towerPiece');
 function towerPlace(x,y){const r=towerStage.getBoundingClientRect();towerPiece.style.left=Math.max(55,Math.min(r.width-55,x-r.left))+'px';towerPiece.style.top=Math.max(35,Math.min(r.height-35,y-r.top))+'px'}
 function towerHome(){const r=towerStage.getBoundingClientRect(),d=towerRounds[towerRound];towerPlace(r.left+r.width*d.startX/100,r.top+r.height*d.startY/100)}
 function towerRender(){const d=towerRounds[towerRound];towerDone=false;towerDragging=false;towerPointer=null;
  $('towerCounter').textContent=`${towerRound+1} of ${towerRounds.length}`;
  towerPiece.style.background=d.piece;$('towerFixed').style.background=d.fixed;
  towerStage.querySelector('.tower-stack').style.left=d.stackX+'%';
  $('towerInstruction').textContent=`Put the ${d.name} block on top.`;
  towerPiece.setAttribute('aria-label',`Drag the ${d.name} block onto the tower`);
  $('towerTarget').classList.remove('filled');$('towerTarget').style.background='#d5c9ee55';$('towerTarget').style.borderStyle='dashed';
  towerPiece.hidden=false;towerPiece.classList.remove('wiggle','dragging');towerHome();
  $('towerMessage').textContent=`Move the ${d.name} block to the dotted space.`;$('towerNext').hidden=true;
  [...$('towerSteps').children].forEach((el,i)=>el.classList.toggle('current',i<=towerRound));
 }
 function towerDrop(x,y){const r=$('towerTarget').getBoundingClientRect();return x>=r.left-24&&x<=r.right+24&&y>=r.top-25&&y<=r.bottom+25}
 function towerSuccess(){if(towerDone)return;towerDone=true;towerDragging=false;
  towerPiece.hidden=true;$('towerTarget').style.background=towerRounds[towerRound].piece;$('towerTarget').style.borderStyle='solid';$('towerTarget').classList.add('filled');
  $('towerMessage').textContent='Well done!';$('towerNext').textContent=towerRound===towerRounds.length-1?'Play again ↻':'Next block →';$('towerNext').hidden=false;
  window.motorworxFeedback?.('success','tower');
 }
 towerPiece.addEventListener('pointerdown',e=>{if(towerDone||towerDragging||(e.button!==undefined&&e.button!==0))return;e.preventDefault();towerDragging=true;towerPointer=e.pointerId;towerPiece.classList.add('dragging');towerPiece.setPointerCapture(e.pointerId)});
 towerPiece.addEventListener('pointermove',e=>{if(!towerDragging||towerPointer!==e.pointerId)return;e.preventDefault();towerPlace(e.clientX,e.clientY)});
 towerPiece.addEventListener('pointerup',e=>{if(!towerDragging||towerPointer!==e.pointerId)return;e.preventDefault();towerDragging=false;towerPiece.classList.remove('dragging');if(towerDrop(e.clientX,e.clientY))towerSuccess();else{towerPiece.classList.remove('wiggle');void towerPiece.offsetWidth;towerPiece.classList.add('wiggle');$('towerMessage').textContent=`Oops! Put the ${towerRounds[towerRound].name} block on top.`;window.motorworxFeedback?.('retry','tower');towerHome()}});
 towerPiece.addEventListener('pointercancel',()=>{towerDragging=false;towerPiece.classList.remove('dragging');towerHome()});
 towerPiece.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!towerDone){e.preventDefault();towerSuccess()}});
 $('startTower').addEventListener('click',()=>{towerRound=0;towerRender();show('towerScreen')});
 $('towerBack').addEventListener('click',()=>{towerDragging=false;show('chooseScreen')});
 $('towerNext').addEventListener('click',()=>{if(!towerDone)return;towerRound=(towerRound+1)%towerRounds.length;towerRender()});

 // Game 18: one easy drag into a large space, varied spatial arrangements.
 const parkRounds=[
  {name:'red',car:'🚗',x:73,y:29,fromX:23,fromY:74},
  {name:'blue',car:'🚙',x:27,y:72,fromX:76,fromY:29},
  {name:'yellow',car:'🚕',x:73,y:72,fromX:23,fromY:28},
  {name:'green',car:'🚜',x:28,y:27,fromX:76,fromY:73}
 ];
 let parkRound=0,parkDone=false,parkDragging=false,parkPointer=null;
 const parkStage=$('parkStage'),parkCar=$('parkCar'),parkGarage=$('parkGarage');
 function parkPlace(x,y){const r=parkStage.getBoundingClientRect();parkCar.style.left=Math.max(48,Math.min(r.width-48,x-r.left))+'px';parkCar.style.top=Math.max(44,Math.min(r.height-44,y-r.top))+'px'}
 function parkHome(){const r=parkStage.getBoundingClientRect(),d=parkRounds[parkRound];parkPlace(r.left+r.width*d.fromX/100,r.top+r.height*d.fromY/100)}
 function parkRender(){const d=parkRounds[parkRound];parkDone=false;parkDragging=false;parkPointer=null;
  $('parkCounter').textContent=`${parkRound+1} of ${parkRounds.length}`;
  $('parkInstruction').textContent=`Park the ${d.name} ${d.car==='🚜'?'tractor':'car'}!`;
  parkCar.textContent=d.car;parkCar.setAttribute('aria-label',`Park the ${d.name} vehicle`);
  parkGarage.style.left=d.x+'%';parkGarage.style.top=d.y+'%';
  parkCar.classList.remove('parked','dragging','wiggle');parkCar.hidden=false;
  $('parkNext').hidden=true;$('parkMessage').textContent=$('parkInstruction').textContent;
  [...$('parkSteps').children].forEach((el,i)=>el.classList.toggle('active',i<=parkRound));
  requestAnimationFrame(parkHome);
 }
 function parkHit(x,y){const r=parkGarage.getBoundingClientRect();return x>=r.left-12&&x<=r.right+12&&y>=r.top-12&&y<=r.bottom+12}
 function parkSuccess(){if(parkDone)return;parkDone=true;parkDragging=false;parkCar.classList.remove('dragging');
  const target=parkGarage.getBoundingClientRect(),stage=parkStage.getBoundingClientRect();parkPlace(target.left+target.width/2,target.top+target.height/2);
  parkCar.classList.add('parked');
  $('parkNext').textContent=parkRound===parkRounds.length-1?'Play again ↻':'Next parking spot →';$('parkNext').hidden=false;
  window.motorworxFeedback?.('success','park');
 }
 parkCar.addEventListener('pointerdown',e=>{if(parkDone||parkDragging||(e.button!==undefined&&e.button!==0))return;e.preventDefault();parkDragging=true;parkPointer=e.pointerId;parkCar.classList.add('dragging');parkCar.setPointerCapture(e.pointerId)});
 parkCar.addEventListener('pointermove',e=>{if(!parkDragging||parkPointer!==e.pointerId)return;e.preventDefault();parkPlace(e.clientX,e.clientY)});
 parkCar.addEventListener('pointerup',e=>{if(!parkDragging||parkPointer!==e.pointerId)return;e.preventDefault();parkDragging=false;parkCar.classList.remove('dragging');if(parkHit(e.clientX,e.clientY))parkSuccess();else{parkCar.classList.remove('wiggle');void parkCar.offsetWidth;parkCar.classList.add('wiggle');parkHome();window.motorworxFeedback?.('retry','park')}});
 parkCar.addEventListener('pointercancel',()=>{parkDragging=false;parkCar.classList.remove('dragging');parkHome()});
 parkCar.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!parkDone){e.preventDefault();parkSuccess()}});
 $('startPark').addEventListener('click',()=>{parkRound=0;parkRender();show('parkScreen')});
 $('parkBack').addEventListener('click',()=>{parkDragging=false;show('chooseScreen')});
 $('parkNext').addEventListener('click',()=>{if(!parkDone)return;parkRound=(parkRound+1)%parkRounds.length;parkRender()});

 // Game 19: recognise BIG or SMALL — one obvious visual difference at a time.
 const sizeRounds=[
  {animal:'elephant',emoji:'elephant'},
  {animal:'giraffe',emoji:'giraffe'},
  {animal:'lion',emoji:'lion'},
  {animal:'monkey',emoji:'monkey'}
 ];
 // Re-randomise the requested size and the side holding the big picture every
 // time a round starts, including when the child chooses Play again.
 let sizeRound=0,sizeDone=false,sizeCurrent=null;
 const sizeChoices=[$('sizeChoice0'),$('sizeChoice1')];
 function sizeRender(){
  const animal=sizeRounds[sizeRound];
  sizeCurrent={...animal,ask:Math.random()<0.5?'big':'small',bigSide:Math.random()<0.5?0:1};
  const r=sizeCurrent;sizeDone=false;
  $('sizeCounter').textContent=`${sizeRound+1} of ${sizeRounds.length}`;
  $('sizeInstruction').textContent=`Tap the ${r.ask} ${r.animal}!`;
  $('sizeMessage').textContent=$('sizeInstruction').textContent;
  $('sizeNext').hidden=true;
  [...$('sizeSteps').children].forEach((step,i)=>step.classList.toggle('active',i<=sizeRound));
  sizeChoices.forEach((button,i)=>{
   button.disabled=false;button.classList.remove('correct','incorrect');
   const big=i===r.bigSide;
   button.querySelector('.size-art').innerHTML=`<img src="${motorworxSafariGraphics[r.animal]}" alt="" draggable="false">`;
   button.querySelector('.size-art').style.fontSize=big?'clamp(100px,27vw,153px)':'clamp(52px,13vw,76px)';
   button.setAttribute('aria-label',`${big?'Big':'Small'} ${r.animal}`);
  });
 }
 sizeChoices.forEach((button,i)=>button.addEventListener('click',()=>{
  if(sizeDone)return;
  const r=sizeCurrent,correct=r.ask==='big'?r.bigSide:1-r.bigSide;
  if(i!==correct){button.classList.remove('incorrect');void button.offsetWidth;button.classList.add('incorrect');window.motorworxFeedback?.('retry','size');return;}
  sizeDone=true;button.classList.add('correct');sizeChoices.forEach(b=>b.disabled=true);
  $('sizeNext').textContent=sizeRound===sizeRounds.length-1?'Play again ↻':'Next picture →';$('sizeNext').hidden=false;
  window.motorworxFeedback?.('success','size');
 }));
 $('startSize').addEventListener('click',()=>{sizeRound=0;sizeRender();show('sizeScreen')});
 $('sizeBack').addEventListener('click',()=>show('chooseScreen'));
 $('sizeNext').addEventListener('click',()=>{if(!sizeDone)return;sizeRound=(sizeRound+1)%sizeRounds.length;sizeRender()});

 // Game 20: follow one large butterfly with the eyes, then touch it.
 const butterflyRounds=[
  {from:[23,34],to:[73,34],duration:6.2,flowers:['🌼','🌷']},
  {from:[73,45],to:[28,45],duration:6.5,flowers:['🌻','🌼']},
  {from:[37,27],to:[37,63],duration:6.8,flowers:['🌷','🌻']},
  {from:[68,62],to:[68,28],duration:6.8,flowers:['🌸','🌼']}
 ];
 let butterflyRound=0,butterflyFound=false;
 const butterflyTarget=$('butterflyTarget'),butterflyField=$('butterflyField');
 function butterflyRender(){
  butterflyFound=false;
  const r=butterflyRounds[butterflyRound];
  $('butterflyCounter').textContent=`${butterflyRound+1} of ${butterflyRounds.length}`;
  $('butterflyInstruction').textContent='Tap the butterfly!';
  $('butterflyMessage').textContent='Tap the butterfly!';
  $('butterflyNext').hidden=true;
  [...$('butterflySteps').children].forEach((el,i)=>el.classList.toggle('current',i<=butterflyRound));
  butterflyTarget.classList.remove('found');butterflyTarget.disabled=false;
  butterflyTarget.style.removeProperty('left');butterflyTarget.style.removeProperty('top');
  butterflyTarget.style.setProperty('--butterfly-from-x',r.from[0]+'%');
  butterflyTarget.style.setProperty('--butterfly-from-y',r.from[1]+'%');
  butterflyTarget.style.setProperty('--butterfly-to-x',r.to[0]+'%');
  butterflyTarget.style.setProperty('--butterfly-to-y',r.to[1]+'%');
  butterflyTarget.style.animationDuration=r.duration+'s';
  butterflyTarget.style.animationDelay='0s';
  butterflyField.querySelectorAll('.butterfly-flower').forEach((el,i)=>el.textContent=r.flowers[i]);
 }
 butterflyTarget.addEventListener('click',e=>{
  e.stopPropagation();if(butterflyFound)return;
  butterflyFound=true;
  // Freeze at the actual on-screen position before the happy wing jiggle.
  const fieldRect=butterflyField.getBoundingClientRect(),targetRect=butterflyTarget.getBoundingClientRect();
  const x=targetRect.left+targetRect.width/2-fieldRect.left,y=targetRect.top+targetRect.height/2-fieldRect.top;
  butterflyTarget.style.left=x+'px';butterflyTarget.style.top=y+'px';
  butterflyTarget.classList.add('found');butterflyTarget.disabled=true;
  $('butterflyNext').textContent=butterflyRound===butterflyRounds.length-1?'Play again ↻':'Next butterfly →';
  $('butterflyNext').hidden=false;
  window.motorworxFeedback?.('success','butterfly');
 });
 butterflyField.addEventListener('click',e=>{if(butterflyFound||e.target.closest('#butterflyTarget'))return;window.motorworxFeedback?.('retry','butterfly')});
 $('startButterfly').addEventListener('click',()=>{butterflyRound=0;butterflyRender();show('butterflyScreen')});
 $('butterflyBack').addEventListener('click',()=>show('chooseScreen'));
 $('butterflyNext').addEventListener('click',()=>{if(!butterflyFound)return;butterflyRound=(butterflyRound+1)%butterflyRounds.length;butterflyRender()});

})();
