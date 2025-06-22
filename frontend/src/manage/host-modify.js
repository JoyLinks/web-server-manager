import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './host-modify.html';

export default {
	open: function(host, name, callback) {
		console.log(host.name);
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let fresh = eno.get(this);
				if (fresh) {
					fresh.name = fresh.name.trim();
					if (fresh.name != host.name) {
						if (manage.existsName(fresh.name)) {
							alert.warning("名称已存在");
							return false;
						}
						host.name = fresh.name;
					}
					host.names = namesSplit(fresh.names);
					host.access = fresh.access ? fresh.access.trim() : null;
				}
				if (callback) callback(host);
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

		//聚焦指定名称控件
		if (name) {
			const input = eno.select(element, "form #" + name);
			if (input) {
				input.focus();
				if (input.select) input.select();
			}
		}
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