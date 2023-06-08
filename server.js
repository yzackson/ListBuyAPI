import express from 'express';
import ejs from 'ejs';
import { getList } from './services/getList.js'
import bodyParser from 'body-parser';

const app = express();

const PORT = 1234;
const HOST = '192.168.100.34';

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

app.post('/sendLink', (req,res) => {
    //console.log(req.body.link);
    getList(req.body.link).then(list => {
        res.send(list)
    });
})





app.listen(PORT, HOST, () => console.log('Server  running...'));