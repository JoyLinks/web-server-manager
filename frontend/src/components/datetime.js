import eno from "@joyzl/eno";

// 导出接口
export default {
	show() {
		eno.show(element);
		refresh();
	},
	hide() {
		eno.hide(element);
	},
	date,
	time,
	datetime
}

const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// <date-time></date-time>
const element1 = eno.replace("date-time", "<span></span>");
// <date></date>
const element2 = eno.replace("date", "<span></span>");
// <time></time>
const element3 = eno.replace("time", "<span></span>");
// <week></week>
const element4 = eno.replace("week", "<span></span>");

if (element1 || element2 || element3 || element4) {
	if (element1) {
		element1.innerText = datetime();
	}
	if (element2) {
		element2.innerText = date();
	}
	if (element3) {
		element3.innerText = time();
	}
	if (element4) {
		element4.innerText = week();
	}
	setInterval(function() {
		if (element1) {
			element1.innerText = datetime();
		}
		if (element2) {
			element2.innerText = date();
		}
		if (element3) {
			element3.innerText = time();
		}
		if (element4) {
			element4.innerText = week();
		}
	}, 1000);
}

function week(d) {
	if (d) {} else {
		d = new Date();
	}
	return weeks[d.getDay()];
}
/**
 * 2024-6-24
 */
function date(d) {
	if (d) {} else {
		d = new Date();
	}
	const year = d.getFullYear();
	const month = (d.getMonth() + 1 /*月份从0开始，需要加1*/ ).toString().padStart(2, '0');
	const day = (d.getDate()).toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * 10:28:12
 */
function time(d) {
	if (d) {} else {
		d = new Date();
	}
	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();
	return `${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`;
}
/**
 * 2024-6-24 10:28:12
 */
function datetime(d) {
	if (d) {} else {
		d = new Date();
	}
	const year = d.getFullYear();
	const month = d.getMonth() + 1 /*月份从0开始，需要加1*/ ;
	const day = d.getDate();
	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();
	return `${year}-${month}-${day} ${hours<10?'0'+hours:hours}:${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`;
}