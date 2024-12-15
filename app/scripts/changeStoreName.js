const { getSetting } = require("@evershop/evershop/src/modules/setting/services/setting.js");
const { getConnection } = require("@evershop/evershop/src/lib/postgres/connection");
const { insertOnUpdate, commit, rollback } = require("@evershop/postgres-query-builder");

(async function () {
	const connection = await getConnection();
	const settingKey = "storeName";
	const storeName = await getSetting(settingKey, undefined);
	console.log(storeName);
	if (!storeName) {
		try {
			await insertOnUpdate("setting", ["name"])
				.given({
					name: settingKey,
					value: "CTIS 486",
					is_json: 0,
				})
				.execute(connection, false);
			await commit(connection);
			console.log("updated storeName");
		} catch (e) {
			console.error("Couldn't update store name, e ->", e);
			await rollback(connection);
		}
	}
	process.exit(0);
})();
