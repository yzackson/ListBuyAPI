import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';

//const __fileURLToPath = fileURLToPath()
const __jsFilesPath = path.resolve('src');
const router = Router();

router.get('/:file', (req, res) => {
    res.sendFile(path.join(__jsFilesPath + '/' + req.params.file));
});

export default router;