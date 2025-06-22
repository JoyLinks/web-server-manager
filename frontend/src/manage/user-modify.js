import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './user-modify.html';

export default {
	open: function(user, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				let fresh = eno.get(this);
				if (fresh.uris) {
					user.uris = fresh.uris.split(",");
				} else {
					user.uris = null;
				}
				manage.userPost(user,
					function() {
						alert.success("用户已修改");
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
		eno.sets(element, "#paths", manage.paths(),
			function(tag, entity) {
				tag.innerText = entity;
			}
		);
		element.showModal();
	}
}