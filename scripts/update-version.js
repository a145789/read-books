const fs = require("fs")

function setup() {
  const package = JSON.parse(fs.readFileSync("package.json").toString())
  const text = fs.readFileSync("packages/app/src/constants/index.ts").toString()

  fs.writeFileSync(
    "packages/app/src/constants/index.ts",
    text.replace(
      /export const VERSION = '(\d|\.)+'/g,
      `export const VERSION = '${package.version}'`
    )
  )

  console.log("版本更新成功！")
}

try {
  setup()
} catch (error) {
  console.log("版本更新失败...")
  console.log(error)
}
