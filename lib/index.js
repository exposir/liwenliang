"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const dayjs_1 = __importDefault(require("dayjs"));
const simple_git_1 = __importDefault(require("simple-git"));
require("dayjs/locale/zh-cn");
dayjs_1.default.locale('zh-cn');
const cwd = process.cwd();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let a = 0;
        const action = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const opts = {
                headers: {
                    cookie: ` _T_WM=48495107576; WEIBOCN_FROM=1110006030; SUB=_2A25ODgRdDeRhGeFJ6FET9SvNyT-IHXVt8KwVrDV6PUJbkdAKLRP6kW1NfDseXW6cg_PYIA95C836fEM33mbtagQv; SCF=AuYcAoU9g_3Si__kb8lM2eQbG5Oo4nMYyiz6zqgOnHjNoZ5JeLYa6frijATFXMoRHVyeWslFkH4U9kaclNQDvXM.; SSOLoginState=1661629453; XSRF-TOKEN=5b5bfa; MLOGIN=1; mweibo_short_token=389ded6307`
                }
            };
            const comment = yield (0, node_fetch_1.default)(`https://m.weibo.cn/api/comments/show?id=Is9M7taaY&page=${0}`, {});
            const commentJson = yield comment.json();
            const commentData = (_a = commentJson === null || commentJson === void 0 ? void 0 : commentJson.data) === null || _a === void 0 ? void 0 : _a.data;
            commentData.forEach((item, index) => {
                var _a, _b;
                const newTime = (0, dayjs_1.default)().format('YYYY-MM-DD A hh:mm dddd');
                commentData[index].recordTime = newTime;
                if (item.created_at.indexOf('分') >= 0) {
                    const time = (_a = item.created_at) === null || _a === void 0 ? void 0 : _a.split('分')[0];
                    if (time) {
                        const newTime = (0, dayjs_1.default)().subtract(time, 'minute').format('YYYY-MM-DD A hh:mm dddd');
                        commentData[index].originTime = (0, dayjs_1.default)().subtract(time, 'minute');
                        commentData[index].recordTime = newTime;
                    }
                }
                if (item.created_at.indexOf('小时') >= 0) {
                    const time = (_b = item.created_at) === null || _b === void 0 ? void 0 : _b.split('小时')[0];
                    if (time) {
                        const newTime = (0, dayjs_1.default)().subtract(time, 'hour').format('YYYY-MM-DD A hh:mm dddd');
                        commentData[index].originTime = (0, dayjs_1.default)().subtract(time, 'hour');
                        commentData[index].recordTime = newTime;
                    }
                }
            });
            (0, fs_1.readFile)(`${cwd}/lib/comment.json`, function (err, data) {
                const beforeString = data.toString();
                const beforeData = JSON.parse(beforeString);
                const newComment = (0, lodash_1.uniqBy)([...beforeData, ...commentData], 'id');
                console.log(`数据 ${newComment.length}`);
                (0, fs_1.writeFile)(`${cwd}/lib/comment.json`, JSON.stringify(newComment), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
            });
        });
        const submit = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const simpleGit = (0, simple_git_1.default)();
                yield simpleGit.add("./*");
                yield simpleGit.commit("update");
                yield simpleGit.push("origin", "main");
                console.log("submit ok");
            }
            catch (e) {
                console.log(e);
            }
        });
        try {
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                action();
                console.log(`时间 ${(0, dayjs_1.default)().format('YYYY-MM-DD A hh:mm dddd')}`);
                console.log(`次数 ${a++}`);
            }), 20000);
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                submit();
            }), 100000);
        }
        catch (e) {
            console.log('e', e);
        }
    });
}
init();
