try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }

//var noteTextarea = $('#note-textarea');
var notesList = $('ul#notes');
var noteContent = '';
var arr = [];
var overAllNotes = '';
var wordArray;
var notesList = $('ul#notes');


var dt = new Date();
var dateTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();



//This must match the channel you set up in your function

$('#stop-record-btn').hide();
    
/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 

recognition.continuous = true;
//console.log(recognition.continuous)
// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

   // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;
  
  overAllNotes += transcript;

  //noteTextarea.val(overAllNotes);
  console.log('in here');
  console.log('T: '+ transcript);
  wordFrequency(overAllNotes);

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
   // noteContent += transcript;
    //noteTextarea.val(noteContent);
  }
  recognition.continuous = true;

};

recognition.onstart = function() { 
  console.log("starting");
  // instructions.text('Voice recognition activated. Try speaking into the microphone.');
}
recognition.onend = function() {
  console.log('on end');
}
recognition.onspeechend = function() {
  console.log('You were quiet for a while so voice recognition turned itself off.');
 // $('#stop-record-btn').hide();
  //$('#start-record-btn').show();
  recognition.start();

}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
      recognition.start();
  };
}


if ($('#saved-items').length > 0) {
    console.log('true');
    var notes = getAllNotes();
    renderNotes(notes);

} else {
    console.log('false');
}
/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  console.log('start');

  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
  $('#start-record-btn').hide();
  $('#stop-record-btn').show();

});

$('#stop-record-btn').on('click', function(e) {
    recognition.stop();
    $('#stop-record-btn').hide();
    $('#start-record-btn').show();
    saveNote(dateTime, wordArray);
    if(!noteContent.length) {
    }
    else {
        overAllNotes = '';
    }
        
  })

  // function that sees if the text contains the string olivia... 
function contains(target, pattern){
    var value = 0;
    pattern.forEach(function(word){
      value = value + target.includes(word);
    });
    return (value === 1)
}

function wordFrequency(content) {

    /* Below is a regular expression that finds alphanumeric characters
       Next is a string that could easily be replaced with a reference to a form control
       Lastly, we have an array that will hold any words matching our pattern */
    var pattern = /\w+/g,
        string = content,
        matchedWords = string.match( pattern );
  
    /* The Array.prototype.reduce method assists us in producing a single value from an
       array. In this case, we're going to use it to output an object with results. */
    var counts = matchedWords.reduce(function ( stats, word ) {
        // remove these words from the list....
    var wordList = `a
    about
    above
    after
    all
    also
    and
    as
    at
    be
    because
    but
    by
    can
    come
    could
    day
    do
    even
    find
    first
    for
    from
    get
    give
    go
    have
    he
    her
    here
    him
    his
    how
    I
    if
    in
    into
    it
    its
    just
    know
    let
    like
    look
    make
    man
    many
    me
    more
    my
    new
    no
    not
    now
    of
    on
    one
    only
    or
    other
    our
    out
    people
    say
    see
    she
    so
    some
    something
    somewhere
    take
    tell
    than
    that
    the
    their
    them
    then
    there
    these
    they
    thing
    think
    this
    those
    time
    to
    two
    up
    use
    very
    want
    way
    we
    well
    what
    when
    which
    who
    will
    with
    would
    year
    you
    your
    `;
    
    /* `stats` is the object that we'll be building up over time.
        `word` is each individual entry in the `matchedWords` array */
    if ( stats.hasOwnProperty( word ) ) {
        var includes = wordList.includes(word);

        if (!includes) {
            stats[ word ] = stats[ word ] + 1;
        }
        /* `stats` already has an entry for the current `word`.
            As a result, let's increment the count for that `word`. */
        
    } else {
        var includes = wordList.includes(word);
        /* `stats` does not yet have an entry for the current `word`.
            As a result, let's add a new entry, and set count to 1. */
            if (includes) {

            } else {
            stats[ word ] = 1;
        }
    }

    // $("#items").append("<p>"+word+"</p>");


    /* Because we are building up `stats` over numerous iterations,
        we need to return it for the next pass to modify it. */
        console.log("stats", stats);

        wordArray = Object.keys(stats);

        $("#items").empty();

        wordArray.forEach((word) => {
            $("#items").append("<p class='item'>"+word+"</p>");
        });

    return stats;
        
    }, {} );

}

function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
  }


function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
  
      if(key.substring(0,5) == 'note-') {
        notes.push({
          date: key.replace('note-',''),
          content: localStorage.getItem(localStorage.key(i))
        });
      } 
    }
    return notes;
  }


function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime); 
  }


function renderNotes(notes) {
    var html = '';
    if(notes.length) {
      notes.forEach(function(note) {
        html+= `<li class="note">
          <p class="header">
            <span class="date">${note.date}</span>
            <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
            <a href="#" class="delete-note" title="Delete">Delete</a>
          </p>
          <p class="content">${note.content}</p>
        </li>`;    
      });
    }
    else {
      html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
  }