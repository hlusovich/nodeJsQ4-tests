const configValidator = require('./validators/configValidator');
const errorHandler = require('./handlers/errorHandler');
const createReadStream = require('./streams/createReadStream');
const createWriteStream = require('./streams/createWriteStream');
const configParser = require('./optionsParsers/configParser');
const inputParser = require('./optionsParsers/inputParsers');
const outputParser = require('./optionsParsers/outputParses');
const optionValidator = require('./validators/optionsValidator');
const readPermissionValidator = require('./validators/readPermissionValidator');
const isFileValidator = require('./validators/isFileValidator');
const MyError = require('./myError/MyError');
const chainStreams = require("./streams/chainStreams");
const writePermissionValidator = require('./validators/writePermissionValidator');
const runApp = () => {
    try {
        optionValidator();
        const config = configParser();
        if (!config) {
            throw  new MyError("Option config is required");
        }
        if (!configValidator(config)) {
            throw  new MyError("Config isn't correct. Please check all encoder's names.");
        }
        const input = inputParser();
        const output = outputParser();
        if (input) {
            isFileValidator(input);
            readPermissionValidator(input);

        }
        if (output) {
            writePermissionValidator(output);
            isFileValidator(output);
        }
        return chainStreams(createReadStream(input), createWriteStream(output), config);
    } catch (e) {
        errorHandler(e);
    }
};

module.exports = runApp();
