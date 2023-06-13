import cheerio from 'cheerio';

const qrcode = 'http://app.sefaz.es.gov.br/ConsultaNFCe/qrcode.aspx?p=32230403845717003148651030001090941622354793|2|1|1|47E287DFA7A9FA6CE2E3F32B6E41689D1C1F7BA6'

const aspnet = /\,.*?\;|.*?\;/;
const authcookie = /\,.*?\;/;

let cookieToSend;



export async function getList(link) {
    
    let result = await fetch(link).then(result => {
        cookieToSend = result.headers.get('set-cookie');
        cookieToSend = cookieToSend.match(aspnet) + " " + (cookieToSend.match(authcookie).map(x => x.replace(/[\,\s\;]+/,"").replace(";","")));
    }).then(() => {
        return fetch(link, {
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
            let aray = [];
            const $ = cheerio.load(ret);
            $('tr').each((i, elem) => {
                let a = $(elem).text().replace('(','').replace(')','').match(/((?<=\s)(\w(.*?))(?=\n))|(?<=\t)(?=\w).*/gm);
                let object = {
                    Item: "",
                    Codigo: 0,
                    Quantidade: 0,
                    Unidade: "",
                    ValorUnitario: 0,
                    ValorTotal: 0
                }
                object.Item = a[0]
                object.Codigo = a[1].match(/(?<=\s).*/gm)[0]
                object.Quantidade = parseInt(a[2].match(/(?<=:).*/gm)[0])
                object.Unidade = a[3].match(/(?<=\s).*/gm)[0]
                object.ValorUnitario = parseFloat(a[4].match(/(?<=:).*/gm)[0].trim())
                object.ValorTotal = parseFloat(a[5].match(/(?<=Total).*/gm)[0])
                aray[i] = object;
            })
            return aray;
        })
    }).finally(x => { return x })

    return result;
}