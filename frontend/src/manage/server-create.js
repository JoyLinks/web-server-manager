import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './server-create.html';

export default {
	open: function(callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let server = eno.get(this);
				if (server) {
					server.name = server.name.trim();
					if (manage.existsName(server.name)) {
						alert.warning("名称已存在");
						return false;
					}
					server.ip = server.ip ? server.ip.trim() : null;
					server.access = server.access ? server.access.trim() : null;
					server.authentications = [];
					server.servlets = [];
					server.hosts = [];
					manage.servers().push(server);
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
		const n = manage.servers().length + 1;
		eno.set(element, "form", {
			name: "Server" + n,
			type: "HTTP",
			port: 79 + n,
			access: "access/server" + n
		});
		element.showModal();
	}
}