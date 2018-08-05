const multer = require('multer');
const fs = require('fs');

function _isSupportedFile(file) {
  var names = file.split('.');
  var extension = names[names.length - 1];
  return  extension === 'wav' || extension === 'jar';
}

function _isImageFile(file) {
  var names = file.split('.');
  var images = ['jpg','gif','png'];
  return images.includes(names[names.length - 1]);
}

module.exports = function(app){

  var getUploader = function(type) {
    return {
      destination: function(req, file, cb) {
        var dir = __dirname + '/../../../uploads/' + type;

        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
        cb(null, dir);
      },
      filename : async function (req, file, cb) {

        try {
          var newFile = new app.models.File({
            name: file.originalname,
            type: type,
            userId: req.user.id,
            file: file
          });
          newFile.uid = newFile.getUid(req.user, file.originalname);
          newFile.userId = req.user.id;

          if (!_isSupportedFile(file.originalname)) {
            cb(new Error('Seul les fichiers wav sont supportés par la plateforme'));
            return;
          }

          newFile = await newFile.save();
          req.uid = newFile.uid;
          cb(null, newFile.uid);
        } catch (ex) {
          cb(ex);
        }
      }
    }
  };


  var uploaderMusic = getUploader('music');
  var uploaderImage = getUploader('image');
  uploaderMusic.filename = async function (req, file, cb) {
    try {

      if (!_isSupportedFile(file.originalname)) {
        cb(new Error('Seul les fichiers wav sont supportés par la plateforme'));
        return;
      }
      var sounds = JSON.parse(req.headers.sounds);

      var newMusic = new app.models.Music({
        name: req.headers.name,
        soundsIds: sounds
      });

      newMusic.userId = req.user.id;

      var newFile = new app.models.File({
        name: file.originalname,
        type: 'music',
        userId: req.user.id,
        file: file,
      });
      newFile.uid = newFile.getUid(req.user, file.originalname);

      newFile = await newFile.save();

      newMusic.soundId = newFile.id;
      await newMusic.save();

      cb(null, newFile.uid);
    } catch (ex) {
      cb(ex);
    }
  };

  uploaderImage.filename = async function (req, file, cb) {
    try {

      if (!_isImageFile(file.originalname)) {
        cb(new Error('Seul les fichiers images jpg, gif et png  sont supportés par la plateforme'));
        return;
      }

      var newFile = new app.models.File({
        name: file.originalname,
        type: 'image',
        userId: req.user.id,
        file: file,
      });
      newFile.uid = newFile.getUid(req.user, file.originalname);
      newFile = await newFile.save();
      req.uid = newFile.uid;
      cb(null, newFile.uid);
    } catch (ex) {
      cb(ex);
    }
  };

  var storageSound = multer.diskStorage(getUploader('sound'));
  var storageMusic = multer.diskStorage(uploaderMusic);
  var storageImage = multer.diskStorage(uploaderImage);
  var storagePlugin = multer.diskStorage(getUploader('plugin'));

  return{
    sound: multer({storage: storageSound}),
    music: multer({storage: storageMusic}),
    image: multer({storage: storageImage}),
    plugin: multer({storage: storagePlugin}),
  }
};
