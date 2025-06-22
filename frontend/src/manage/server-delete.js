import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './server-delete.html';

export default {
	open: function(server, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let index = manage.servers().indexOf(server);
				if (index >= 0) {
					manage.servers().splice(index, 1);
					if (callback) callback(server);
					alert.success("主服务已删除");
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
		eno.set(element, "form", server);
		element.showModal();
	}
}