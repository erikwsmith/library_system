const mongoose = require('mongoose');
const Movie = require('../models/movieModel');

// retrieve all movies
const getMovies = async( req, res ) => {
    const movies = await Movie.find({}).sort({});
    res.status(200).json(movies);
};

// retrieve a single movie
const getMovie = async( req, res ) => {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
};

// add a single movie
const addMovie = async( req, res) => {
    const {title, image, format, runtime, releaseDate, rating, checkedOut, type} = req.body;
    try {
        const movie = await Movie.create({title, image, format, runtime, releaseDate, rating, checkedOut, type});
        res.status(200).json(movie);
    } catch (error){
        res.status(400).json({Error: error.message})
    };
};
// update an existing movie
const updateMovie = async( req, res ) => {
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Movie does not exist.'});
    };
    const movie = await Movie.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if(!movie){
        return res.status(400).json({Error: 'Movie does not exist.'});
    };
    res.status(200).json(movie);
};
// delete an existing movie
const deleteMovie = async(req, res)=>{
    const{id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({Error: 'Movie does not exist.'});
    };
    const movie = await Movie.findOneAndDelete({_id: id});
    if(!movie){
        return res.status(400).json({Error: 'Movie does not exist.'});
    };
    res.status(200).json(movie);
}
module.exports = {
    getMovies,
    getMovie,
    addMovie,
    updateMovie,
    deleteMovie
}