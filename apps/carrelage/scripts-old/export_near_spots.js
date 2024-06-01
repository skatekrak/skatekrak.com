const conn = new Mongo('localhost:27017');
const db = conn.getDB('carrelage');

const Spot = db.getCollection('spots');

var final = [];

// var query = Spot.find({ "type": "shop" });
var query = Spot.find({ type: 'park' });
query.forEach(function(spot) {
    var res = [];
    Spot.find({
        _id: { $ne: spot._id },
        // "type": "shop",
        type: 'park',
        geo: { $geoWithin: { $centerSphere: [[spot.geo[0], spot.geo[1]], 0.3 / 3963.2] } },
    }).forEach(function(s) {
        res.push(s);
    });
    if (res.length > 0) {
        final.push({
            origin: spot,
            checks: res,
        });
    }
});

final.forEach(function(doc) {
    doc.origin._id = doc.origin._id.str;
    delete doc.origin.createdAt;
    delete doc.origin.updatedAt;
    delete doc.origin.coverURL;
    delete doc.origin.comments;
    delete doc.origin.__parse_id;
    delete doc.origin.openingHours;
    delete doc.origin.indoor;
    delete doc.origin.status;
    delete doc.origin.geo;
    delete doc.origin.className;
    delete doc.origin.__v;
    delete doc.origin.description;
    if (doc.origin.location) {
        delete doc.origin.location.streetName;
        delete doc.origin.location.streetNumber;
    }
    delete doc.origin.phone;
    delete doc.origin.website;
    delete doc.origin.instagram;
    delete doc.origin.snapchat;
    delete doc.origin.facebook;
    doc.checks.forEach(function(check) {
        check._id = check._id.str;
        delete check.createdAt;
        delete check.updatedAt;
        delete check.coverURL;
        delete check.comments;
        delete check.__parse_id;
        delete check.openingHours;
        delete check.indoor;
        delete check.status;
        delete check.geo;
        delete check.className;
        delete check.__v;
        delete check.description;
        if (check.location) {
            delete check.location.streetName;
            delete check.location.streetNumber;
        }
        delete check.phone;
        delete check.website;
        delete check.instagram;
        delete check.snapchat;
        delete check.facebook;
    });
});

printjson(final);
print('-----------------------RESULTS------------------------------');
print(query.count() + ' Matched Spots');
print(final.length + ' Spots to check');
