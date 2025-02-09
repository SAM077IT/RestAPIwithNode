const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId).then(user => {
        if (!user) {
            const error = new Error("Could not find the user!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: "Got the user status", status: user.status })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateUserStatus = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed at server end!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const updatedStatus = req.body.status;
    User.findById(req.userId).then(user => {
        if (!user) {
            const error = new Error("Could not find the user!");
            error.statusCode = 404;
            throw error;
        }
        user.status = updatedStatus;
        return user.save();
    }).then(result => {
        console.log(result);
        res.status(201).json({ message: "The user status updated" });
    })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed at server end!");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 8).then(hashedPw => {
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });
        return user.save();
    }).then(result => {
        res.status(201).json({ message: "New User added!", userId: result._id })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            const error = new Error("User does not exist!, please try again.");
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error("Wrong password!");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, "somesupersecretsecret", { expiresIn: "1h" });
        res.status(200).json({ token: token, userId: loadedUser._id.toString() })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}