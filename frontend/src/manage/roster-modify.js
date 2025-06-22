import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './roster-modify.html';

export default {
	open: function(roster, callback) {
		const element = eno.append("main", html);
		if (roster.deny) {
			eno.hide(element, "#white");
			eno.show(element, "#black");
		} else {
			eno.hide(element, "#black");
			eno.show(element, "#white");
		}
		eno.bind(element, "form", "submit",
			function(event) {
				let fresh = eno.get(this);
				roster.status = fresh.status;
				roster.text = fresh.text;
				if (fresh.hosts) {
					roster.hosts = fresh.hosts.split(",");
				} else {
					roster.hosts = null;
				}
				manage.rosterPost(roster,
					function() {
						alert.success("地址已修改");
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
		eno.sets(element, "#names", manage.names(),
			function(tag, entity) {
				tag.innerText = entity;
			}
		);
		element.showModal();
	}
}