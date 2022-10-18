const outputDiv = document.getElementById("output");
const runButton = document.getElementById("runBtn");
const demoSelector = document.getElementById("demoSelector");

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

console.log = console.error = function(msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  p.classList = " output";
  outputDiv.appendChild(p);
};

const clearOutput = function() {
  outputDiv.innerHTML = "";
};

const editor = new CodeFlask("#editor", {
  language: 'js',
  lineNumbers: true,
  defaultTheme: false
});

clearOutput();

const demoKeys = Object.keys(demos);
function loadDemo(name) {
  editor.updateCode(demos[name]);
}

demoKeys.forEach((demo, index) => {
  const option = document.createElement("option");
  if (index === 0) {
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
  }

  option.textContent = demo.capitalize();
  option.value = demo;
  demoSelector.appendChild(option);
});

let queryCode = getQueryVariable("code");
if (queryCode !== undefined) {
  editor.updateCode(decodeURI(queryCode));
  demoSelector.value = "custom";
} else {
  loadDemo(demoKeys[0]);
}

const runCode = function() {
  const egua = new Egua.Egua();

  let code = editor.getCode();

  egua.runBlock(code);
};

demoSelector.addEventListener("change", function() {
  loadDemo(demoSelector.value);
});

runButton.addEventListener("click", function() {
  clearOutput();
  runCode();
});
