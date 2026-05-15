import axios from "axios";
const BaseUrl = 'https://api-inflact.vercel.app';
/* API BY ZIDNI */

export function wxGpt(question) {
    return new Promise((resolve, reject) => {
        axios.get(BaseUrl +"/api/chat?prompt=" + question).then(({data}) => {
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
        axios.get(BaseUrl +"/api/spotidown?url=" + link).then(({data}) => {
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
        axios.get(BaseUrl +"/api/scrape?username=" + username).then(({data}) => {
            const result = {
                status: 200,
                data
            }
            resolve(result)
            reply(result)
        }).catch(reject)
    })
}
