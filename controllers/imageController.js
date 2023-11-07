const multer = require("multer");
const Image = require("../models/images");
const cloudinary = require("cloudinary").v2;

//GET IMAGES
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.render("index", { images });
  } catch (error) {
    res.status(500).json({ error: "Error fetching images" });
  }
};

//POST IMAGES
exports.uploadImage = (req, res) => {
  cloudinary.uploader
    .upload_stream({ resource_type: "image" }, async (error, result) => {
      if (error) {
        return res
          .status(400)
          .json({ error: "Error uploading the image to Cloudinary" });
      }

      try {
        const image = new Image({
          url: result.secure_url,
          public_id: result.public_id,
        });
        await image.save();
        res.redirect("/");
      } catch (error) {
        res.status(500).json({ error: "Error saving image details" });
      }
    })
    .end(req.file.buffer);
};

//DELTE IMAGES
exports.deleteImage = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const image = await Image.findById(id);
    console.log(image);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    const result = await cloudinary.uploader.destroy(image.public_id);
    console.log(result);
    if (result.result !== "ok") {
      return res
        .status(500)
        .json({ error: "Error deleting the image from Cloudinary" });
    }
    await Image.deleteOne({ _id: id });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Error deleting the image" });
  }
};

//UPDATE IMAGES
exports.updateImage = async (req, res) => {
    const id = req.params.id; // Get the ID of the image to update
  
    // Use multer middleware to handle file upload for the new image
    const upload = multer().single('newImage'); // 'newImage' should match the name attribute in your HTML form
    upload(req, res, async (uploadError) => {
      if (uploadError) {
        return res.status(400).json({ error: 'Error uploading the new image' });
      }
  
      try {
        const imageToUpdate = await Image.findById(id);
        if (!imageToUpdate) {
          return res.status(404).json({ error: 'Image not found' });
        }
  
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
  
        // Update the image details
        imageToUpdate.url = result.secure_url;
        imageToUpdate.public_id = result.public_id;
        await imageToUpdate.save();
  
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(imageToUpdate.public_id);
  
        // Redirect to the homepage or display a success message
        res.redirect('/');
      } catch (error) {
        res.status(500).json({ error: 'Error updating the image' });
      }
    });
  };
  