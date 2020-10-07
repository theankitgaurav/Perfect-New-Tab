document.getElementById("save").addEventListener("click", populateStorage);

function populateStorage() {
  chrome.storage.sync.set(
    { headbgcolor: document.getElementById("headbgcolor").value },
    function () {
      console.log(
        "headbgcolor " + document.getElementById("headbgcolor").value
      );
    }
  );
  chrome.storage.sync.set(
    { bodybgcolor: document.getElementById("bodybgcolor").value },
    function () {
      console.log(
        "bodybgcolor " + document.getElementById("bodybgcolor").value
      );
    }
  );
  chrome.storage.sync.set(
    { footerbgcolor: document.getElementById("footerbgcolor").value },
    function () {
      console.log(
        "footerbgcolor " + document.getElementById("footerbgcolor").value
      );
    }
  );
  chrome.storage.sync.set(
    { font: document.getElementById("font").value },
    function () {
      console.log("font " + document.getElementById("font").value);
    }
  );

  chrome.storage.sync.get(["headbgcolor"], function (result) {
    document.getElementById("panel4").style.backgroundColor =
      result.headbgcolor;
    document.getElementById("headbgcolor").value = result.headbgcolor;
  });

  chrome.storage.sync.get(["bodybgcolor"], function (result) {
    document.getElementById("main-option").style.backgroundColor = result.bodybgcolor;
    document.getElementById("bodybgcolor").value = result.bodybgcolor;
  });

  chrome.storage.sync.get(["footerbgcolor"], function (result) {
    document.getElementById("footerbgcolor").value = result.footerbgcolor;
  });

  chrome.storage.sync.get(["font"], function (result) {
    document.getElementById("main-option").style.fontFamily = result.font;
    document.getElementById("font").value = result.font;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get(["headbgcolor"], function (result) {
    if (Object.keys(result).length) {
      document.getElementById("panel4").style.backgroundColor =
        result.headbgcolor;
      document.getElementById("headbgcolor").value = result.headbgcolor;
    }
  });

  chrome.storage.sync.get(["bodybgcolor"], function (result) {
    if (Object.keys(result).length) {
      document.getElementById("main-option").style.backgroundColor =
        result.bodybgcolor;
      document.getElementById("bodybgcolor").value = result.bodybgcolor;
    }
  });

  chrome.storage.sync.get(["footerbgcolor"], function (result) {
    if (Object.keys(result).length) {
      document.getElementById("footerbgcolor").value = result.footerbgcolor;
    }
  });

  chrome.storage.sync.get(["font"], function (result) {
    if (Object.keys(result).length) {
      document.getElementById("main-option").style.fontFamily = result.font;
      document.getElementById("font").value = result.font;
    }
  });
});
