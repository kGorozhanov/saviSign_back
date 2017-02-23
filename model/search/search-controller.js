const Serial = require('./../serial/serial-facade');
const SerialGroup = require('./../serial-group/serial-group-facade');
const Product = require('./../product/product-facade');
var async = require('async');

class SearchController {
    search(req, res, next) {
        const query = req.params.search;
        async.parallel([
            (asyncdone) => {
                Serial.find()
                    // .then(docs => Serial.populate(docs, {path: 'serialGroup'}))
                    .then(docs => {
                        let filterd = docs.filter(item => {
                            if(item.key.indexOf(query) !== -1) return true;
                            return false;
                        });
                        if(filterd.length > 5) { 
                            filterd = filterd.splice(0, 5) 
                        }
                        asyncdone(null, filterd)
                    })
                    .catch(err => asyncdone(err));
            },
            (asyncdone) => {
                SerialGroup.find()
                    .then(docs => SerialGroup.populate(docs, {path: 'product'}))
                    .then(docs => {
                        let filterd = docs.filter(item => {
                            if(item.product.productId.indexOf(query) !== -1) return true;
                            if(item.serialPrefix.indexOf(query) !== -1) return true;
                            if(item.comments && item.comments.indexOf(query) !== -1) return true;
                            if(String(item.licenseCount).indexOf(query) !== -1) return true;
                            if(String(item.testPeriod).indexOf(query) !== -1) return true;
                            if(String(item.serialsCount).indexOf(query) !== -1) return true;
                            return false;
                        });

                        if(filterd.length > 5) { 
                            filterd = filterd.splice(0, 5) 
                        }

                        asyncdone(null, filterd);
                    })
                    .catch(err => asyncdone(err))
            },
            (asyncdone) => {
                Product.find()
                    .then(docs => {
                        let filterd = docs.filter(item => {
                            if(item.productId.indexOf(query) !== -1) return true;
                            if(item.name.indexOf(query) !== -1) return true;
                            return false;
                        });

                        if(filterd.length > 5) { 
                            filterd = filterd.splice(0, 5) 
                        }
                        
                        asyncdone(null, filterd);
                    })
                    .catch(err => asyncdone(err))
            }
        ],
        (err, results) => {
            if(err) return next(err);
            res.status(200).json({
                serials: results[0],
                serialGroups: results[1],
                products: results[2]
            });
        });
    }
}

module.exports = new SearchController();