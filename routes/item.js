const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multiparty = require('multiparty');
const parser = require('fast-xml-parser');
const flatten = require('flat')

const fs = require('fs')
const util = require('util');
const readFile = util.promisify(fs.readFile);
router.post('/', async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
        const filePath = files[Object.keys(files)[0]][0].path;
        const data = await readFile(filePath, 'utf8');
        var tObj = parser.getTraversalObj(data, {});
        var jsonObj = parser.convertToJson(tObj, {});
        const flatt = flatten(jsonObj)

        Object.keys(flatt).forEach(e => {
            flatt[e] = e.split('.').pop(-1)
        });
        console.log(flatt);

        var unflatten = require('flat').unflatten

        fs.writeFile('./test.json', JSON.stringify(unflatten(flatt)), function (err) {
            if (err) throw err;
            console.log('Saved!');
            return res.status(200).json('Saved');
        })


    });
});



module.exports = router;