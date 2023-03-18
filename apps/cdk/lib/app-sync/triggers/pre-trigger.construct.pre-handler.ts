import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

exports.handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`org Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`org Context: ${JSON.stringify(context, null, 2)}`);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'hello world'
        })
    };
};

// exports.handler = async (event: any) => {
//     console.log('well this worked!');
// };

// export const lambdaHandler = async (event: any, context: Context):Promise<APIGatewayProxyResult> => {
//     console.log('well this worked five!');
//     return {
//         statusCode: 200,
//         body: JSON.stringify({
//             message: 'hello world',
//         }),
//     };
//   };