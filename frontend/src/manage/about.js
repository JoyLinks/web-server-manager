import eno from "@joyzl/eno";

import html from './about.html';

let element;
export default {
	show: function() {
		if (element) {} else {
			element = eno.append("main", html);
		}
		eno.toggle(element);
	}
}