// npm install --save mongodb-language-model
// npm i --save-dev @types/mongodb-language-model
// project.package.addDevDeps('mongodb-language-model');

const parse = require('mongodb-language-model');

/**
 * npx jest parser.test.ts
 */

describe('Parser', () => {
    test('parser', () => {

        const ast = parse('{"foo": "bar"}');
        console.log('!!!!!!!!!!!!!!!!!!!!!', ast);
        // assert.deepEqual(ast, {
        //     'pos': 'expression',
        //     'clauses': [
        //         {
        //             'pos': 'leaf-clause',
        //             'key': 'foo',
        //             'value': {
        //                 'pos': 'leaf-value',
        //                 'value': 'bar'
        //             }
        //         }
        //     ]
        // });
    });
});
