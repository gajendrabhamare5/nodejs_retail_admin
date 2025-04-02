const mongoose = require("mongoose")

const WishlistSchema = new mongoose.Schema({
    user_id : {
        type:String,

    },
    product_id : {
        type:String,

    },
    wishlist_type:
    {
        type:String,

    },
})

const Wishlist = new mongoose.model("client_wishlist", WishlistSchema);

module.exports = Wishlist
