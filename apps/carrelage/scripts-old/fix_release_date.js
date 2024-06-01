const conn = new Mongo('localhost:27017');
const db = conn.getDB('carrelage');

const Media = db.getCollection('media');

var res;
res = Media.update(
    { releaseDate: ISODate('2017-11-03T16:42:37.131Z') },
    { $unset: { releaseDate: '' } },
    { multi: true },
);
printjson(res);

res = Media.update(
    { releaseDate: { $exists: true }, addedBy: { $ne: 'donaldduck' } },
    { $unset: { releaseDate: '' } },
    { multi: true },
);
printjson(res);

count = 0;
Media.find({ releaseDate: { $exists: true } }).forEach(function(media) {
    res = Media.update({ _id: media._id }, { $set: { createdAt: media.releaseDate } });
    count += res.nModified;
});

print(count + ' Medias updated');
