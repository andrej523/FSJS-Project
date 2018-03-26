const mongoose = require('mongoose'); // require MongoDB object modeler for Node.js

const menuItemSchema = new mongoose.Schema(
{
    title: String,
    description: String,
    created_at:
    {
        type: Date, default: Date.now
    },
    deleted:
    {
        type: Boolean,
        default: false
    }
});

const menuItem = mongoose.model('menuItem', menuItemSchema);

menuItem.count({}, (err, count) =>
{
    if (err)
    {
        throw err;
    }

    if (count > 0) return;

    const menuItems = require('./menu_item.seed.json');

    menuItem.create(menuItems, (err, newMenuItems) =>
    {
        if (err)
        {
            throw err;
        }
        console.log("DB seeded");
    });
});

module.exports = menuItem;