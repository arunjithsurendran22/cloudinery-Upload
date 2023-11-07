const Image = require('../models/images');
const cloudinary = require('cloudinary').v2;

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.render('index', { images });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching images' });
  }
};

exports.uploadImage = (req, res) => {
  cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
    if (error) {
      return res.status(400).json({ error: 'Error uploading the image to Cloudinary' });
    }

    try {
      const image = new Image({
        url: result.secure_url,
        public_id: result.public_id,
      });
      await image.save();
      res.redirect('/');
    } catch (error) {
      res.status(500).json({ error: 'Error saving image details' });
    }
  }).end(req.file.buffer);
};

exports.deleteImage = async (req, res) => {
  const id = req.params.id;
  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    await cloudinary.uploader.destroy(image.public_id);
    await image.remove();
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the image' });
  }
};
