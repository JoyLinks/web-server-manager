import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './roster-create.html';

export default {
	open: function(deny, callback) {
		const element = eno.append("main", html);
		if (deny) {
			eno.hide(element, "#white");
			eno.show(element, "#black");
		} else {
			eno.hide(element, "#black");
			eno.show(element, "#white");
		}
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let roster = eno.get(this);
				roster.address = roster.address.trim();
				if (manage.existsAddress(roster.address)) {
					alert.warning("地址已存在");
					return false;
				}
				if (roster.hosts) {
					roster.hosts = roster.hosts.split(",");
				}
				roster.deny = deny;
				manage.rosterPut(roster,
					function() {
						alert.success("地址已创建");
						eno.remove(element);
						if (callback) callback(roster);
					},
					function(error) {
						alert.error(error);
					}
				);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		eno.sets(element, "#names", manage.names(),
			function(tag, entity) {
				tag.innerText = entity;
			}
		);
		element.showModal();
		getLocalIP();
	}
}

let IPS;

function getLocalIP() {
	manage.ipGet(
		function(ips) {
			IPS = ips;
		}
	);
}