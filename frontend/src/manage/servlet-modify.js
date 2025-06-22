import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';

import html from './servlet-modify.html';

export default {
	open: function(server, host, servlet, name, callback) {
		const element = eno.append("main", html);
		// 绑定提交事件
		eno.bind(element, "form", "submit",
			function(event) {
				event.preventDefault();

				let parameters = eno.get(this);
				if (parameters) {
					servlet.path = parameters.path ? parameters.path.trim() : null;
					servlet.parameters = parameters;

					delete parameters.type;
					delete parameters.path;
				}

				if (callback) callback(servlet);
				eno.remove(element);
				return false;
			}
		);
		// 绑定重置事件（实际为取消操作）
		eno.bind(element, "form", "reset",
			function(event) {
				eno.remove(element);
			}
		);

		let fieldset;
		const fieldsets = eno.selects(element, "form fieldset");
		for (let i = 0; i < fieldsets.length; i++) {
			if (servlet.type != fieldsets[i].id) {
				fieldsets[i].disabled = true
				eno.hide(fieldsets[i]);
			} else {
				fieldset = fieldsets[i];
			}
		}
		eno.set(element, "form", servlet,
			function(tag, entity, name) {
				if ("type" == name) {
					return typeText(entity.type);
				}
			}
		);
		if (fieldset) {
			servlet.parameters.path = servlet.path;
			eno.set(fieldset, servlet.parameters);
		}

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

function typeText(type) {
	switch (type) {
		case "RESOURCE":
			return "资源服务(RESOURCE)";
		case "WEBDAV":
			return "文件服务(WEBDAV)";
		case "LOCATION":
			return "重定向(LOCATION)";
		case "SETTING":
			return "服务配置(SETTING)";
		case "VISITS":
			return "访问计数(VISITS)";
		case "ROSTER":
			return "黑白名单(ROSTER)";
		case "USER":
			return "用户账户(USER)";
		case "LOG":
			return "访问日志(LOG)";
		case "IP":
			return "客户端IP";
		case "EMOJI":
			return "Unicode emoji test";
		default:
			return "";
	}
}