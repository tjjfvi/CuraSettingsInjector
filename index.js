const express = require("express");
const request = require("request-promise-native");
const server = express();
const router = express.Router();

const url = "https://github.com/Ultimaker/Cura/raw/master/resources/definitions/fdmprinter.def.json";

router.get("/", async (req, res) => {
	let { settings } = JSON.parse(await request(url));

	let f = obj => [].concat(...Object.entries(obj).map(([k, v]) => [
		...f(v.children || []),
		...(v.type === "category" ? [] : [k])
	]))

	res.set("Content-Type", "text/plain").send(f(settings).filter(k => k !== "machine_start_gcode" && k !== "machine_end_gcode").map(k => `; ${k} = {${k}}`).join("\n"));
})

server.use(router);

if(require.main === module)
	server.listen(process.env.PORT || 8080)

module.exports = router;
