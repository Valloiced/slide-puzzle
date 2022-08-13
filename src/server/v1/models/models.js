const mongoose = require('mongoose');

/** Model **/

const Schema = mongoose.Schema;

let UserSchema = Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: String,
    profileImg: Buffer,
    UserStatsID: Schema.Types.ObjectId,
    joinedOn: { type: Date, default: Date.now }
})

let PuzzleSchema = Schema({
    puzzleName: { type: String, required: true },
    image: { type: Buffer, required: true },
    description: String,
    addedBy: { userID: Schema.Types.ObjectId, username: String},
    addedOn: { type: Date, default: Date.now },
    puzzleStatsID: Schema.Types.ObjectId
})  

let UserStatsSchema = Schema({
    userID: Schema.Types.ObjectId,
    skillPoint: Number,
    numOfPuzzlesCreated: Number,
    numOfPuzzlesSolved: Number,
    bestTime: Number,
    numOfFavorites: Number,
    numOfPiecesFinishedByGameSizes: [
        {two: Number},
        {three: Number},
        {four: Number},
        {five: Number},
        {six: Number},
        {seven: Number},
        {eight: Number},
        {nine: Number},
        {ten: Number}
    ]
})

let UserPuzzleSchema = Schema({
    isGuest: Boolean,
    userID: Schema.Types.ObjectId,
    puzzleID: Schema.Types.ObjectId,
    gameSize: Number,
    pattern: [Number],
    timeTaken: Number,
    isFavorite: Boolean,
    isFinished: Boolean,
    lastSession: { type: Date, default: Date.now }
})

let PuzzleStatsSchema = Schema({
    puzzleID: Schema.Types.ObjectId,
    numOfPlayersPlayed: Number,
    numOfPlayersFinished: Number,
    leaderboardID: Schema.Types.ObjectId
})

let PuzzleLeaderboardSchema = Schema({
    puzzleID: Schema.Types.ObjectId,
    gameSize: [
        {
            two: [
                {[Number]: [String, Number]}
            ]
        },
        
        {
            three: [
                {[Number]: [String, Number]}
            ]
        },

        {
            four: [
                {[Number]: [String, Number]}
            ]
        },

        {
            five: [
                {[Number]: [String, Number]}
            ]
        },

        {
            six: [
                {[Number]: [String, Number]}
            ]
        },

        {
            seven: [
                {[Number]: [String, Number]}
            ]
        },

        {
            eight: [
                {[Number]: [String, Number]}
            ]
        },

        {
            nine: [
                {[Number]: [String, Number]}
            ]
        },

        {
            ten: [
                {[Number]: [String, Number]}
            ]
        }
    ]
})

const User              = mongoose.model('User', UserSchema);
const Puzzle            = mongoose.model('Puzzle', PuzzleSchema)
const UserGameSession   = mongoose.model('UserGameSession', UserPuzzleSchema)
const PuzzleStats       = mongoose.model('PuzzleStats', PuzzleStatsSchema)
const UserStats         = mongoose.model('UserStats', UserStatsSchema)
const PuzzleLeaderboard = mongoose.model('PuzzleLeaderboard', PuzzleLeaderboardSchema)

module.exports.collections = { User, Puzzle, UserGameSession, PuzzleStats, UserStats, PuzzleLeaderboard}