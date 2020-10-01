let head1 = document.getElementById("panel1");
let head2 = document.getElementById("panel2");
let head3 = document.getElementById("panel3");
let head4 = document.getElementById("panel4");
let body = document.getElementById("main");
let footer_new = document.getElementById("footer");

let headbgcolor = document.getElementById("headbgcolor");
let bodybgcolor = document.getElementById("bodybgcolor");
let footerbgcolor = document.getElementById("footerbgcolor");
let font = document.getElementById("font");

if (!localStorage.getItem("headbgcolor")) {
  populateStorage();
} else {
  setStyles();
}

function populateStorage() {
  localStorage.setItem(
    "headbgcolor",
    document.getElementById("headbgcolor").value
  );
  localStorage.setItem(
    "bodybgcolor",
    document.getElementById("bodybgcolor").value
  );
  localStorage.setItem(
    "footerbgcolor",
    document.getElementById("footerbgcolor").value
  );
  localStorage.setItem("font", document.getElementById("font").value);
  setStyles();
}

function setStyles() {
  var currentHeadBgColor = localStorage.getItem("headbgcolor");
  var currentBodybgcolor = localStorage.getItem("bodybgcolor");
  var currentFooterbgcolor = localStorage.getItem("footerbgcolor");
  var currentFont = localStorage.getItem("font");

  document.getElementById("headbgcolor").value = currentHeadBgColor;
  document.getElementById("bodybgcolor").value = currentBodybgcolor;
  document.getElementById("footerbgcolor").value = currentFooterbgcolor;
  document.getElementById("font").value = currentFont;

  head1.style.backgroundColor = currentHeadBgColor;
  head2.style.backgroundColor = currentHeadBgColor;
  head3.style.backgroundColor = currentHeadBgColor;
  head4.style.backgroundColor = currentHeadBgColor;
  body.style.backgroundColor = currentBodybgcolor;
  footer_new.style.backgroundColor = currentFooterbgcolor;
  body.style.fontFamily = currentFont;
}

headbgcolor.onchange = populateStorage;
bodybgcolor.onchange = populateStorage;
footerbgcolor.onchange = populateStorage;
font.onchange = populateStorage;
