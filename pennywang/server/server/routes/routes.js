const passport = require('passport');
const path = require('path')
const dotenv = require('dotenv');
const multer = require('multer')
dotenv.config();
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

const usersDB = require('../models/user-schema')
const cards = require('../models/card-schema')
const favorite = require('../models/favorite-schema')
const upload = multer({
    dest: './uploads/'
})

module.exports = function (server) {
    server.post('/chkUsername', (req, res) => {

        usersDB.findOne({
            username: req.body.params.username
        }, function (err, email) {
            if (err)
                res.send('Email already exists')

            else {
                res.send(email)
            }
        });

    })
    server.get('/cards', (req, res) => {
        cards.find({}, (err, cards) => {
            if (err) {
                res.send(err)
            } else {
                res.send(cards)
            }
        })
    })

    server.post('/getCardData', (req, res) => {
        cards.findById(req.body.id, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                res.send(data)
            }
        })
    })
    server.post('/createAccount', upload.single('ProfilePic'), async (req, res, next) => {
        try {
            //saving image to cloudinary
            const result = await cloudinary.v2.uploader.upload(req.file.path)
            let newUser = new usersDB({
                username: req.body.username,
                password: req.body.password,
                imgUrl: result.secure_url
            });
            let newFavorite = new favorite({
                username: req.body.username
            })

            newUser.save((err, user) => {
                if (err) {

                    res.send({
                        status: 400,
                        success: false
                    })
                }
                if (user) {

                    res.send({
                        status: 200,
                        success: true
                    })
                }
            });
            newFavorite.save((err, success) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log('saved')
                }
            })
        } catch (error) {
            console.log(error);
        }

    })
    server.post('/addFavorite', (req, res) => {
        
        favorite.findOneAndUpdate({username: req.user.username}, {
            $push: {
                favorite: {
                    img: req.body.img,
                    cardId: req.body.imgId
                }
            }
        },(err, success) => {
            if(err){
                res.send(err)
            }
            else{
                res.send(success)
            }
        })
    })
    server.post('/removeFavorite', (req, res) => {
        favorite.findOneAndUpdate({username: req.user.username}, {
            $pull: {
                favorite: {
                    img: req.body.img,
                    imdId: req.body.imgId
                }
            }
        },(err, success) => {
            if(err){
                res.send(err)
            }
            else{
                res.send(success)
            }
        })
    })
    server.get('/getFavorite', (req, res) => {
        favorite.findOne({
            username: req.user.username
        }, (err, cards) => {
            if (err) {
                res.send(err)
            } else {
                res.send(cards)
            }
        })
    })
    server.post('/saveComment', (req, res) => {

        cards.findByIdAndUpdate(
            req.body.id, {
            $push: {
                comments: {
                    comment: req.body.comment,
                    date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                    img: req.user.imgUrl,
                    username: req.body.username
                }
            }
        },
            function (error) {
                if (error) {
                    res.send(error);
                } else {
                    res.send({
                        success: true,
                        message: 'comment saved successfully'
                    })
                }
            });
    })
    server.post('/saveRating', (req, res) => {

        cards.findByIdAndUpdate(
            req.body.id, {
            $addToSet: {
                ratings: {
                    rating: req.body.rating,
                    username: req.body.username
                }
            }
        },
            function (error, data) {
                if (error) {
                    res.send(error);
                } else {
                    res.send({
                        success: true,
                        message: 'rating saved successfully',
                        data: data
                    })
                }
            });
    })
    server.post('/searchCard', (req, res) => {
        
        cards.find({
            name: req.body.keyword
        }, (err, cards) => {
            if(err){
                res.send(err)
            }
            else{
                res.send(cards)
            }
        })
    })
    server.post('/searchCardByType', (req, res) => {
        
        cards.find({
            type: req.body.keyword
        }, (err, cards) => {
            if(err){
                res.send(err)
            }
            else{
                res.send(cards)
            }
        })
    })
    server.get('/', (req, res) => {
        if (req.user) {
            res.redirect('/dashboard')
        } else {
            res.sendFile(path.join(__dirname, '../../build/index.html'))
        }
    })

    server.get('/login', (req, res) => {
        if (req.user) {
            res.redirect('/dashboard')
        } else {
            res.sendFile(path.join(__dirname, '../../build/index.html'))
        }
    })
    server.get('/updatePassword', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build/index.html'))
    })
    server.get('/signup', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build/index.html'))
    })
    server.get('/cards/:id', (req, res) => {
        res.sendFile(path.join(__dirname, '../../build/index.html'))
    })

    server.post('/authUser', passport.authenticate('local'), function (req, res) {
        if (req.user) {
            res.send({
                statusCode: 200,
                success: true,
                status: 'authorized'
            })

        } else {
            res.sendStatus(401)
        }

    });

    function loggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login')
        }
    }

    server.get('/dashboard', loggedIn, function (req, res) {

        res.sendFile(path.join(__dirname, '../../build/index.html'))

    });

    server.post('/changePass', (req, res) => {

        if (req.user) {

            usersDB.findOneAndUpdate({
                _id: req.user.id
            }, {
                $set: {
                    password: req.body.newPass
                }
            }, {
                new: true
            }).then((docs) => {
                if (docs) {
                    const data = {
                        response: [200,
                            "password changed"
                        ]
                    }
                    res.json(data)

                } else {
                    reject({
                        success: false,
                        data: "no such user exist"
                    });
                }
            }).catch((err) => {

                res.send(err)
            })

        }
    })


    //logout request handler
    server.post('/logoutUser', (req, res) => {
        // req.session.destroy(function (err) {
        req.logout();
        res.sendStatus(204);
        // });

    })
    //userInfo

    server.get('/getUserInfo', (req, res) => {
        if (req.user) {
            res.json(req.user)
        } else {
            res.redirect("/")
        }
    })
}