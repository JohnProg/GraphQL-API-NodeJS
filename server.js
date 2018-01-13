import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import mongoose from 'mongoose';
import { ip, port } from './config';
import models from './models';

mongoose.Promise = global.Promise;
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
app.use(cors({
  origin: [`http://${ip}:${port}/`],
}));

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      models,
      SECRET: 123,
      user: {
        _id: 1,
        username: 'john',
      },
    },
  }),
);
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

mongoose
  .connect('mongodb://localhost:27017/test', {
    useMongoClient: true,
  })
  .then(() => {
    app.listen(port, (err) => {
      if (err) throw err;
      console.log(`GraphQL Server is running on http://${ip}:${port}/`);
    });
  });
