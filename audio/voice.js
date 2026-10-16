
/* Motorworx shared audio component, independent of game mechanics. Uses device voices;
   no downloads, microphones, external services or children's data are required. */
(()=>{
 'use strict';
 const activities={
  chooseScreen:()=>{const name=childName();return name?`Ready to play, ${name}? Choose a game!`:'Choose a game! Tap one of the pictures to start playing.'},
  gameScreen:'Trace the path to the carrot. Touch the bunny and follow the dots.',
  matchScreen:'Find the matching picture. Tap the picture that is the same.',
  peekScreen:()=>document.getElementById('peekInstruction').textContent+' Tap the picture where you see it.',
  memoryScreen:()=>document.getElementById('memoryChoices').hidden?'Look at the picture. Remember what you see. Tap I’m ready when you are ready.':'Which picture did you see? Tap the one you remember.',
  spatialScreen:()=>document.getElementById('spatialInstruction').textContent+' Drag the fish with your finger.',
  finishScreen:'Drag the missing piece into place. Choose the piece that fits.',
  patternScreen:'What comes next? Drag the next picture into the empty space.',
  diffScreen:'Which picture is different? Tap the picture that is not the same.',
  starScreen:()=>document.getElementById('starInstruction').textContent==='Where did the star land?'?'Where did the star land? Tap the place where it stopped.':'Tap the star to start. Watch where it lands.',
  shadowScreen:'Look at the shadow. Tap the sea friend that matches the shadow.',
  disappearScreen:()=>document.getElementById('disappearPick').hidden?'Look at both pictures. Remember what you see. Tap I’m ready when you are ready.':'Which picture went away? Tap the missing picture.',
  bubbleScreen:'Tap the big bubble! Find it and pop it with your finger.',
  turnScreen:()=>document.getElementById('turnScreen').querySelector('.instruction').textContent+' '+document.getElementById('turnScreen').querySelector('.hint').textContent,
  whichScreen:()=>document.getElementById('whichInstruction').textContent,
  feedScreen:()=>document.getElementById('feedInstruction').textContent+' Drag the food into the bowl.',
  wipeScreen:'Find the sea creature by wiping the window.',
  towerScreen:()=>document.getElementById('towerInstruction').textContent+' Drag it into the dotted space.',
  parkScreen:()=>document.getElementById('parkInstruction').textContent+' Drag it into the parking space.',
  sizeScreen:()=>document.getElementById('sizeInstruction').textContent,
  butterflyScreen:'Tap the butterfly!'
 };
 // The name stays only in memory and is never sent or stored.
 let childFirstName='';let personalisedPraiseCount=0;
 function childName(){return childFirstName}
 const nameField=document.getElementById('childName');
 nameField.addEventListener('input',()=>{childFirstName=nameField.value.replace(/[^\p{L}\p{M} '\-]/gu,'').replace(/\s+/g,' ').trim().slice(0,24)});
 document.getElementById('play').addEventListener('click',()=>{
  childFirstName=nameField.value.replace(/[^\p{L}\p{M} '\-]/gu,'').replace(/\s+/g,' ').trim().slice(0,24);
  const intro=document.querySelector('.choose-intro');
  intro.textContent=childFirstName?`Ready to play, ${childFirstName}? Choose any of the 20 activities.`:'Choose any of the 20 activities. Play at your own pace!';
 });
 const synth=window.speechSynthesis;
 const supported=!!(synth&&window.SpeechSynthesisUtterance);
 let soundOn=true;
 try{soundOn=localStorage.getItem('motorworx-voice-enabled')!=='false'}catch(e){}
 const bars=[];
 // Move to the next puzzle automatically after encouragement. The existing Next
 // handlers remain the single source of truth for advancing each game.
 const autoNextByScreen={
  gameScreen:'next',matchScreen:'matchNext',peekScreen:'peekNext',
  memoryScreen:'memoryNext',spatialScreen:'spatialNext',
  finishScreen:'finishNext',patternScreen:'patternNext',
  diffScreen:'diffNext',starScreen:'starNext',shadowScreen:'shadowNext',
  disappearScreen:'disappearNext',turnScreen:'turnNext',whichScreen:'whichNext',feedScreen:'feedNext',wipeScreen:'wipeNext',towerScreen:'towerNext',parkScreen:'parkNext',sizeScreen:'sizeNext',butterflyScreen:'butterflyNext'
 };
 let autoTimer=null,autoToken=0;
 function cancelAutoNext(){
  autoToken++;
  if(autoTimer!==null){clearTimeout(autoTimer);autoTimer=null;}
  document.querySelectorAll('.auto-progressing').forEach(el=>el.classList.remove('auto-progressing'));
 }
 function scheduleAutoNext(registerPraiseDone){
  const screenId=current(),buttonId=autoNextByScreen[screenId];
  if(!buttonId)return; // Pop the Bubble already handles automatic progression.
  const token=++autoToken;
  if(autoTimer!==null)clearTimeout(autoTimer);
  // Success feedback happens before the round's Next button is revealed.
  // A microtask waits for the current answer handler to finish updating it.
  queueMicrotask(()=>{
   if(token!==autoToken||current()!==screenId)return;
   const screen=document.getElementById(screenId),button=document.getElementById(buttonId);
   if(!button||button.hidden||/play again/i.test(button.textContent))return;
   screen.classList.add('auto-progressing');
   let praiseFinished=false,minimumFinished=false,advanced=false;
   function maybeAdvance(){
    if(advanced||!praiseFinished||!minimumFinished||token!==autoToken||current()!==screenId)return;
    advanced=true;screen.classList.remove('auto-progressing');
    button.click(); // next round begins after the full spoken praise
   }
   // Wiping uses a short jiggle; all games wait for spoken praise before progressing.
   autoTimer=setTimeout(()=>{autoTimer=null;minimumFinished=true;maybeAdvance()},screenId==='wipeScreen'?650:2400);
   registerPraiseDone(()=>{praiseFinished=true;maybeAdvance()});
  });
 }
 Object.values(autoNextByScreen).forEach(id=>document.getElementById(id)?.setAttribute('data-auto-next',''));
 let activeId='';
 let lastRetryAt=0;
 // Child-friendly messages should always match what the child is doing.
 // Short, general praise only. Vary the phrase without naming the game task.
 const praise={
  trace:['Well done!','Great job!','Excellent work!','Awesome!','Fantastic!'],
  match:['Great job!','Excellent work!','Awesome!','Well done!','Fantastic!'],
  peek:['Excellent work!','Awesome!','Well done!','Fantastic!','Great job!'],
  memory:['Awesome!','Well done!','Fantastic!','Great job!','Excellent work!'],
  spatial:['Fantastic!','Great job!','Well done!','Excellent work!','Awesome!'],
  finish:['Well done!','Awesome!','Excellent work!','Fantastic!','Great job!'],
  pattern:['Great job!','Fantastic!','Awesome!','Well done!','Excellent work!'],
  diff:['Awesome!','Well done!','Great job!','Excellent work!','Fantastic!'],
  star:['Well done!','Great job!','Awesome!','Excellent work!','Fantastic!'],
  shadow:['Great job!','Fantastic!','Well done!','Awesome!','Excellent work!'],
  disappear:['Well done!','Great job!','Fantastic!','Awesome!','Excellent work!'],
  bubble:['Awesome!','Well done!','Fantastic!','Great job!','Excellent work!'],
  turn:['Well done!','Great job!','Fantastic!','Excellent work!','Awesome!'],
  which:['Awesome!','Well done!','Great job!','Fantastic!','Excellent work!'],
  feed:['Well done!','Great job!','Fantastic!','Awesome!','Excellent work!'],
  park:['Well done!','Great job!','Fantastic!','Awesome!','Excellent work!'],
  tower:['Well done!','Great job!','Excellent work!','Awesome!','Fantastic!'],
  wipe:['Great job!','Well done!','Fantastic!','Awesome!','Excellent work!'],
  size:['Well done!','Fantastic!','Great job!','Awesome!','Excellent work!'],
  butterfly:['Great job!','Well done!','Fantastic!','Awesome!','Excellent work!']
 };
 const encouragement={
  butterfly:['Oops! Tap the butterfly. Try again!','Look for the moving butterfly. Try again!'],
  size:['Oops! Look for the other size. Try again!','Look again! Which picture is the right size?','Almost! Have another look. Try again!'],
  feed:['Oops! Put the food in the bowl.','Whoops! Try moving the food into the bowl.','Almost! Drag the food to the bowl.','Let’s put the food in the bowl.'],
  which:['Oops! Look for the picture in the right place.','Have another look! Is it at the top or bottom?','Whoops! Try the other picture.','Let’s look again. Find the picture in the right place.'],
  'trace-path':[
   'Oops! Stay on the dotted path. Try again!',
   'Oh dear! Let’s follow the dots together.',
   'Whoops! Try keeping your finger on the path.',
   'Almost! Follow the little dots again.'
  ],
  'trace-speed':[
   'Whoops! Let’s move a little slower.',
   'Oh dear! Follow the dots one by one.',
   'Nearly there! Take your time.',
   'Oops! Slow down and try that path again.'
  ],
  match:[
   'Oops! Not that picture. Try again!',
   'Oh dear! Look for the one that is the same.',
   'Whoopsie! Try the other picture.',
   'Have another look! Which picture matches?'
  ],
  peek:[
   'Oh dear! Look for the friend hiding behind something.',
   'Oops! Can you spot the one peeking out?',
   'Whoops! Try looking at the other picture.',
   'Keep looking! Where is our hiding friend?'
  ],
  memory:[
   'Whoops! Let’s remember the picture we saw.',
   'Oh dear! Think back to the picture.',
   'Oops! Have another think. What did you see?',
   'Let’s try remembering again!'
  ],
  spatial:[
   'Oops! Try moving the fish into the dotted circle.',
   'Oh dear! Let’s find the right place for the fish.',
   'Whoops! Move the fish a little closer to the circle.',
   'Almost! Look for the dotted circle and try again.'
  ],
  finish:[
   'Oh dear! That piece doesn’t fit. Try the other one!',
   'Whoops! Let’s find the piece that fits.',
   'Oops! Try another piece for the missing part.',
   'Nearly! Look for the shape that belongs there.'
  ],
  pattern:[
   'Oops! Look at the pattern again!',
   'Oh dear! Which picture comes next?',
   'Whoops! Look at the pictures in order.',
   'Have another go! What comes after this picture?'
  ],
  star:[
   'Oh dear! Look at the two places again.',
   'Whoops! Which planet did the star land on?',
   'Oops! Try the other landing place.',
   'Have another look! Where did the star stop?'
  ],
  shadow:[
   'Oops! Look for the matching sea friend.',
   'Whoops! Which one has the same shape?',
   'Have another look at the shadow.',
   'Try the sea friend shaped like the shadow.'
  ],
  disappear:[
   'Oops! Which picture went away?',
   'Oh dear! Think back to the two pictures.',
   'Whoops! Look for the missing toy.',
   'Have another think. What disappeared?'
  ],
  turn:[
   'Oops, stay on the path!',
   'Whoops! Keep following the dots.',
   'Almost! Stay on the dotted trail.',
   'Oops! Follow the dots with your finger.'
  ],
  diff:[
   'Oops! Tap the picture that is different.',
   'Oh dear! Which one is not the same?',
   'Whoops! Look for the one that is different.',
   'Have another look! Which picture is different?'
  ]
 };
 // One child-facing message for both speech and on-screen feedback.
 const feedbackMessages={trace:'message',match:'matchMessage',peek:'peekMessage',memory:'memoryMessage',
  spatial:'spatialMessage',finish:'finishMessage',pattern:'patternMessage',diff:'diffMessage',
  star:'starMessage',shadow:'shadowMessage',disappear:'disappearMessage',bubble:'bubbleMessage',
  turn:'turnMessage',which:'whichMessage',feed:'feedMessage',wipe:'wipeMessage',tower:'towerMessage',park:'parkMessage',size:'sizeMessage',butterfly:'butterflyMessage'};
 function showFeedback(activity,phrase){
  const el=document.getElementById(feedbackMessages[activity]);
  if(!el||!phrase)return;
  // Some game handlers set text after calling feedback; override once they finish.
  queueMicrotask(()=>{if(!el.closest('.screen')?.hidden)el.textContent=phrase});
 }
 const indices={};
 function nextPhrase(group,key){const options=group[key]||[];if(!options.length)return '';
  const id=(group===praise?'praise:':'retry:')+key;
  const n=indices[id]||0;indices[id]=n+1;return options[n%options.length];}
 function stop(){if(supported){try{synth.cancel()}catch(e){}}}
 function current(){return Object.keys(activities).find(id=>!document.getElementById(id).hidden)||''}
 function instruction(id){const val=activities[id];return typeof val==='function'?val():val}
 function setControls(){
  bars.forEach(({button,status})=>{
   button.classList.toggle('voice-muted',!soundOn);
   button.setAttribute('aria-pressed',String(soundOn));
   button.setAttribute('aria-label',soundOn?'Turn spoken instructions off':'Turn spoken instructions on');
   button.innerHTML=soundOn?'<span class="voice-icon" aria-hidden="true">🔊</span><span>Sound on</span>':'<span class="voice-icon" aria-hidden="true">🔇</span><span>Sound off</span>';
   status.textContent=!supported?'Voice not available on this device':soundOn?'':'Voice muted';
  });
 }
 function chooseVoice(){
  const voices=synth.getVoices();
  return voices.find(v=>/^en-ZA$/i.test(v.lang)&&/female|woman|zira|samantha|karen|moira|tessa/i.test(v.name))
    ||voices.find(v=>/^en-GB$/i.test(v.lang)&&/female|woman|samantha|karen|moira|serena/i.test(v.name))
    ||voices.find(v=>/^en-ZA$/i.test(v.lang))
    ||voices.find(v=>/^en-GB$/i.test(v.lang))
    ||voices.find(v=>/^en/i.test(v.lang)&&/female|woman|samantha|karen|zira/i.test(v.name))
    ||voices.find(v=>/^en/i.test(v.lang));
 }
 function say(phrase,onFinished){
  stop();
  if(!supported||!soundOn||!phrase){onFinished?.();return;}
  try{
   const utterance=new SpeechSynthesisUtterance(phrase);
   utterance.lang='en-GB';
   utterance.rate=0.88; utterance.pitch=1.06; utterance.volume=1;
   utterance.onend=()=>onFinished?.();
   utterance.onerror=()=>onFinished?.();
   const voice=chooseVoice();if(voice){utterance.voice=voice;utterance.lang=voice.lang}
   synth.speak(utterance);
  }catch(e){onFinished?.();/* Browser voice may require user interaction. */}
 }
 function speak(id){
  if(!id||document.getElementById(id).hidden)return;
  const onFinished=(id==='starScreen'&&window.motorworxStarNeedsIntro?.())
   ?()=>window.motorworxStarIntroDone?.():undefined;
  say(instruction(id),onFinished);
 }
 window.motorworxSpeakCurrent=()=>speak(current());
 // Feedback shared by every activity, without changing its game rules.
 // Gentle retries are rate-limited and only triggered by real attempts.
 // Brief non-interactive celebration for every completed puzzle.
 const celebrationIcons=['★','★','★','★'];
 let celebrationIndex=0,celebrationTimer=null;
 function celebrate(){
  document.querySelector('.mw-celebration')?.remove();
  if(celebrationTimer!==null)clearTimeout(celebrationTimer);
  const layer=document.createElement('div');layer.className='mw-celebration';layer.setAttribute('aria-hidden','true');
  const main=document.createElement('span');main.className='mw-celebration-core';
  main.textContent=celebrationIcons[celebrationIndex++%celebrationIcons.length];
  layer.appendChild(main);
  // One large star in the middle with smaller stars around it.
  [['✦','42%','43%','#ffd96a'],['★','58%','43%','#ffe79a'],['✦','42%','57%','#ffe79a'],['★','58%','57%','#ffd96a']].forEach(([symbol,left,top,color])=>{
   const spark=document.createElement('span');spark.className='mw-confetti';spark.textContent=symbol;
   spark.style.setProperty('--left',left);spark.style.setProperty('--top',top);spark.style.setProperty('--color',color);
   layer.appendChild(spark);
  });
  document.querySelector('.game').appendChild(layer);
  celebrationTimer=setTimeout(()=>{layer.remove();celebrationTimer=null},1600);
 }
 window.motorworxFeedback=function(type,activity){
  if(type==='success'){
   if(activity!=='wipe')celebrate();
   let phrase=nextPhrase(praise,activity)||'Well done!';
   personalisedPraiseCount++;
   if(childFirstName&&personalisedPraiseCount%3===1)phrase=phrase.replace(/[.!]+$/, '')+', '+childFirstName+'!';
   showFeedback(activity,phrase);
   let voiceDone=false,notifyVoiceDone=null;
   scheduleAutoNext(done=>{notifyVoiceDone=done;if(voiceDone)done()});
   let fallback=null;
   const finished=()=>{if(voiceDone)return;voiceDone=true;if(fallback!==null)clearTimeout(fallback);notifyVoiceDone?.()};
   if(!soundOn||!supported){finished();return;}
   fallback=setTimeout(finished,8000);
   say(phrase,finished);
   return;
  }
  if(type==='retry'){
   let phrase='Oops! Try again!';
   if(activity==='turn'){
    // The tracing game already knows the correct animal and resume point.
    phrase=document.getElementById('turnMessage')?.textContent||'Oops, stay on the path!';
   }else if(activity==='park'){
    phrase=`Oops! ${document.getElementById('parkInstruction')?.textContent||'Park the car!'} Try again!`;
   }else if(activity==='tower'){
    const round=document.getElementById('towerInstruction')?.textContent||'';
    const color=(round.match(/\b(yellow|pink|green|purple)\b/i)||[])[0];
    phrase=color?`Oops! Put the ${color} block on top. Try again!`:'Oops! Put the block on top. Try again!';
   }else{
    phrase=nextPhrase(encouragement,activity)||'Oops! Try again!';
   }
   showFeedback(activity,phrase);
   if(!soundOn||!supported)return;
   const now=Date.now();
   // Prevent repeated speech from continuous stray finger movement, but
   // do not suppress the next deliberate try as the old 1.6-second gate did.
   if(now-lastRetryAt<450)return;
   lastRetryAt=now;
   say(phrase);
  }
 };
 Object.keys(activities).forEach(id=>{
  const screen=document.getElementById(id);
  const bar=document.createElement('div');bar.className='voice-bar';bar.setAttribute('role','group');bar.setAttribute('aria-label','Spoken instructions');
  bar.innerHTML='<span class="voice-status" aria-live="polite"></span><button type="button" class="voice-replay"><span class="voice-icon" aria-hidden="true">🔁</span><span>Hear again</span></button><button type="button" class="voice-toggle"></button>';
  const steps=screen.querySelector('.steps');
  const anchor=id==='chooseScreen'?(screen.querySelector('.choose-intro')||screen.querySelector('h1')):(steps||screen.querySelector('header')||screen.querySelector('.instruction'));
  if(!anchor){screen.prepend(bar)}else{anchor.insertAdjacentElement('afterend',bar)}
  const replay=bar.querySelector('.voice-replay');
  const button=bar.querySelector('.voice-toggle');
  replay.disabled=!supported;
  replay.setAttribute('aria-label','Hear the instruction again');
  replay.addEventListener('click',()=>speak(id));
  button.addEventListener('click',()=>{
   soundOn=!soundOn;
   try{localStorage.setItem('motorworx-voice-enabled',String(soundOn))}catch(e){}
   stop();setControls();
   if(soundOn)speak(id);else if(id==='starScreen')window.motorworxStarIntroDone?.();
  });
  bars.push({button,status:bar.querySelector('.voice-status')});
 });
 setControls();
 window.motorworxSpeakInstruction = speak;
 // Existing game handlers execute first; these additional handlers only read the
 // active screen and speak. They do not alter game navigation or touch behaviour.
 const startIds=['startTrace','startMatch','startPeek','startMemory','startSpatial','startFinish','startPattern','startDiff','startStar','startShadow','startDisappear','startBubble','startTurn','startWhich','startFeed','startWipe','startTower','startPark','startSize','startButterfly'];
 const nextIds=['next','matchNext','peekNext','memoryNext','spatialNext','finishNext','patternNext','diffNext','starNext','shadowNext','disappearNext','bubbleNext','turnNext','whichNext','feedNext','wipeNext','towerNext','parkNext','sizeNext','butterflyNext'];
 [...startIds,...nextIds,'reset','spatialReset','memoryReady','starReplay','disappearReady','turnReset'].forEach(id=>{
  const button=document.getElementById(id);
  button.addEventListener('click',()=>{cancelAutoNext();const screen=current();if(screen)speak(screen)});
 });
 ['chooseBack','backHome','matchBack','peekBack','memoryBack','spatialBack','finishBack','patternBack','diffBack','starBack','shadowBack','disappearBack','bubbleBack','turnBack','whichBack','feedBack','wipeBack','towerBack','parkBack','sizeBack','butterflyBack','play'].forEach(id=>{
  document.getElementById(id).addEventListener('click',()=>{cancelAutoNext();stop()});
 });
 // The home Play button and Back to Game Menu actions are deliberate taps,
 // so they can also unlock mobile speech synthesis for the chooser prompt.
 ['play','backHome','matchBack','peekBack','memoryBack','spatialBack','finishBack','patternBack','diffBack','starBack','shadowBack','disappearBack','bubbleBack','turnBack','whichBack','feedBack','wipeBack','towerBack','parkBack','sizeBack','butterflyBack'].forEach(id=>{
  document.getElementById(id).addEventListener('click',()=>speak('chooseScreen'));
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAutoNext();stop()}});
 window.addEventListener('pagehide',()=>{cancelAutoNext();stop()});
})();
