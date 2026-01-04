import axios from 'axios';

// JOYZL Manage

let SERVERS, ROSTER, USERS;
let ORIGINAL_SERVERS;
let ORIGIN;
// 
export default {
	url: function(base) {
		if (arguments.length == 0) {
			return axios.defaults.baseURL;
		} else {
			axios.defaults.baseURL = base;
			const url = new URL(base);
			ORIGIN = url.origin;
		}
	},
	servers: function() {
		return SERVERS;
	},
	roster: function() {
		return ROSTER;
	},
	users: function() {
		return USERS;
	},
	/**获取配置中的资源路径*/
	paths: function() {
		const paths = new Array();
		if (SERVERS) {
			for (const server of SERVERS) {
				if (server.servlets) {
					for (const servlet of server.servlets) {
						if (servlet.path) {
							paths.push(correct(servlet.path));
						}
					}
				}
				if (server.hosts) {
					for (const host of server.hosts) {
						if (host.servlets) {
							for (const servlet of host.servlets) {
								if (servlet.path) {
									paths.push(correct(servlet.path));
								}
							}
						}
					}
				}
			}
		}
		return paths;
	},
	/**获取配置中的服务名称*/
	names: function() {
		const names = new Array();
		if (SERVERS) {
			for (const server of SERVERS) {
				if (server.name) {
					names.push(server.name);
				}
				if (server.hosts) {
					for (const host of server.hosts) {
						if (host.name) {
							names.push(host.name);
						}
						if (host.names) {
							for (const name of host.names) {
								names.push(name);
							}
						}
					}
				}
			}
		}
		return names;
	},
	/**从服务器获取本机IP*/
	ipGet: function(success, error) {
		request('GET', "ip").then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**从服务器获取日志文件名*/
	logGet: function(uri, success, error) {
		request('GET', "log/" + uri).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**从服务器获取访问计数*/
	visitsGet: function(success, error) {
		request('GET', "visits").then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**判断服务名称是否存在*/
	existsName: function(name) {
		if (SERVERS) {
			for (const server of SERVERS) {
				if (server.name == name) {
					return true;
				}
				for (const host of server.hosts) {
					if (host.name == name) {
						return true;
					}
				}
			}
		}
		return false;
	},
	/**从服务器获取服务配置*/
	settingGet: function(success, error) {
		request('GET', "setting").then(function(response) {
			SERVERS = response.data;
			ORIGINAL_SERVERS = Object.freeze(structuredClone(SERVERS));
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**上载服务配置到服务器，配置将立即生效*/
	settingPut: function(success, error) {
		request('PUT', "setting", SERVERS).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**配置是否有更改*/
	settingChanged: function() {
		if (ORIGINAL_SERVERS) {
			return !equals(ORIGINAL_SERVERS, SERVERS);
		} else {
			return true;
		}
	},
	/**判断地址是否存在*/
	existsAddress: function(address) {
		if (ROSTER) {
			for (const roster of ROSTER) {
				if (roster.address == address) {
					return true;
				}
			}
		}
		return false;
	},
	/**从服务器获取地址名单*/
	rosterGet: function(success, error) {
		request('GET', "roster").then(function(response) {
			ROSTER = response.data;
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**新建地址名单*/
	rosterPut: function(address, success, error) {
		request('PUT', "roster", address).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**修改地址名单*/
	rosterPost: function(address, success, error) {
		request('POST', "roster", address).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**删除地址名单*/
	rosterDelete: function(address, success, error) {
		request('DELETE', "roster", address).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**判断用户名是否存在*/
	existsUser: function(name) {
		if (USERS) {
			for (const user of USERS) {
				if (user.name == name) {
					return true;
				}
			}
		}
		return false;
	},
	/**从服务器获取用户账户*/
	userGet: function(success, error) {
		request('GET', "user").then(function(response) {
			USERS = response.data;
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**新建用户账户*/
	userPut: function(user, success, error) {
		request('PUT', "user", user).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**修改用户账户*/
	userPost: function(user, success, error) {
		request('POST', "user", user).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**删除用户账户*/
	userDelete: function(user, success, error) {
		request('DELETE', "user", user).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},

	/**从服务器获取创建的归档库*/
	archives: function(success, error) {
		requestParam("POST", "archives").then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**获取指定归档库目录集*/
	archiveDirs: function(id, success, error) {
		requestParam("POST", "archives", {
			"id": id
		}).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**获取指定归档库和目录的编号集*/
	archivePackets: function(id, name, success, error) {
		requestParam("POST", "archives", {
			"id": id,
			"name": name
		}).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**获取指定编号的文件集*/
	archiveFiles: function(uri, code, success, error) {
		requestParam("GET", ORIGIN + uri, {
			"code": code
		}).then(function(response) {
			if (success) success(response.data);
		}).catch(function(e) {
			if (error) error(e.message);
		});
	},
	/**获取指归档件URL*/
	archiveFileURL: function(uri, code, name) {
		return ORIGIN + uri + code + "/" + name;
	},
}

function request(method, uri, data) {
	return axios({
		url: uri,
		method: method,
		responseType: 'json',
		withCredentials: true,
		headers: {
			"Content-Type": "application/json"
		},
		timeout: 6000,
		// 如果请求体为null那么"Content-Type"也不会发出
		data: data ? data : ""
	});
}

function requestParam(method, uri, data) {
	return axios({
		url: uri,
		method: method,
		responseType: 'json',
		withCredentials: true,
		headers: {
			"Content-Type": 'application/x-www-form-urlencoded'
		},
		timeout: 6000,
		params: method == "GET" ? data : null,
		data: data ? data : ""
	});
}

/**移除路径中的通配符*/
function correct(path) {
	let i = path.indexOf('*');
	if (i > 0) {
		return path.substring(0, i);
	}
	if ("*" == path) {
		return "/";
	}
	return path;
}

/** 比较仅针对服务配置对象，其它对象可不保证结果*/
function equals(a, b) {
	if (a === null && b === null) {
		return true;
	}
	if (a === null || b === null) {
		return false;
	}

	// 是否数组
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			if (!equals(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}
	if (Array.isArray(a) || Array.isArray(b)) {
		return false;
	}

	// 检查是否为对象
	if (Object.getPrototypeOf(a) === Object.prototype && Object.getPrototypeOf(b) === Object.prototype) {
		// 获取所有属性名（包括不可枚举属性，但不包括 Symbol）
		const keys1 = Object.getOwnPropertyNames(a);
		const keys2 = Object.getOwnPropertyNames(b);

		// 检查属性数量是否相同
		if (keys1.length !== keys2.length) {
			return false;
		}

		// 递归比较每个属性
		for (const key of keys1) {
			if (!keys2.includes(key)) {
				// 属性名不同
				return false;
			}
			if (!equals(a[key], b[key])) {
				// 属性值不同
				return false;
			}
		}
		return true;
	}
	// console.log(a + "=" + b)
	return a === b;
}