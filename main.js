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
  main_3(global_playlist);
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
        console.log('await track_load(...);  // index is ' + index),  await track_load(track);
      else if(track.loaded  &&  glob_curr === index  &&  !track.playing)
        console.log('await track_play(...);  // index is ' + index),  await track_play(track);
      else if(track.loaded  &&  glob_curr !== index  &&  track.playing)
        console.log('await track_stop(...);  // index is ' + index),  await track_stop(track);
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

const track_play = async(track) => {
  track.loaded = false;
  track.audio.currentTime = 0;
  track.audio.volume = MAX;
  console.log('about to try to call play on Audio object!');
  await new Promise(async(resolve, reject) => {
    const audio = track.audio;
    const on_error = (e) => {
      audio.removeEventListener('error', on_error);
      reject(e);
    };
    audio.addEventListener('error', on_error);
    try {
      console.log('calling play() on Audio object');
      await audio.play();
      console.log('called play() on Audio object');
      audio.removeEventListener('error', on_error);
      resolve();
    } catch(e) {
      audio.removeEventListener('error', on_error);
      reject(e);
    }
  });
  console.log('got past calling play on Audio object!');
  track.playing = true;
  track.loaded = true;

  // Technically finished with track_play() at this point, but this is a convenient place to continue on to do other stuff :

  document.getElementById('div').innerHTML = '';
  setup_timers_and_whatnot(glob_curr);  // Intentionally not using "await" on this line of code.
};

const track_stop = async function(track) {
  track.audio.pause();
  track.playing = false;
}

const track_load = (track) => new Promise((resolve, reject) => {
  var do_start_loading = function() {
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

  if(curr === -1  ||  curr === prev  ||  curr >= playlist.length)
    return;

  // Stop track that's currently playing, if necessary.
  if(prev !== -1)
    stop_song();

  glob_curr = curr;

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

setInterval(function() {
  console.log('...');
}, 3000)

main_1();


})();
