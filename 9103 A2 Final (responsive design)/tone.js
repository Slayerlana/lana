// refernce week 9

"use strict";
function clickSound() {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");
}