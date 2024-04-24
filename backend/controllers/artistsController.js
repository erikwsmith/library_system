const mongoose = require('mongoose');
const Artist = require('../models/artistModel');

// retrieve all artists
const getArtists = async( req, res ) => {
    const artists = await Artist.find({}).sort({});
    res.status(200).json(artists);
};
// retrieve a single artist
const getArtist = async( req, res ) => {
    const artist = await Artist.findById(req.params.id);
    res.status(200).json(artist);
};
// add a single artist
const addArtist = async( req, res) => {
    const {first_name, middle_name, last_name, full_name, group_name, biography} = req.body;
    try {
        const artist = await Artist.create({first_name, middle_name, last_name, full_name, group_name, biography});
        res.status(200).json(artist);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};
// update an existing artist
const updateArtist = async( req, res ) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Artist does not exist.'});
    };
    const artist = await Artist.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if(!artist){
        return res.status(400).json({Error: 'Artist does not exist.'});
    };
    res.status(200).json(artist);
};
// delete an existing artist
const deleteArtist = async(req, res)=>{
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Artist does not exist.'});
    };
    const artist = await Artist.findOneAndDelete({_id: id});
    if(!artist){
        return res.status(400).json({Error: 'Artist does not exist.'});
    };
    res.status(200).json(artist);
}

module.exports = {
    getArtists,
    getArtist,
    addArtist,
    updateArtist,
    deleteArtist
}
