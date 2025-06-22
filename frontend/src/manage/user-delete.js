import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './user-delete.html';

export default {
	open: function(user, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				manage.userDelete(user,
					function() {
						alert.success("用户账户已删除");
						eno.remove(element);
						if (callback) callback(user);
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
		eno.set(element, "form", user);
		element.showModal();
	}
}