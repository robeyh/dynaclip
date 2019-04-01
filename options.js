
function loadUp(options){
  console.log(options);
    document.getElementById("devkey").value = options.devkey ? options.devkey : "";
    document.getElementById("sourcedoc").value = options.sourcedoc ? options.sourcedoc : "";
}

chrome.storage.sync.get(['devkey', 'sourcedoc'], loadUp);

document.getElementById("saveOptions").onclick = () => {
  const options = {
    devkey: document.getElementById("devkey").value,
    sourcedoc: document.getElementById("sourcedoc").value
  }
  console.log(options);
  chrome.storage.sync.set(options, function (){
    document.getElementById("message").innerText = "Saved";
  });
};
