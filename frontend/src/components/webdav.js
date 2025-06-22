import axios from 'axios';
// JOYZL WEBDAV
export default {
	url: function(base) {
		if (arguments.length == 0) {
			return axios.defaults.baseURL;
		} else {
			// http://www.joyzl.com/webdav/
			axios.defaults.baseURL = base;
		}
	},
	propfind: function(uri, success, error) {
		axios({
			method: 'PROPFIND',
			url: uri,
			data: {
				Allprop: true
			},
			responseType: 'json',
			// 允许用户凭据浏览器弹出默认登录框
			// Egde不会弹出默认登录框
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Depth': '1'
			},
			timeout: 6000
		}).then(function(response) {
			if (response.data) {
				// Multi-Status:Response[]
				if (response.data.Responses) {
					// 简化对象结构
					let rsp, s, propstat, p;
					for (let r = 0; r < response.data.Responses.length; r++) {
						rsp = response.data.Responses[r];
						if (rsp.Propstats) {
							for (s = 0; s < rsp.Propstats.length; s++) {
								propstat = rsp.Propstats[s];
								if (propstat.Prop && propstat.Prop.length) {
									if (propstat.Status && propstat.Status.includes("200")) {
										for (p = 0; p < propstat.Prop.length; p++) {
											rsp[propstat.Prop[p].Name] = propstat.Prop[p].Value;
										}
									}
								}
							}
						}
					}
					if (success) success(response.data.Responses);
					return;
				}
			}
			if (success) success([]);
		}).catch(function(e) {
			console.log(e);
			if (error) error(e.message);
		});
	},
	proppatch: function() {},
	mkcol: function() {},
	delete: function() {},
	put: function() {},
	copy: function() {},
	move: function() {}
}