if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        /**.then((reg) => console.log("service worker registered", reg))
        .catch((err) => console.log("service worker nor registered", err));**/
}


// Listen for before install event
let deferredPrompt; // Allows to show the install prompt
const installButton = document.getElementById("install_button");
const fbShareButton = document.getElementById("know-more");

window.addEventListener("beforeinstallprompt", e => {
  //console.log("beforeinstallprompt fired");
  // Prevent Chrome 76 and earlier from automatically showing a prompt
   e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Show the install button
  installButton.style.display = 'inline-block'
  installButton.addEventListener("click", installApp);
});

// Function that shows install prompt
function installApp() {
    // Show the prompt
    deferredPrompt.prompt();
    installButton.disabled = true;

    // wait for the user to respond to the prompt
    deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
            //console.log("PWA setup accepted");          
        } else {
            console.log("PWA setup rejected");
        }
        installButton.disabled = false;
        deferredPrompt = null;
    });
}

// Check if App was successfully installed
window.addEventListener("appinstalled", evt => {
    //console.log("appinstalled fired", evt); 
    installButton.style.display = 'none';       
    fbShareButton.style.display = 'inline-block';
  });

