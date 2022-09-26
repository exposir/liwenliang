import fetch from "node-fetch"
import { readFile, writeFile } from "fs";
import { uniqBy } from 'lodash'
import dayjs from 'dayjs'
import git from "simple-git";
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const cwd = process.cwd()

async function init() {
    let a = 0

    const action = async () => {

        const opts = {
            headers: {
                cookie: ` _T_WM=48495107576; WEIBOCN_FROM=1110006030; SUB=_2A25ODgRdDeRhGeFJ6FET9SvNyT-IHXVt8KwVrDV6PUJbkdAKLRP6kW1NfDseXW6cg_PYIA95C836fEM33mbtagQv; SCF=AuYcAoU9g_3Si__kb8lM2eQbG5Oo4nMYyiz6zqgOnHjNoZ5JeLYa6frijATFXMoRHVyeWslFkH4U9kaclNQDvXM.; SSOLoginState=1661629453; XSRF-TOKEN=5b5bfa; MLOGIN=1; mweibo_short_token=389ded6307`
            }
        };

        const comment = await fetch(
            `https://m.weibo.cn/api/comments/show?id=Is9M7taaY&page=${0}`, {}
        );

        const commentJson = await comment.json();

        const commentData = commentJson?.data?.data

        commentData.forEach((item, index) => {

            const newTime = dayjs().format('YYYY-MM-DD A hh:mm dddd')
            commentData[index].recordTime = newTime

            if (item.created_at.indexOf('分') >= 0) {
                const time = item.created_at?.split('分')[0]
                if (time) {
                    const newTime = dayjs().subtract(time, 'minute').format('YYYY-MM-DD A hh:mm dddd')
                    commentData[index].originTime = dayjs().subtract(time, 'minute')
                    commentData[index].recordTime = newTime
                }
            }

            if (item.created_at.indexOf('小时') >= 0) {
                const time = item.created_at?.split('小时')[0]
                if (time) {
                    const newTime = dayjs().subtract(time, 'hour').format('YYYY-MM-DD A hh:mm dddd')
                    commentData[index].originTime = dayjs().subtract(time, 'hour')
                    commentData[index].recordTime = newTime
                }
            }


        })


        readFile(`${cwd}/lib/comment.json`, function (err, data) {

            const beforeString = data.toString();
            const beforeData = JSON.parse(beforeString)
            const newComment = uniqBy([...beforeData, ...commentData], 'id')

            console.log(`数据 ${newComment.length}`)

            writeFile(`${cwd}/lib/comment.json`, JSON.stringify(newComment), function (err) {
                if (err) {
                    return console.error(err);
                }
            });

        });
    }

    const submit = async () => {
        try {
            const simpleGit = git();
            await simpleGit.add("./*");
            await simpleGit.commit("update");
            await simpleGit.push("origin", "main");
            console.log("submit ok");
        } catch (e) {
            console.log(e);
        }
    };

    try {
        setInterval(async () => {
            action()
            submit()
            console.log(`时间 ${dayjs().format('YYYY-MM-DD A hh:mm dddd')}`)
            console.log(`次数 ${a++}`)


        }, 20000);
    } catch (e) {
        console.log('e', e)
    }

}

init()