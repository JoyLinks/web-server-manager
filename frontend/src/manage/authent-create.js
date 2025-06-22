import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './authent-create.html';

export default {
	open: function(server, host, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let authent = eno.get(this);
				if (authent) {
					authent.path = authent.path.trim();
					authent.realm = authent.realm.trim();
					authent.methods = methodsSplit(authent.methods);
					if (host) {
						host.authentications.push(authent);
					} else {
						server.authentications.push(authent);
					}
				}
				if (callback) callback(authent);
				eno.remove(element);
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

// 拆分方法名并移除首尾空格
function methodsSplit(text) {
	if (text) {
		let texts = text.split(",");
		for (let i = 0; i < texts.length; i++) {
			texts[i] = texts[i].trim().toUpperCase();
		}
		return texts;
	} else {
		return [];
	}
}