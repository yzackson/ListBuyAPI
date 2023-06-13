import express from 'express';
import ejs from 'ejs';
import { getList } from './services/getList.js'
import bodyParser from 'body-parser';
import firestoreConn from './services/firebaseConfig.js';
import { doc, setDoc } from "firebase/firestore";
import router from './routes/filesRoutes.js';


import https from 'https';
import fs, { link } from 'fs';
let privateKey  = fs.readFileSync('./cert/listbuy.app+3-key.pem', 'utf8');
let certificate = fs.readFileSync('./cert/listbuy.app+3.pem', 'utf8');

let credentials = {key: privateKey, cert: certificate};

// your express configuration here
const app = express();

const PORT = 1234;
const HTTPSPORT = 8080;
const HOST = '192.168.100.34';

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//app.use('/src', express.static('./src'));

//app.use('/src', express.static(path.join(__dirname, 'client')));

app.use('/src', router);



app.get('/', (req,res) => {
    res.render('index.html')
})

app.get('/getList', (req, res) => {
    getList().then(list => {
        res.send(list)
    });
})

app.post('/sendLink', (request,response) => {
    console.log(request.body.link);
    //console.log(request.body.link);
    getList(request.body.link).then(list => {
        console.log(list);
        return list;
    }).then(list => {
        let data = {};

        for (let i = 0; i < list.length; i++) {
            data[i] = list[i];
        }
    
        let date = new Date();
        
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        let docName = `${request.body.listName}_${dd.toString() + mm.toString() + yyyy.toString()}`;
        let collName = `${date.toLocaleString('default', { month: 'long' })}${yyyy}`;
    
        setDoc(doc(firestoreConn, collName, docName), data).then(res => {
            response.send(`Dados adicionados... \n\n Response: ${res} \n\n${JSON.stringify(data)}`);
        });
    })
})









app.listen(PORT, HOST, () => console.log(`Http server running on port ${PORT}`));

https.createServer(credentials, app).listen(HTTPSPORT, () => {console.log(`Https server  running on port ${HTTPSPORT}`)});