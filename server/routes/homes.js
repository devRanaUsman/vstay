const express = require('express');
const multer = require('multer');
const path = require('path');
const Home = require('../models/Home');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/homes — list all homes
router.get('/', async (req, res) => {
    try {
        const homes = await Home.find().sort({ createdAt: -1 }).populate('hostId', 'firstName lastName');
        res.json(homes);
    } catch (err) {
        console.error('Get homes error:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: err.message,
            stack: err.stack 
        });
    }
});

// GET /api/homes/host/mine — list host's own homes
router.get('/host/mine', auth, async (req, res) => {
    try {
        const homes = await Home.find({ hostId: req.userId }).sort({ createdAt: -1 });
        res.json(homes);
    } catch (err) {
        console.error('Get host homes error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/homes/:id — get single home
router.get('/:id', async (req, res) => {
    try {
        const home = await Home.findById(req.params.id).populate('hostId', 'firstName lastName');
        if (!home) {
            return res.status(404).json({ message: 'Home not found' });
        }
        res.json(home);
    } catch (err) {
        console.error('Get home error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/homes — create home (host only)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.userType !== 'host') {
            return res.status(403).json({ message: 'Only hosts can add properties' });
        }

        const { name, location, price, rating, description, photo } = req.body;

        if (!name || !location || !price || !description) {
            return res.status(400).json({ message: 'Name, location, price, and description are required' });
        }

        const home = new Home({
            name,
            location,
            price: parseFloat(price),
            rating: parseFloat(rating) || 4.5,
            description,
            photo: photo || 'default',
            imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
            hostId: req.userId
        });

        await home.save();
        res.status(201).json(home);
    } catch (err) {
        console.error('Create home error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/homes/:id — update home (owner only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const home = await Home.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ message: 'Home not found' });
        }

        if (home.hostId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to edit this property' });
        }

        const { name, location, price, rating, description, photo } = req.body;

        home.name = name || home.name;
        home.location = location || home.location;
        home.price = price ? parseFloat(price) : home.price;
        home.rating = rating ? parseFloat(rating) : home.rating;
        home.description = description || home.description;
        home.photo = photo || home.photo;

        if (req.file) {
            home.imageUrl = `/uploads/${req.file.filename}`;
        }

        await home.save();
        res.json(home);
    } catch (err) {
        console.error('Update home error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/homes/:id — delete home (owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const home = await Home.findById(req.params.id);
        if (!home) {
            return res.status(404).json({ message: 'Home not found' });
        }

        if (home.hostId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }

        await Home.findByIdAndDelete(req.params.id);
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        console.error('Delete home error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
