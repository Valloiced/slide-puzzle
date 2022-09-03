const mongoose = require('mongoose');

/** Model **/

const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: String,
    profileImg: Buffer,
    UserStatsID: Schema.Types.ObjectId,
    joinedOn: { type: Date, default: Date.now }
})

const UserStatsSchema = Schema({
    userID: Schema.Types.ObjectId,
    skillPoint: Number,
    numOfPuzzlesCreated: Number,
    numOfPuzzlesSolved: Number,
    bestTime: Number,
    playTime: Number,
    favoritesID: Schema.Types.ObjectId,
    numOfPiecesFinishedByGameSizes: {
        "2x2": Number,
        "3x3": Number,
        "4x4": Number,
        "5x5": Number,
        "6x6": Number,
        "7x7": Number,
        "8x8": Number,
        "9x9": Number,
        "10x10": Number,
    },
    bestTimeByGameSizes: {
        "2x2": Number,
        "3x3": Number,
        "4x4": Number,
        "5x5": Number,
        "6x6": Number,
        "7x7": Number,
        "8x8": Number,
        "9x9": Number,
        "10x10": Number,
    }
})


const UserPuzzleSchema = Schema({
    isGuest: Boolean,
    userID: Schema.Types.ObjectId,
    puzzleID: Schema.Types.ObjectId,
    gameSize: Number,
    pattern: [Number],
    timeTaken: Number,
    isFinished: Boolean,
    ranking: Number,
    lastSession: { type: Date, default: Date.now }
})

const PuzzleSchema = Schema({
    puzzleName: { type: String, required: true },
    image: { type: Buffer, required: true },
    description: String,
    addedBy: { userID: Schema.Types.ObjectId, username: String},
    addedOn: { type: Date, default: Date.now },
    puzzleStatsID: Schema.Types.ObjectId
})  


const PuzzleStatsSchema = Schema({
    puzzleID: Schema.Types.ObjectId,
    numOfPlayersPlayed: Number,
    numOfPlayersFinished: Number,
    leaderboardID: Schema.Types.ObjectId
})

const FavoritesSchema = Schema({
    userStatsID: Schema.Types.ObjectId,
    numOfFavorites: Number,
    favoritePuzzles: [Schema.Types.ObjectId]
})

const PuzzleLeaderboardSchema = Schema({
    puzzleID: Schema.Types.ObjectId,
    gameSize: {
        "2x2": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "3x3": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "4x4": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "5x5": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "6x6": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "7x7": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "8x8": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "9x9": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ],

        "10x10": [
            {
                rank: Number,
                username: { type: String, required: true },
                skillPoint: { type: Number, required: true },
                timeTaken: String,
                mods: Object
            }
        ]
    }
})

const User              = mongoose.model('User', UserSchema);
const UserStats         = mongoose.model('UserStats', UserStatsSchema)
const UserGameSession   = mongoose.model('UserGameSession', UserPuzzleSchema)
const Puzzle            = mongoose.model('Puzzle', PuzzleSchema)
const PuzzleStats       = mongoose.model('PuzzleStats', PuzzleStatsSchema)
const PuzzleLeaderboard = mongoose.model('PuzzleLeaderboard', PuzzleLeaderboardSchema)
const Favorites         = mongoose.model('Favorites', FavoritesSchema)

module.exports.collections = { User, UserStats, UserGameSession, Puzzle, PuzzleStats, PuzzleLeaderboard, Favorites}