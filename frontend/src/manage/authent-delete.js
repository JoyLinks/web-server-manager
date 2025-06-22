import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './authent-delete.html';

export default {
	open: function(server, host, authent, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				if (host) {
					let index = host.authentications.indexOf(authent);
					if (index >= 0) {
						host.authentications.splice(index, 1);
					} else {
						return false;
					}
				} else {
					let index = server.authentications.indexOf(authent);
					if (index >= 0) {
						server.authentications.splice(index, 1);
					} else {
						return false;
					}
				}
				if (callback) callback(authent);
				alert.success("身份验证已删除");
				eno.remove(element);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		eno.set(element, "form", authent);
		element.showModal();
	}
}