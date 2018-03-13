const mongoose = require('mongoose'); // require MongoDB object modeler for Node.js

const FileSchema = new mongoose.Schema(
{
    title: String,
    description: String,
    created_at:
    {
        type: Date, default: Date.now
    }
});

const File = mongoose.model('File', FileSchema);

File.count({}, (err, count) =>
{
    if (err)
    {
        throw err;
    }

    if (count > 0) return;

    const files = require('./file.seed.json');

    File.create(files, (err, newFiles) =>
    {
        if (err)
        {
            throw err;
        }
        console.log("DB seeded");
    });
});

module.exports = File;
