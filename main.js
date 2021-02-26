(async function() {


const sleep = (millis) => new Promise((resolve, reject) => setTimeout(resolve, millis));

const onload_promise = new Promise((resolve, reject) => {
  window.onload = function() {
    resolve();
  };
});

var download_string = function(filename, callback) {
  var xhr = new window.XMLHttpRequest();
  xhr.responseType = 'text';
  xhr.onload = function() {
    callback(this.responseText);
  };
  try {
    xhr.open('get', filename, true);
    xhr.send();
  } catch(e) {
    throw 'XHR failed.';
  }
};

/*
audio_list = [];
for(var i=0; i<files.length; ++i) {
  var audio = new Audio(files[i]);
  audio_list.push(audio);
  if(i+1 < files.length) {
    audio.addEventListener('ended', (i => () => {
      audio_list[i+1].play();
    })(i));
  }
}
audio_list[0].play();
*/

/*
var send_xhr = function(filepath, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', filepath, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = () => cb(xhr.response);
  xhr.send();
};

var ctx = new AudioContext();
var buffers = {};

var main = function() {
  var num_outstanding = filenames.length;
  for(var i=0; i<filenames.length; ++i) {
    var filename = filenames[i];
    send_xhr('audios/' + filenames[i], function(response) {
      ctx.decodeAudioData(response, function(buffer) {
        buffers[filename] = buffer;

        num_outstanding--;
        if(num_outstanding === 0)
          main_2();
      }, function(e) {
        console.log('Problem in decodeAudioData: ' + e.err);
      });
    });
  }
};

var main_2 = function() {
  
};

main();
*/

var barrier = function(n, cb) {
  return function() {
    --n;

    if(n < 0)
      console.log('negative barrier');

    if(n === 0)
      cb();
  };
};

var ctx;

var call_at_time = function(time, cb) {
  console.log('scheduled');
  var target_time = time - 0.2;

  var helper = function() {
    if(ctx.currentTime >= target_time) {
      console.log('calling');
      cb();
    } else {
      setTimeout(helper, 1000 * (target_time - ctx.currentTime));
    }
  };

  if(ctx.currentTime >= target_time) {
    return setTimeout(function() {
      console.log('calling');
      cb();
    }, 0);
  } else {
    return setTimeout(helper, 1000 * (target_time - ctx.currentTime));
  }
};

var gain;
var tracks = {};

var MAX = 0.1;
var sel = undefined;

const main_1 = function() {
  sel = document.getElementById('selectbox');

  var filenames = Object.getOwnPropertyNames(gdrive);

  for(var i=0; i<filenames.length; ++i) {
    var filename = filenames[i];
    var name = filename;
    while(name.charAt(0) !== '_')
      name = name.slice(1);
    name = name.slice(1, -4);
    console.log(name);

    var track = tracks[name] = {};
    track.src = 'https://drive.google.com/uc?export=download&id='
                + gdrive[filename];
    track.name = name;
    track.asleep = true;
    track.loaded = false;
    track.playing = false;
  }

  main_2();
};

var main_2 = function() {
  //download_string('playlist.txt', main_3);
  main_3(
`prelude
opening
reactor
bombing
anxious
on_that_day
tifa
good_night
barret
hurry
lurking
reactor
corporation
boss
hurry
flowers
turks
hurry
flowers
slum
flowers
slum
flowers
slum  // short
oppressed
[
  honeybee
  [
    who are you
    honeybee
  ]
  oppressed
]
don
corporation  // out of body
lurking
boss
victory
lurking
anxious
battle
boss
turks
hurry
on_that_day
slum
flowers  // short
aeris
flowers
slum
oppressed
full_scale
corporation
[
    infiltrating
    bombing
  |
    bombing
    bombing
]
infiltrating
slum
infiltrating
hurry
boss
victory
red
infiltrating
corporation
anxious
good_night
blood
corporation
infiltrating
battle
victory
corporation
boss
motorcycle
boss
victory
on_that_day
holding_my_thoughts
overworld
kalm
sephiroth (mellow)
anxious
slum
reactor
on_that_day
sephiroth (fast)
sephiroth
kalm
overworld
chocobo_waltz
farm
chocobo_electric
victory
chocobo_cinco
blood
cave
turks
cave  // short
overworld
[
  fort_condor
  condor_battle
  overworld
]
kalm
boss
kalm
who_are_you
rufus
(a LOT of rufus)
overworld  // short
its_difficult
blood
jenova
victory
blood
overworld  // short
costa_del_sol
[
  corporation  // out of body
  costa_del_sol
]
overworld
holding_my_thoughts
reactor
holding_my_thoughts
corel
ropeway
[
  corporation  // flashback
  ropeway
]
gold_saucer
cait_sith
gold_saucer
anxious
hurry
desert
corel  // flashback
desert  // after flashback
boss
corel
chocobo_fiddle
[
  race_defeat
  chocobo_fiddle
]
race_victory
chocobo_fiddle
overworld
[
  turks
  battle
  victory
  overworld  // beginning
  [anxious]
  overworld
]
cosmo_canyon
// cries of the planet
[cosmo_canyon]
observatory
cosmo_canyon
anxious
cosmo_canyon
blood
boss
victory
seto
cosmo_canyon
overworld
anxious
[
  sephiroth (mellow)
  boss
  sephiroth (mellow)
  vincent
  sephiroth (mellow)
  anxious
]
[
  sephiroth (mellow)
  vincent
  sephiroth
  vincent
  sephiroth (mellow)
  anxious
]
overworld  // brief
slum
// Missing the materia keeper boss battle here!
overworld
oppressed
cid
oppressed
launch
oppressed
boss
tiny_bronco
//missing
turks
hurry
weapon
who_am_i
highwind
meteor
bone_village
[
  chocobo_fiddle
  bone_village
]
fireworks
mako_poisoning
infiltrating
its_difficult
highwind
meteor
[
  corel
]
holding_my_thoughts
reactor
battle
hurry
hurry_faster
corel
good_night
corel  // continued
meteor
fort_condor
hurry
condor_battle
[
  boss
  victory
]
fort_condor
meteor
bone_village
mako_poisoning
weapon
hurry_faster
who_am_i
on_the_other_side
who_am_i
[
  overworld_excerpt
  who_am_i
]
highwind
meteor
[  // zack flashback
  anxious
  sephiroth (mellow)
  vincent
  farm
  vincent
  sephiroth (mellow)
  anxious
  meteor
]
full_scale
hurry
[ // elevator battle
  battle
  victory
  hurry
]
[ // hallway battle
  battle
  victory
  hurry
]
cave
reactor
[ // submarine crew
  battle
  victory
  reactor
]
[ // submarine crew
  battle
  victory
  reactor
]
hurry
boss
hurry_faster
[ // submarine crew
  battle
  victory
  hurry_faster
]
underwater
// submarine minigame
hurry_faster
underwater // very brief
meteor
highwind
[ // gelnika
  underwater
  slum
  turks
  boss
  victory
  slum
  underwater
]
//rocket town
mako_poisoning
hurry_faster
launch
countdown
cid
fort_condor
meteor
cid
// cid's theme ends suddenly
// planet screams
highwind
meteor
cosmo_canyon
holding_my_thoughts
observatory
highwind
meteor //instant
city_of_ancients
[ //go get the key
  meteor //instant
  highwind
  meteor //instant
  underwater
  meteor //instant
  highwind
  meteor //instant
  city_of_ancients
]
flowers
cannon_1
full_scale
city_of_ancients
hurry_faster
boss
cannon_1
weapon
cannon_2
highwind
corporation
cid
bombing
turks
battle
bombing
[ //shinra building
  corporation
  infiltrating
  corporation
  bombing
]
corporation
bombing
blood
jenova
victory
cannon_3
fort_condor
on_that_day
ropeway
highwind
aeris
highwind
judgment_day
[ //path2
  reunion
]
[ //path1
  cave
]
jenova
rebirth
sephiroth (fast)
bizarro
one_winged_angel
sephiroth (mellow)
ending
credits
`
  );
};

var playlist;
var glob_curr = -1;

var main_3 = function(playlist_txt) {
  playlist = playlist_txt.split('\n');

  // "Clean up" of playlist
  for(var i=playlist.length-1; i>=0; --i) {
    var item = playlist[i];
    var ok = false;
    do {
      if(item.length === 0)
        break;

      var c = item.charCodeAt(0);
      if(c < 97 || c > 122)
        break;

      if(tracks[item] === undefined) {
        console.log('"' + item + '" missing');
        break;
      }

      ok = true;
    } while(false);

    if(!ok)
      playlist.splice(i, 1);
  }

  // Populate selectbox
  for(var i=0; i<playlist.length; ++i) {
    var text = document.createTextNode(playlist[i]);
    var option = document.createElement('option');
    option.appendChild(text);
    sel.appendChild(option);
  }
  sel[0].selected = true;

/*
  var div = document.getElementById('div');
  var listener_stop = function(e) {
    document.removeEventListener('mousedown', listener_stop, false);
    stop_song();
    document.addEventListener('mousedown', listener_play, false);
    div.innerHTML = 'Click here to play music!';
  };
  var listener_play = function(e) {
    document.removeEventListener('mousedown', listener_play, false);
    play_song(glob_curr);
    document.addEventListener('mousedown', listener_stop, false);
    div.innerHTML = 'Click to STOP.';
  };

  document.addEventListener('mousedown', listener_play, false);
  div.innerHTML = 'Click here to play music!';
*/

  var play_button = document.getElementById('play_button');
  var stop_button = document.getElementById('stop_button');

  stop_button.addEventListener('click', function() {
    if(glob_curr === -1)
      return;

    stop_song();
  }, false);
  play_button.addEventListener('click', function() {
    if(ctx === undefined) {
      ctx = new AudioContext();
      gain = ctx.createGain();
      gain.gain.value = 1;
      gain.connect(ctx.destination);
    }

    var new_index = sel.selectedIndex;

    play_song(new_index);
  }, false);
};

var timeout_id = undefined;
var timeout_id2 = undefined;
var timeout_id3 = undefined;
var interval_id = undefined;

var poke_track = async function(index) {
  const track = tracks[playlist[index]];

  if(!track.asleep)
    return;

  track.asleep = false;

  let backoff = 125;  // milliseconds
  for(;;) {
    try {
      if(!track.loaded  &&  glob_curr !== -1  &&  (playlist[glob_curr] === track.name  ||  playlist[glob_curr + 1] === track.name))
        await track_load(track);
      else if(track.loaded  &&  glob_curr === index  &&  !track.playing)
        await track_play(track);
      else if(track.loaded  &&  glob_curr !== index  &&  track.playing)
        await track_stop(track);
      else
        break;
    } catch(e) {
      console.log(`Track ${index} (${track.name}) encountered an error. I will attempt to recover from it.`, e);
      await sleep(backoff);
      backoff *= 2;
    }
  }

  track.asleep = true;
};

const track_play = async function(track) {
  track.audio.currentTime = 0;
  track.audio.volume = MAX;
  await track.audio.play();
  track.playing = true;
  document.getElementById('div').innerHTML = '';
  setup_timers_and_whatnot(glob_curr);  // Intentionally not using "await" on this line of code.
};

const track_stop = async function(track) {
  track.audio.pause();
  track.playing = false;
}

const track_load = (track) => new Promise((resolve, reject) => {
  var do_start_loading = function() {
    console.log('do_start_loading();  // index == ' + index);
    track.audio = new Audio();
    track.audio.src = track.src;
    track.audio.addEventListener('loadedmetadata', on_loaded, false);
    track.audio.addEventListener('error', on_error, false);
  };
  var on_loaded = function() {
    console.log('on_loaded called');
    track.loaded = true;
    track.audio.removeEventListener('error', on_error);
    track.audio.removeEventListener('loadedmetadata', on_loaded);
    resolve();
  };
  var on_error = function(e) {
    track.audio.removeEventListener('error', on_error);
    track.audio.removeEventListener('loadedmetadata', on_loaded);
    reject(e);
  };

  do_start_loading();
});

play_song = function(curr) {  // curr is an integer
  console.log('play_song(' + curr + ')');

  const prev = glob_curr;
  glob_curr = curr;

  if(curr === -1  ||  curr === prev  ||  curr >= playlist.length)
    return;

  // Stop track that's currently playing, if necessary.
  if(prev !== -1)
    poke_track(prev);

  sel[curr].selected = true;

  document.getElementById('div').innerHTML = 'Loading ...';

  // Start playing the song.
  poke_track(curr);

  // Start loading the next track, if one exists.
  if(curr + 1 < playlist.length)
    poke_track(curr + 1);
};

var setup_timers_and_whatnot = async function(curr) {
  console.log('setup_timers_and_whatnot(' + curr + ')');

  var name = playlist[curr];
  var track = tracks[name];

  var FADE_TIME = 6;

  // Pick when to stop
  var time_to_stop;
  if(    name === 'good_night'
      || name === 'chocobo_waltz'
      || name === 'tiny_bronco'
      || name === 'ending'
      || name === 'credits'
      ) {
    time_to_stop = ctx.currentTime + track.audio.duration;
  } else {
    time_to_stop = ctx.currentTime  +  track.audio.duration * (0.5 + Math.random() * 0.3);

    // Quick mode
//    time_to_stop = ctx.currentTime  +  (10 + Math.random() * 5);

    // Schedule the fade-out effect
    timeout_id2 = call_at_time(time_to_stop - FADE_TIME, function() {
      interval_id = setInterval(function() {
        var time = ctx.currentTime;
        var vol = (time_to_stop - time) / FADE_TIME;
        if(vol < 0)
          track.audio.volume = 0;
        else if(vol < 1) {
          vol = Math.sin(vol*Math.PI/2) * Math.sin(vol*Math.PI/2);
          vol *= MAX;
          track.audio.volume = vol;
        }
      }, 16);
    });
  }

  // Debug
//  time_to_stop = ctx.currentTime + 5;

  // Schedule the stop and next song
  timeout_id = call_at_time(time_to_stop, function() {
    clearInterval(interval_id);
    stop_song(function() {
      play_song(curr + 1);
    });
  });
};

stop_song = function(cb) {
  document.getElementById('div').innerHTML = '';  // Clear "Loading" message
  clearTimeout(timeout_id);
  clearTimeout(timeout_id2);
  clearTimeout(timeout_id3);
  clearInterval(interval_id);

  // Stop the audio playback.
  const index = glob_curr;
  glob_curr = -1;
  poke_track(index);

//  setTimeout(function() {
//    if(cb !== undefined)
//      setTimeout(cb, 300);
//  }, 300);

  if(cb !== undefined)
    cb();
};

await onload_promise;

main_1();


})();
