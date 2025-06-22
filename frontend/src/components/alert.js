export default {
	info: function(text) {
		if (popoverInfo) {} else {
			popoverInfo = create("info", text);
		}
		show(popoverInfo, text);
	},
	warning: function(text) {
		if (popoverWarning) {} else {
			popoverWarning = create("warning", text);
		}
		show(popoverWarning, text);
	},
	success: function(text) {
		if (popoverSuccess) {} else {
			popoverSuccess = create("success", text);
		}
		show(popoverSuccess, text);
	},
	danger: function(text) {
		if (popoverDanger) {} else {
			popoverDanger = create("danger", text);
		}
		show(popoverDanger, text);
	},
	error: function(text) {
		if (popoverError) {} else {
			popoverError = create("danger", text);
		}
		show(popoverError, text);
	},
	wait: function(text) {
		if (popoverWait) {} else {
			popoverWait = create("wait", text);
		}
		show(popoverWait, text);
	}
}

let popoverInfo, popoverWarning, popoverSuccess, popoverDanger, popoverError, popoverWait;
let T;

function show(popover, text) {
	if (T) {
		clearTimeout(T);
	}
	if (text) {
		const span = popover.querySelector("span");
		span.innerText = text;
		T = setTimeout(function() {
			popover.hidePopover();
			T = 0;
		}, 6000);
		popover.showPopover();
	}
}

// <div popover="auto">
//     <svg>...</svg>
//     <span>text</span>
// </div>
function create(type, text) {
	const div = document.createElement("div");
	div.className = "shadow";
	div.popover = "auto";
	if (type === "info") {
		div.innerHTML = SVG_INFO;
		div.style = STYLE_INFO;
		div.name = "info";
	} else
	if (type === "warning") {
		div.innerHTML = SVG_WARNING;
		div.style = STYLE_WARNING;
		div.name = "warning";
	} else
	if (type === "success") {
		div.innerHTML = SVG_SUCCESS;
		div.style = STYLE_SUCCESS;
		div.name = "success";
	} else
	if (type === "danger") {
		div.innerHTML = SVG_DANGER;
		div.style = STYLE_DANGER;
		div.name = "danger";
	} else
	if (type === "wait") {
		div.innerHTML = SVG_WAIT;
		div.style = STYLE_WAIT;
		div.name = "wait";
	}
	const span = document.createElement("span");
	span.innerText = text;
	div.appendChild(span);

	document.body.appendChild(div);
	return div;
}
/*
DIV模式已改为popover,注意flex将导致auto行为失效
const STYLE = `
position:absolute;
z-index:999999;
padding:1rem;
border-radius:5px;
top:50%;left:50%;
transform:translate(-50%,-50%);
display:flex;justify-content:center;align-items:center;
max-width:62%;
`;
*/

const DIV_STYLE = `
border:none;
padding:1rem;
border-radius:5px;
max-width:62%;
`;
const STYLE_INFO = DIV_STYLE + `
background-color:#0D6EFD;
color:#FFF;
fill:#FFF;
`;
const STYLE_WARNING = DIV_STYLE + `
background-color:#FFC107;
color:#000;
fill:#000;
`;
const STYLE_SUCCESS = DIV_STYLE + `
background-color:#198754;
color:#FFF;
fill:#FFF;
`;
const STYLE_DANGER = DIV_STYLE + `
background-color:#DC3545;
color:#FFF;
fill:#FFF;
`;
const STYLE_WAIT = DIV_STYLE + `
background-color:#000;
color:#FFF;
fill:#FFF;
`;

const SVG_INFO = `<svg width="32" height="18" viewBox="0 0 16 16" style="vertical-align:middle"><use xlink:href="#a-info"/></svg>`;
const SVG_WARNING = `<svg width="32" height="18" viewBox="0 0 16 16" style="vertical-align:middle"><use xlink:href="#a-warning"/></svg>`;
const SVG_SUCCESS = `<svg width="32" height="18" viewBox="0 0 16 16" style="vertical-align:middle"><use xlink:href="#a-success"/></svg>`;
const SVG_DANGER = `<svg width="32" height="18" viewBox="0 0 16 16" style="vertical-align:middle"><use xlink:href="#a-danger"/></svg>`;
const SVG_WAIT = `<svg width="32" height="18" viewBox="0 0 16 16" style="vertical-align:middle"><use xlink:href="#a-wait"/></svg>`;

const SVG_ICONS = `
<svg width="0" height="0" viewBox="0 0 16 16">
<g id="a-info">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</g>
<g id="a-warning">
<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
</g>
<g id="a-success">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
</g>
<g id="a-danger">
<path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</g>
<g id="a-wait">
<path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
</g>
</svg>
`;

document.body.insertAdjacentHTML('beforeend', SVG_ICONS);