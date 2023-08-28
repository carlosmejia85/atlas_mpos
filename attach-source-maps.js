let fs = require("fs");
let path = require("path");

const TARGET_DIR = "www";

module.exports = function (ctx) {
  console.warn("=====================");
  console.warn("WARNING: Sourcemaps have been manually added.");
  console.warn("Ensure this is disabled in production!");
  console.warn("=====================");

  let files = fs.readdirSync(TARGET_DIR);

  files.forEach((file) => {
    let mapFile = path.join(TARGET_DIR, file + ".map");
    let targetFile = path.join(TARGET_DIR, file);
    if (
      (path.extname(file) === ".js" && fs.existsSync(mapFile)) ||
      (path.extname(file) === ".css" && fs.existsSync(mapFile))
    ) {
      let bufMap = fs.readFileSync(mapFile).toString("base64");
      let bufFile = fs.readFileSync(targetFile, "utf8");
      let result = bufFile.replace(
        "sourceMappingURL=" + file + ".map",
        "sourceMappingURL=data:application/json;charset=utf-8;base64," +
          bufMap
      );
      fs.writeFileSync(targetFile, result);
    }
  });
};