import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './authent-modify.html';

export default {
	open: function(server, host, authent, name, callback) {
		const element = eno.append("main", html);
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();
				let fresh = eno.get(this);
				if (fresh) {
					// authent.type = fresh.type;
					authent.path = fresh.path.trim();
					authent.realm = fresh.realm.trim();
					authent.methods = methodsSplit(fresh.methods);
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
		eno.set(element, "form", authent, authentConvert);
		eno.sets(element, "#paths", manage.paths(),
			function(tag, entity) {
				tag.innerText = entity;
			}
		);
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

function authentConvert(element, entity, name) {
	if ("type" == name) {
		switch (entity.type.toUpperCase()) {
			case "BASIC":
				return "Basic(基本身份认证)";
			case "DIGEST":
				return "Digest(摘要访问认证)";
			case "DENY":
				return "Deny(禁止)";
			case "NONE":
				return "None(无认证)";
			default:
				return entity.type;
		}
	}
}