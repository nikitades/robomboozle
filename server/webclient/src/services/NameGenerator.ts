import { uniqueNamesGenerator, adjectives, colors, animals, Config } from 'unique-names-generator';

const customConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 2,
};

export default uniqueNamesGenerator.bind(null, customConfig);