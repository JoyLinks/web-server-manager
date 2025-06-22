import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './servlet-delete.html';

export default {
	open: function(server, host, servlet, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				if (host) {
					let index = host.servlets.indexOf(servlet);
					if (index >= 0) {
						host.servlets.splice(index, 1);
					} else {
						return false;
					}
				} else {
					let index = server.servlets.indexOf(servlet);
					if (index >= 0) {
						server.servlets.splice(index, 1);
					} else {
						return false;
					}
				}
				if (callback) callback(servlet);
				alert.success("服务程序已删除");
				eno.remove(element);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		eno.set(element, "form", servlet);
		element.showModal();
	}
}