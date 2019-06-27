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

  recognition.start();
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
