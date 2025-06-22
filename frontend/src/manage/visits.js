import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import logs from './logs';
import html from './visits.html';

let element;
export default {
	show: function() {
		if (element) {} else {
			element = eno.append("main", html);
			eno.bind(element, "#servers", "click",
				function(event) {
					const target = eno.target(event, "case", null);
					if (target) {
						let server, host;
						if ("host" == target) {
							host = eno.entity(event);
							server = eno.entity(this.parentElement);
						} else {
							host = null;
							server = eno.entity(event);
						}
						if (host) {
							if (!host.logs) {
								alert.info("此虚拟主机未记录访问日志");
								return;
							}
						} else
						if (server) {
							if (!server.logs) {
								alert.info("此主服务未记录访问日志");
								return;
							}
						}
						logs.open(server, host,
							function() {
								eno.toggle(element);
							}
						);
					}
				}
			);
		}
		eno.toggle(element);
		refresh();
	}
}

function refresh() {
	manage.visitsGet(
		function(servers) {
			// 计算日均
			const now = new Date();
			for (const server of servers) {
				server.date = new Date(server.timestamp);
				server.days = Math.ceil((now - server.date) / (1000 * 60 * 60 * 24));
				server.date = server.date.toLocaleString();
				server.daily = server.visits / server.days;
				for (const host of server.hosts) {
					host.daily = host.visits / server.days;
				}
			}
			eno.sets(element, "#servers", servers,
				function(element, entity, name) {
					if ("hosts" == name) {
						eno.sets(element, entity.hosts, logeIcon);
						return null;
					}
					return logeIcon(element, entity, name);
				}
			);
		},
		alert.error);
}

function logeIcon(element, entity, name) {
	if ("sevr" == name || "host" == name) {
		if (entity.logs) {
			element.classList.add("hover");
			element.setAttribute("fill", "currentColor");
		} else {
			element.classList.remove("hover");
			element.setAttribute("fill", "#3c3f47");
		}
		return null;
	}
}