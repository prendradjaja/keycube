// TODO attribution for this code??

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
//  ( "Webkit/blink browsers need prefix, Safari won't work without window.")

var masterGain = audioContext.createGain();
    masterGain.gain.value = 0.5;
masterGain.connect(audioContext.destination);

var nodeGain1 = audioContext.createGain();
    nodeGain1.gain.value = 0.2;
nodeGain1.connect(masterGain);

function clickBuzz( frequency, length) {
    var oscillatorNode = new OscillatorNode(audioContext, {type: 'square'});
    oscillatorNode.frequency.value = frequency;
    oscillatorNode.connect( nodeGain1);
    oscillatorNode.start();
    //setTimeout( function(){oscillatorNode.stop();}, length*1000);
    oscillatorNode.stop( audioContext.currentTime + length);
}
