const cloudinary = require('cloudinary').v2;
const Media = require('../models/Media');

module.exports = {
  showMedia: async (req, res) => {
    try {
      const media = await Media.find({});
      res.render('index', { media });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching media');
    }
  },

  uploadMedia: async (req, res) => {
    try {
      const promises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            (result) => {
              const media = new Media({
                title: result.original_filename || 'Untitled',
                url: result.url,
              });
              media.save((err, savedMedia) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(savedMedia);
                }
              });
            },
            { resource_type: 'auto' }
          ).end(file.buffer);
        });
      });

      await Promise.all(promises);
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading media');
    }
  },

  deleteMedia: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMedia = await Media.findByIdAndRemove(id);

      // You can add a call to delete the media from Cloudinary here if needed

      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting media');
    }
  },
};
