import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import create from './user-create';
import modify from './user-modify';
import remove from './user-delete';
import html from './users.html';

let element;
export default {
	show: function() {
		if (element) {} else {
			element = eno.append("main", html);
			eno.bind(element, "#create", "click",
				function(event) {
					create.open(refresh);
				}
			);
			eno.bind(element, "#users", "click",
				function(event) {
					const user = eno.entity(event);
					if (user) {
						const cesa = eno.target(event, "case");
						if (cesa) {
							if ("state" == cesa.getAttribute("case")) {
								enable(user);
								return;
							}
							if ("delete" == cesa.getAttribute("case")) {
								remove.open(user, refresh);
								return;
							}
						} else {
							modify.open(user, refresh);
						}
					}
				}
			);
		}
		eno.toggle(element);
		refresh();
	}
}

function refresh() {
	manage.userGet(
		function(users) {
			eno.sets(element, "#users", users,
				function(element, entity, name) {
					if ("state" == name) {
						if (entity.enable) {
							eno.show(element, "#e");
							eno.hide(element, "#d");
						} else {
							eno.show(element, "#d");
							eno.hide(element, "#e");
						}
					}
				}
			);
			eno.set(element, ".title", {
				size: users.length
			});
		}, alert.error
	);
}

function enable(user) {
	user.enable = !user.enable;
	manage.userPost(user,
		function() {
			if (user.enable) {
				alert.success("用户账户已启用");
			} else {
				alert.success("用户账户已禁用");
			}
			refresh();
		}, alert.error
	);
}