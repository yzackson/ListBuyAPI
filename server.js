import express from 'express';
import ejs from 'ejs';
import { getList } from './services/getList.js'
import bodyParser from 'body-parser';
import firestoreConn from './services/firebaseConfig.js';
import { doc, setDoc } from "firebase/firestore"; 

const app = express();

const PORT = 1234;

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/src', express.static('./src'));






app.get('/', (req,res) => {
    res.render('index.html')
})

app.get('/getList', (req, res) => {
    getList().then(list => {
        res.send(list)
    });
})

app.post('/sendLink', (request,response) => {
    //console.log(request.body.link);
    getList(request.body.link).then(list => {
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
            response.send(res);
        });
    })
})





app.listen(PORT, () => console.log('Server  running...'));