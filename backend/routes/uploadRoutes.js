import path from 'path';
import express from 'express';
import multer from 'multer';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const uploadSingleImage = upload.single('image');

uploadRouter.post('/', (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: 'Image uploaded successfully',
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: 'No image uploaded' });
    }
  });
});

export default uploadRouter;
