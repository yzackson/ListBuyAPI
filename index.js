const cheerio = require('cheerio')
const qrcode = 'http://app.sefaz.es.gov.br/ConsultaNFCe/qrcode.aspx?p=32230403845717003148651030001090941622354793|2|1|1|47E287DFA7A9FA6CE2E3F32B6E41689D1C1F7BA6'

const aspnet = /\,.*?\;|.*?\;/;
const authcookie = /\,.*?\;/;

let cookieToSend;


fetch(qrcode).then(result => {
    cookieToSend = result.headers.get('set-cookie');
    cookieToSend = cookieToSend.match(aspnet) + " " + (cookieToSend.match(authcookie).map(x => x.replace(/[\,\s\;]+/,"").replace(";","")));
}).then(() => {
    fetch(qrcode, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
            "upgrade-insecure-requests": "1",
            "cookie": cookieToSend
          },
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": null,
          "method": "GET"
    }).then(res => {
        return res.text();
    }).then(ret => {
        const $ = cheerio.load(ret);
        let aray = [];
        $('tr').each((i, elem) => {
            aray[i] = $(elem).text().match(/\w(.*?)\n/gm);
        })
    })
})

