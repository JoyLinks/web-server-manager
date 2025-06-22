import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import create from './roster-create';
import modify from './roster-modify';
import remove from './roster-delete';
import html from './roster.html';

let element, deny = true;
export default {
	show: function() {
		if (element) {} else {
			element = eno.append("main", html);
			eno.bind(element, "#create", "click",
				function(event) {
					create.open(deny, refresh);
				}
			);
			eno.bind(element, "nav", "click",
				function(event) {
					const menu = eno.target(event, "target");
					if (menu) {
						eno.toggle(menu, "selected", "hover");
						eno.toggle(element, menu.getAttribute("target"));
						deny = "#blacks" == menu.getAttribute("target");
					}
				}
			);
			eno.bind(element, "#blacks", "click",
				function(event) {
					const black = eno.entity(event);
					if (black) {
						const cesa = eno.target(event, "case");
						if (cesa) {
							if ("delete" == cesa.getAttribute("case")) {
								remove.open(black, refresh);
								return;
							}
						} else {
							modify.open(black, refresh);
						}
					}
				}
			);
			eno.bind(element, "#whites", "click",
				function(event) {
					const white = eno.entity(event);
					if (white) {
						const cesa = eno.target(event, "case");
						if (cesa) {
							if ("delete" == cesa.getAttribute("case")) {
								remove.open(white, refresh);
								return;
							}
						} else {
							modify.open(white, refresh);
						}
					}
				}
			);
			// 默认选中
			eno.select(element, "nav div:first-child").click();
		}
		eno.toggle(element);
		refresh();
	}
}

function refresh() {
	manage.rosterGet(
		function(roster) {
			let blacks = new Array();
			let whites = new Array();
			for (let i = 0; i < roster.length; i++) {
				if (roster[i].deny) {
					blacks.push(roster[i]);
				} else {
					whites.push(roster[i]);
				}
			}

			eno.sets(element, "#blacks", blacks);
			eno.sets(element, "#whites", whites);
			eno.set(element, ".title", {
				size: roster.length
			});
			eno.set(element, "nav", {
				blacks: blacks.length,
				whites: whites.length
			});

		}, alert.error
	);
}