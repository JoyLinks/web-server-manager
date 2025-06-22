import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './roster-delete.html';

export default {
	open: function(roster, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				manage.rosterDelete(roster,
					function() {
						alert.success("地址已删除");
						eno.remove(element);
						if (callback) callback(roster);
					},
					function(error) {
						alert.error(error);
					}
				);
				event.preventDefault();
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		eno.set(element, "form", roster);
		if (roster.deny) {
			eno.hide(element, "#white");
			eno.show(element, "#black");
		} else {
			eno.hide(element, "#black");
			eno.show(element, "#white");
		}
		element.showModal();
	}
}