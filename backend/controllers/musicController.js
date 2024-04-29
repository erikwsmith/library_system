const mongoose = require('mongoose');
const Music = require('../models/musicModel');

// retrieve all music
const getAllMusic = async( req, res ) => {
    const music = await Music.find({}).sort({});
    res.status(200).json(music);
};

// retrieve a single music record
const getMusic = async( req, res ) => {
    const music = await Music.findById(req.params.id);
    res.status(200).json(music);
};

// add a single music record
const addMusic = async( req, res) => {
    const {title, image, artists, format, genre, tracks, runtime, releaseDate, checkedOut, type, callNumber} = req.body;
    try {
        const music = await Music.create({title, image, artists, format, genre, tracks, runtime, releaseDate, checkedOut, type, callNumber});
        res.status(200).json(music);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};

// update an existing music record
const updateMusic = async( req, res ) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Music does not exist.'});
    };
    const music = await Music.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if(!music){
        return res.status(400).json({Error: 'Music does not exist.'});
    };
    res.status(200).json(music);
};

// delete an existing music record
const deleteMusic = async(req, res)=>{
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Music does not exist.'});
    };
    const music = await Music.findOneAndDelete({_id: id});
    if(!music){
        return res.status(400).json({Error: 'Music does not exist.'});
    };
    res.status(200).json(music);
}

module.exports = {
    getAllMusic,
    getMusic,
    addMusic,
    updateMusic,
    deleteMusic
}