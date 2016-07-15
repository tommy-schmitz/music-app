(function() {


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

var ctx = new AudioContext();

var call_at_time = function(time, cb) {
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

var gain = ctx.createGain();
var tracks = {};

var MAX = 0.1;

window.onload = function() {
  gain.gain.value = 1;
  gain.connect(ctx.destination);

  var filenames = Object.getOwnPropertyNames(gdrive);

  var b = barrier(filenames.length, main_2);
  for(var i=0; i<filenames.length; ++i) {
    var filename = filenames[i];
    var name = filename;
    while(name.charAt(0) !== '_')
      name = name.slice(1);
    name = name.slice(1, -4);
    console.log(name);

    var track = tracks[name] = {}
    track.audio = new Audio(
        'https://drive.google.com/uc?export=download&id=' +
        gdrive[filename]                                    );

    track.audio.volume = MAX;
    track.audio.addEventListener('loadedmetadata', b, false);
  }
};

var main_2 = function() {
  download_string('playlist.txt', main_3);
};

var playlist;

var main_3 = function(playlist_txt) {
  var div = document.getElementById('div');
  div.innerHTML = 'Ready! Click here!';

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

  var listener = function(e) {
    document.removeEventListener('mousedown', listener, false);
    play_song(0);
  };
  document.addEventListener('mousedown', listener, false);
};

var glob_curr = undefined;
var timeout_id = undefined;
var timeout_id2 = undefined;

play_song = function(curr) {
  console.log('play_song, ' + curr);

  if(curr >= playlist.length)
    return;

  var name = playlist[curr];
  var track = tracks[name];

  // Play track
  track.audio.currentTime = 0;
  track.audio.volume = MAX;
  track.audio.play();
  glob_curr = curr;

  var FADE_TIME = 4;

  var handle = undefined;

  // Pick when to stop
  var time_to_stop;
  if(    name === 'good_night'
      || name === 'chocobo_waltz'
      || name === 'tiny_bronco'
      ) {
    time_to_stop = ctx.currentTime + track.audio.duration;
  } else {
    time_to_stop = ctx.currentTime  +  track.audio.duration * (0.5 + Math.random() * 0.3);

    // Quick mode
//    time_to_stop = ctx.currentTime  +  (10 + Math.random() * 5);

    // Schedule the fade-out effect
    timeout_id2 = call_at_time(time_to_stop - FADE_TIME, function() {
      handle = setInterval(function() {
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
  time_to_stop = ctx.currentTime + 5;

  // Schedule the stop and next song
  timeout_id = call_at_time(time_to_stop, function() {
    clearInterval(handle);
    stop_song(function() {
      play_song(curr + 1);
    });
  });
};

stop_song = function(cb) {
  clearTimeout(timeout_id);
  clearTimeout(timeout_id2);
  var track = tracks[playlist[glob_curr]];
  track.audio.pause();

  setTimeout(function() {
    if(cb !== undefined)
      setTimeout(cb, 300);
  }, 300);
};


}());
