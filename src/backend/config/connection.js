require('dotenv').config()
const mongoose = require('mongoose');

const DEVDB = process.env.MONGO_LOCAL
const URI = process.env.MONGO_URI

const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

/* Dev */
// let connection = mongoose.connect(DEVDB, dbConfig);

/* Main */
let connection = mongoose.connect(URI, dbConfig);

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
    addedBy: { userId: Schema.Types.ObjectId, username: String},
    puzzleStatsID: Schema.Types.ObjectId,
    addedOn: { type: Date, default: Date.now }
})  

let UserStatsSchema = Schema({
    userID: Schema.Types.ObjectId,
    skillPoint: Number,
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
    userId: Schema.Types.ObjectId,
    puzzleId: Schema.Types.ObjectId,
    gameSize: Number,
    pattern: [Number],
    timeTaken: Date,
    isFavorite: Boolean,
    isFinished: Boolean,
    lastSession: Date
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
                {[Number]: [String, Date]}
            ]
        },
        
        {
            three: [
                {[Number]: [String, Date]}
            ]
        },

        {
            four: [
                {[Number]: [String, Date]}
            ]
        },

        {
            five: [
                {[Number]: [String, Date]}
            ]
        },

        {
            six: [
                {[Number]: [String, Date]}
            ]
        },

        {
            seven: [
                {[Number]: [String, Date]}
            ]
        },

        {
            eight: [
                {[Number]: [String, Date]}
            ]
        },

        {
            nine: [
                {[Number]: [String, Date]}
            ]
        },

        {
            ten: [
                {[Number]: [String, Date]}
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
module.exports.connection = { connection }
