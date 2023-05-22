const Post = require('../Models/post.model');

module.exports = {
    list: (req, res, next) => {
        Post.find().then(posts => {
            return res.status(200).json(posts);
        }).catch(next);
    },
    info: (req, res, next) => {
        const { id } = req.params;

        Post.findById(id).then(post => {
            if (post) {
                return res.json(post);
            } else {
                return res.status(400).json({error: 'post not found.'});
            }
        }).catch(next);
    },
    add: (req, res, next) => {
        const { text, title} =  req.body;
        Post.create({
            text,
            title
        }).then(post => {
            return res.status(201).json(post);
        }).catch(next);
    },
    update: (req, res, next) => {
        const { id } = req.params;

        Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).then(post => {
            if (post) {
                return res.json(post);
            } else {
                return res.status(404).json({error: 'post not found.'});
            }
        }).catch(next);        
    },
    delete: (req, res, next) => {
        const { id } = req.params;

        Post.findByIdAndDelete(id, req.body, { new: true}).then(post => {
            if (post) {
                return res.status(204).send();
            } else {
                return res.status(404).json({error: 'post not found.'});
            }
        }).catch(next);
    }
};