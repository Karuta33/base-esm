import axios from "axios";
const BaseUrl = 'https://www.ashema.my.id';
/* API BY @azumimicucu */

export function wxGpt(question) {
    return new Promise((resolve, reject) => {
        axios.get(BaseUrl +"/d/auto/wxgpt?prompt=" + question).then(({data}) => {
            const result = {
                status: 200,
                data
            }
            resolve(result)
            reply(result)
        }).catch(reject)
    })
}
export function SpotifyDL(link) {
    return new Promise((resolve, reject) => {
        axios.get(BaseUrl +"/d/fetcher/spotify?url=" + link).then(({data}) => {
            const result = {
                status: 200,
                data
            }
            resolve(result)
            reply(result)
        }).catch(reject)
    })
}
export function igStalk(username) {
    return new Promise((resolve, reject) => {
        axios.get(BaseUrl +"/d/finder/igstalk?username=" + username).then(({data}) => {
            const result = {
                status: 200,
                data
            }
            resolve(result)
            reply(result)
        }).catch(reject)
    })
}

export function Sticker() {

}
