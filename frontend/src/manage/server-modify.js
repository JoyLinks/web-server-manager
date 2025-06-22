import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './server-modify.html';

export default {
	open: function(server, name, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let fresh = eno.get(this);
				if (fresh) {
					fresh.name = fresh.name.trim();
					if (fresh.name != server.name) {
						if (manage.existsName(fresh.name)) {
							alert.warning("名称已存在");
							return false;
						}
						server.name = fresh.name;
					}

					server.type = fresh.type;
					server.port = fresh.port;
					server.ip = fresh.ip ? fresh.ip.trim() : null;
					server.backlog = fresh.backlog;
					server.access = fresh.access ? fresh.access.trim() : null;
				}
				if (callback) callback(server);
				eno.remove(element);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		eno.set(element, "form", server);
		element.showModal();

		//聚焦指定名称控件
		if (name) {
			const input = eno.select(element, "form #" + name);
			if (input) {
				input.focus();
				if (input.select) input.select();
			}
		}
	}
}