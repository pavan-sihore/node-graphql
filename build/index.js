"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const https = require("https");
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { default: axios } = require("axios");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express();
        const PORT = Number(process.env.PORT) || 3000;
        const apolloServer = new ApolloServer({
            typeDefs: `
            type Query{
                hello: String,
                say(name: String): String
            }
        `,
            resolvers: {
                Query: {
                    hello: () => "Your welcome in graphQl",
                    say: (_, { name }) => `Hey ${name}, How are you?`
                }
            }
        });
        app.use(express.json());
        app.use(cors());
        yield apolloServer.start();
        app.use("/graphql", expressMiddleware(apolloServer));
    });
}
