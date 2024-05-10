const conn = new Mongo('localhost:27017');
const db = conn.getDB('carrelage');

const Clip = db.getCollection('clips');
const Media = db.getCollection('media');
const Profile = db.getCollection('profiles');
const Session = db.getCollection('sessions');

var matched = 0;
var processed = 0;

matched = Clip.find({ $and: [{ spot: { $exists: true } }, { spot: { $type: 'string' } }] }).count();
Clip.find({ $and: [{ spot: { $exists: true } }, { spot: { $type: 'string' } }] }).forEach(function(doc) {
    doc.spot = new ObjectId(doc.spot);
    Clip.save(doc);
    processed += 1;
});
print(matched + ' Clips matched.');
print(processed + ' Clips processed.');

matched = Media.find({ $and: [{ spot: { $exists: true } }, { spot: { $type: 'string' } }] }).count();
processed = 0;
Media.find({ $and: [{ spot: { $exists: true } }, { spot: { $type: 'string' } }] }).forEach(function(doc) {
    doc.spot = new ObjectId(doc.spot);
    Media.save(doc);
    processed += 1;
});
print(matched + ' Medias matched.');
print(processed + ' Medias processed.');

matched = Profile.find({
    $and: [{ spotsFollowing: { $not: { $size: 0 } } }, { spotsFollowing: { $type: 'string' } }],
}).count();
processed = 0;
Profile.find({ $and: [{ spotsFollowing: { $not: { $size: 0 } } }, { spotsFollowing: { $type: 'string' } }] }).forEach(
    function(doc) {
        var arr = doc.spotsFollowing;
        for (var i = 0; i < arr.length; i += 1) {
            var elt = arr[i];
            if (typeof elt === 'string') {
                arr[i] = new ObjectId(elt);
            }
        }
        Profile.update({ _id: doc._id }, { $set: { spotsFollowing: arr } });
        processed += 1;
    },
);
print(matched + ' Profiles matched.');
print(processed + ' Profiles processed.');

matched = Session.find({ $and: [{ spots: { $not: { $size: 0 } } }, { spots: { $type: 'string' } }] }).count();
processed = 0;
Session.find({ $and: [{ spots: { $not: { $size: 0 } } }, { spots: { $type: 'string' } }] }).forEach(function(doc) {
    var arr = doc.spots;
    for (var i = 0; i < arr.length; i += 1) {
        var elt = arr[i];
        if (typeof elt === 'string') {
            arr[i] = new ObjectId(elt);
        }
    }
    Session.update({ _id: doc._id }, { $set: { spots: arr } });
    processed += 1;
});
print(matched + ' Sessions matched.');
print(processed + ' Sessions processed.');
