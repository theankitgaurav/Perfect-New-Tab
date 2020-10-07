document.addEventListener("DOMContentLoaded", function () {

  chrome.storage.sync.get(["headbgcolor"], function (result) {
    if (Object.keys(result).length) {
        document.getElementById("panel1").style.backgroundColor = result.headbgcolor;
        document.getElementById("panel2").style.backgroundColor = result.headbgcolor;
        document.getElementById("panel3").style.backgroundColor = result.headbgcolor;
    }
  });

  chrome.storage.sync.get(["bodybgcolor"], function (result) {
    if (Object.keys(result).length) {
        document.getElementById("main").style.backgroundColor = result.bodybgcolor;
    }
  });

  chrome.storage.sync.get(["footerbgcolor"], function (result) {
    if (Object.keys(result).length) {
        document.getElementById("footer").style.backgroundColor = result.footerbgcolor;
    }
  });

  chrome.storage.sync.get(["font"], function (result) {
    if (Object.keys(result).length) {
        document.getElementById("main").style.fontFamily = result.font;
    }
  });

});

chrome.storage.onChanged.addListener(updateCustomization);

function updateCustomization(changes, area) {

    let changedItems = Object.keys(changes);

    for (let item of changedItems) {
      if (item === 'headbgcolor') {
        document.getElementById("panel1").style.backgroundColor = changes[item].newValue;
        document.getElementById("panel2").style.backgroundColor = changes[item].newValue;
        document.getElementById("panel3").style.backgroundColor = changes[item].newValue;
      }
      if (item === 'bodybgcolor') {
        document.getElementById("main").style.backgroundColor = changes[item].newValue;
      }
      if (item === 'footerbgcolor') {
        document.getElementById("footer").style.backgroundColor = changes[item].newValue;
      }
      if (item === 'font') {
        document.getElementById("main").style.fontFamily = changes[item].newValue;
      }
    }
}
