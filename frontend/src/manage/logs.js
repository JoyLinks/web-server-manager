import eno from "@joyzl/eno";
import alert from 'components/alert';
import manage from 'components/manage';
import bt from 'components/bytes';
import html from './logs.html';

export default {
	open: function(server, host, callback) {
		const element = eno.append("main", html);
		// 此对象用于日志异步读取时传递上下文和收集信息
		const u = {
			host: host,
			server: server,
			element: element,
			close: false
		};
		if (host) {
			eno.set(element, ".title", host);
		} else {
			eno.set(element, ".title", server);
		}

		eno.bind(element, "#close", "click",
			function(event) {
				//阻止日志继续读取
				u.close = true;
				eno.remove(element);
				if (callback) callback();
			}
		);
		eno.bind(element, "nav", "click",
			function(event) {
				const target = eno.target(event, "target");
				if (target) {
					// 切换选中状态
					const name = target.getAttribute("target");
					eno.toggle(target, "selected", "hover");
					eno.toggle(element, "#" + name);
				}
			}
		);

		eno.toggle(element);

		list(u);
	}
}

function refresh(u, target) {
	if (target) {

	} else {
		// 首次显示:隐藏提示，默认选中
		eno.hide(u.element, "#reading");
		eno.select(u.element, "nav div:first-child").click();

		//数据量
		u.request = bt(u.request);
		u.response = bt(u.response);
		eno.set(u.element, "#data", u);
		eno.toggle(u.element, "#data");

		//数量可控的条目全部呈现

		//此方法计算百分比
		const p = function(tag, item, name) {
			if ("bar" == name) {
				item.p = (item.total / u.total * 100).toFixed(1) + '%';
				tag.style = "width:" + item.p;
			}
		}

		eno.sets(u.element, "#files", u.files,
			function(tag, item, name) {
				if ("bytes" == name) {
					return bt(item.bytes);
				}
			}
		);
		delete u.files;

		let items = Array.from(u.hours.values());
		items.sort(
			function(a, b) {
				return a.hour - b.hour;
			}
		);
		eno.sets(u.element, "#hours", items, p);
		delete u.hours;

		items = Array.from(u.versions.values());
		items.sort(totalSort);
		eno.sets(u.element, "#versions", items, p);
		delete u.versions;

		items = Array.from(u.servlets.values());
		items.sort(totalSort);
		eno.sets(u.element, "#servlets", items, p);
		delete u.servlets;

		items = Array.from(u.methods.values());
		items.sort(totalSort);
		eno.sets(u.element, "#methods", items, p);
		delete u.methods;

		items = Array.from(u.status.values());
		items.sort(totalSort);
		eno.sets(u.element, "#status", items, p);
		delete u.status;

		//数量不可控条目限制数量

		//u.addresses = new Map();
		items = Array.from(u.addresses.values());
		u.addresses = items.length;
		items.sort(totalSort);
		if (items.length > 200) {
			items.splice(200);
		}
		eno.set(u.element, "#addresses", u);
		eno.sets(u.element, "#addresses", items, p);

		//u.resources = new Map();
		items = Array.from(u.resources.values());
		u.resources = items.length;
		items.sort(totalSort);
		if (items.length > 200) {
			items.splice(200);
		}
		eno.set(u.element, "#resources", u);
		eno.sets(u.element, "#resources", items, p);

	}
}

function totalSort(a, b) {
	return b.total - a.total;
}

