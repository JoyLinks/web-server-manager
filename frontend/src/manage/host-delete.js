import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './host-delete.html';

export default {
	open: function(server, host, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let index = server.hosts.indexOf(host);
				if (index >= 0) {
					server.hosts.splice(index, 1);
					if (callback) callback(host);
					alert.success("虚拟主机已删除");
				} else {
					return false;
				}
				eno.remove(element);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		eno.set(element, "form", host);
		element.showModal();
	}
}