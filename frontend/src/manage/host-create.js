import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './host-create.html';

export default {
	open: function(server, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let host = eno.get(this);
				if (host) {
					host.name = host.name.trim();
					if (manage.existsName(host.name)) {
						alert.warning("名称已存在");
						return false;
					}
					host.names = namesSplit(host.names);
					host.access = host.access ? host.access.trim() : null;
					host.authentications = [];
					host.servlets = [];
					server.hosts.push(host);
				}
				if (callback) callback(host);
				eno.remove(element);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		// 默认值
		const n = (server.hosts.length + 1);
		eno.set(element, "form", {
			name: "Host" + n,
			access: "access/host" + n
		});
		element.showModal();
	}
}

// 拆分域名并移除收尾空格
function namesSplit(text) {
	if (text) {
		let texts = text.split(",");
		for (let i = 0; i < texts.length; i++) {
			texts[i] = texts[i].trim();
		}
		return texts;
	} else {
		return [];
	}
}