//1 获取日志文件列表
function list(u) {
	if (u.host) {
		u.uri = u.server.name + "/" + u.host.name;
	} else {
		u.uri = u.server.name;
	}
	manage.logGet(u.uri,
		function(names) {
			u.names = names;
			fetchs(u);
		},
		alert.error);
}
//2 获取日志文件内容
function fetchs(u) {
	if (u.close) return;
	if (u.index >= 0) {
		u.index++;
	} else {
		u.index = 0;
		u.files = [];
		u.hours = new Map();
		u.versions = new Map();
		u.addresses = new Map();
		u.resources = new Map();
		u.servlets = new Map();
		u.methods = new Map();
		u.status = new Map();
		u.response = 0;
		u.request = 0;
		u.errors = 0;
		u.total = 0;
	}

	if (u.index < 7 && u.index < u.names.length) {
		// 输出读取消息
		const file = {
			name: u.names[u.index],
			bytes: 0,
			total: 0
		}
		u.files.push(file);
		eno.sets(u.element, "#files", u.files);

		//异步读取文件
		fetch(manage.url() + "log/" + u.uri + "/" + u.names[u.index])
			.then(function(response) {
				if (response.ok) {
					if (u.close) return;

					const body = response.body;
					if (body) {
						// Uint8Array -> UTF-8
						const reader = body.pipeThrough(new TextDecoderStream()).getReader();

						let line, start, feed;
						reader.read().then(
							function processText({
								done,
								value
							}) {
								if (done) {
									fetchs(u);
									return;
								}
								// 字节数可能有误差
								file.bytes += value.length;

								// 拆分文本行
								start = 0;
								while (start < value.length) {
									feed = value.indexOf('\n', start);
									if (feed == start) {
										start++;
										if (line) {
											file.total += 1;
											parse(u, line);
											line = null;
										}
									} else if (feed > start) {
										if (line) {
											line += value.slice(start, feed);
											start = feed + 1;
										} else {
											line = value.slice(start, feed);
											start = feed + 1;
										}
										file.total += 1;
										parse(u, line);
										line = null;
									} else {
										line = value.slice(start);
										break;
									}
								}

								// NEXT
								return reader.read().then(processText);
							}
						);
					}
				}
			});
	} else {
		//读完：刷新显示
		refresh(u);
		return;
	}
}

// 3 逐行解析日志记录
function parse(u, line) {
	//解析字符串
	//1750200542857 30:49:2.857 80 127.0.0.1 127.0.0.1 GET /manage/visits HTTP/1.1 0 VISITS 10 500 0
	//数据量测算：100万访问记录，假设每记录100字符，约为100Mb

	const fields = line.split(' ');
	if (fields && fields.length == 13) {
		u.total += 1;

		//请求的时间戳 时间
		//0 :"1750155261832"
		//1 :"18:14:21.832"
		let temp = new Date(Number(fields[0]));
		let value = temp.getHours();
		temp = u.hours.get(value);
		if (temp) {
			temp.total += 1;
		} else {
			u.hours.set(value, {
				hour: value,
				name: value < 10 ? "0" + value : value,
				total: 1
			});
		}

		//服务端口 请求主机
		//2 :"80"
		//3 :"127.0.0.1"

		//请求的客户端IP地址(Remote IP-address)
		//4 :"127.0.0.1"
		value = fields[4];
		temp = u.addresses.get(value);
		if (temp) {
			temp.total += 1;
		} else {
			u.addresses.set(value, {
				name: value,
				total: 1
			});
		}

		//请求的第一行（METHOD URI VERSION） 请求的大小（以字节为单位）
		//5 :"GET"
		//6 :"/manage/setting"
		//7 :"HTTP/1.1"
		//8 :"0"
		value = fields[5];
		temp = u.methods.get(value);
		if (temp) {
			temp.total += 1;
		} else {
			u.methods.set(value, {
				name: value,
				total: 1
			});
		}
		value = fields[6];
		temp = u.resources.get(value);
		if (temp) {
			temp.total += 1;
		} else {
			u.resources.set(value, {
				name: value,
				total: 1
			});
		}
		value = fields[7];
		temp = u.versions.get(value);
		if (temp) {
			temp.total += 1;
		} else {
			u.versions.set(value, {
				name: value,
				total: 1
			});
		}

		u.request += Number(fields[8]);

		//生成响应的处理程序(Servlet) 处理请求所需的时间（毫秒） 响应状态 响应的大小（以字节为单位）
		//9 :"SETTING"
		//10:"1"
		//11:"200"
		//12:"1978"
		value = fields[9];
		temp = u.servlets.get(value);
		if (temp) {
			temp.total += 1;
		} else {
			u.servlets.set(value, temp = {
				name: value,
				total: 1,
				error: 0,
				time: 0,
				max: 0
			});
		}
		//统计程序用时
		value = Number(fields[10]);
		temp.time += value;
		temp.max = value > temp.max ? value : temp.max;

		value = fields[11];
		if (value < 200 || value >= 300) {
			//根据状态码记录程序请求错误数
			temp.error += 1;
		}
		//响应状态统计
		temp = u.status.get(value);
		if (temp) {
			temp.total += 1;
		} else {
			u.status.set(value, {
				name: value,
				total: 1
			});
		}
		u.response += Number(fields[12]);

	} else {
		//忽略错误的格式
		//可能是URL包含空格
		u.errors++;
	}
}