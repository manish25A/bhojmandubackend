const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './images/uploads');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const fileFilter = function (req, file, cb) {
	if (
		file.mimetype == 'image/png' ||
		file.mimetype == 'image/jpg' ||
		file.mimetype == 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
		return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
	}
};

let obj = {
	storage: storage,
	limits: {
		fileSize: 7340032,
	},
	fileFilter: fileFilter,
};
const upload = multer().single('file');

fileUpload = (req, res) => {
	upload(req, res, function (err) {
		if (err) {
			res.status(500);
			if ((err.code = 'Limit file size')) {
				err.message = 'file size too large, only under 200kb is allowed.';
				err.success = false;
			}
			return res.json(err);
		} else {
			if (!req.file) {
				res.status(500);

				res.json('file not found');
			}
			res.status(200);
		res.json({
				success: true,
				message: 'File uploaded ',
			});
		}
	});
};

module.exports = fileUpload;
