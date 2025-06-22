import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './user-create.html';

export default {
	open: function(callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let user = eno.get(this);
				user.name = user.name.trim();
				if (manage.existsUser(user.name)) {
					alert.warning("用户名已存在");
					return false;
				}
				if (user.password != user.confirm) {
					alert.warning("两次输入的密码应相同");
					return false;
				}
				if (user.uris) {
					user.uris = user.uris.split(",");
					return false;
				}
				user.enable = true;
				if (user) {
					manage.userPut(user,
						function() {
							alert.success("用户账户已创建");
							eno.remove(element);
							if (callback) callback(user);
						},
						function(error) {
							alert.error(error);
						}
					);
				}
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);
		eno.sets(element, "#paths", manage.paths(),
			function(tag, entity) {
				tag.innerText = entity;
			}
		);
		element.showModal();
	}
}