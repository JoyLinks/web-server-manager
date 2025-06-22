import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './servlet-create.html';

export default {
	open: function(server, host, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();

				let servlet;
				let parameters = eno.get(this);
				if (parameters) {
					servlet = {
						type: parameters.type,
						path: parameters.path ? parameters.path.trim() : null,
						parameters: parameters
					};

					delete parameters.type;
					delete parameters.path;

					if (host) {
						host.servlets.push(servlet);
					} else {
						server.servlets.push(servlet);
					}
				}

				if (callback) callback(servlet);
				eno.remove(element);
				return false;
			}
		);
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);

		const fieldsets = eno.selects(element, "form fieldset");
		for (let i = 1; i < fieldsets.length; i++) {
			fieldsets[i].disabled = true
			eno.hide(fieldsets[i]);
		}
		eno.bind(element, "form #type", "change",
			function(event) {
				for (const fieldset of fieldsets) {
					if (fieldset.id == this.value) {
						fieldset.disabled = false
						eno.show(fieldset);
					} else {
						fieldset.disabled = true
						eno.hide(fieldset);
					}
				}
			}
		);

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