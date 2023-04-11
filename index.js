const fs = require("fs");
const JSONStream = require("JSONStream");

const stream = fs.createReadStream("./lib/comment5.json");
const parser = JSONStream.parse("*");

let dataArray = [];

stream.pipe(parser);

parser.on("data", function (obj) {
  dataArray.push(obj);
});

parser.on("end", function () {
  // 将dataArray分为两半并写入文件
  const half = Math.ceil(dataArray.length / 2);
  const firstHalf = dataArray.slice(0, half);
  const secondHalf = dataArray.slice(half);

  fs.writeFileSync("./lib/comment5_1.json", JSON.stringify(firstHalf));
  fs.writeFileSync("./lib/comment5_2.json", JSON.stringify(secondHalf));
});

// 在 Node.js 中，可以使用 readline 模块和 JSONStream 模块来流式读取 JSON 大文件，其中文件内是一个数组形式的 JSON。

// 首先，使用 fs.createReadStream() 创建一个可读流，将文件读入内存。然后，使用 JSONStream.parse() 方法创建一个解析器对象，该对象会将输入流解析为 JSON 对象，并将每个对象推送到一个可写流中。

// 以下是一个基本的示例代码：

// 在这个示例中，我们使用 Node.js 内置的 fs 模块创建一个可读流，并使用 JSONStream.parse() 方法创建一个解析器对象。JSONStream.parse() 方法接受一个参数，用于指定要解析的 JSON 对象的路径。在这个例子中，我们使用通配符 *，表示解析任意路径的 JSON 对象。然后，我们将可读流传递给解析器对象，使用 pipe() 方法将其连接到解析器对象的输入端。

// 当解析器对象解析 JSON 对象时，会将其推送到可写流中。在这个例子中，我们在解析器对象上监听 data 事件，并将解析后的 JSON 对象推入一个数组中。当可读流的所有数据都已被解析时，解析器对象会触发 end 事件，我们可以在该事件的回调函数中输出整个数组。

// 需要注意的是，JSONStream 模块需要单独安装，可以使用 npm install JSONStream 命令进行安装。
