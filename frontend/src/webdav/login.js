import eno from "@joyzl/eno";
import HTML from "./login.html";

export default {
	open: function(callback) {
		let element = eno.append(HTML);
		eno.bind(element, "form", "submit", function(event) {
			event.preventDefault();
			event.stopPropagation();

			let user = eno.get(this);
			user.name = user.username;
			console.log(user);

			eno.remove(element);
			if (callback) callback(user);

			return false;
		});

		eno.set(element, {
			username: "管理员",
			password: "123"
		});
	}
}