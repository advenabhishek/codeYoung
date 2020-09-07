var axios = require('axios');
let redis = require('redis').createClient();

let translate = async (word, from, to) => {

    let result = await new Promise(resolve => {
        redis.hget(`${word}`, `${from}-${to}`, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
    if (result) {
        return result
    }
    let data = JSON.stringify({ word, from, to })
    let config = {
        method: 'post',
        url: `http://localhost:${process.env.PORT || 4001}/third-party-translate`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data
    }
    let response = await axios(config)
    if (response && response.data && response.data.result) {
        //save to cache
        redis.hset(`${word}`, `${from}-${to}`, response.data.result)
        //save multiples to redis
        performSmartCaching(word)
    }

    return response.data.result
}

module.exports = { translate }


//internal functions

async function performSmartCaching(word) {
    let langauage = ['a', 'b', 'c', 'd', 'e']
    let dataArray = []
    for (let from of langauage) {
        for (let to of langauage) {
            dataArray.push(JSON.stringify({ word, from, to }))
        }
    }

    dataArray.map(data => {
        let config = {
            method: 'post',
            url: `http://localhost:${process.env.PORT || 4001}/third-party-translate`,
            headers: {
                'Content-Type': 'application/json',
            },
            data
        }
        axios(config).then(response => {
            if (response && response.data && response.data.result) {
                let parsed = JSON.parse(data)
                console.log(parsed)
                redis.hset(`${parsed.word}`, `${parsed.from}-${parsed.to}`, response.data.result)
            }
        }).catch(e => {
            //log it
        })
    })
}


