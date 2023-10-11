const https = require("https");
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { default: axios } = require("axios");
const httpsAgent = new https.Agent({rejectUnauthorized:false});

async function startServer(){

    const app = express();
    const PORT = Number(process.env.PORT) || 3000;

    const apolloServer = new ApolloServer({
        typeDefs:`
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                webstie: String!
            }
            type Todo{
                id: ID!
                title: String!
                comleted: Boolean
                user: User
            }

            type Query{
                getTodo: [Todo],
                getAllUsers: [User],
                getUser(id: ID!): User,
                hello: String,
                say(name: String): String
            }
        `,
        resolvers:{
            Todo:{
                user: async (todo: any) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`,{httpsAgent})).data
            },
            Query:{
                getTodo: async() => (await axios.get(`https://jsonplaceholder.typicode.com/todos`,{httpsAgent})).data,
                getAllUsers: async () => (await axios.get(`https://jsonplaceholder.typicode.com/users`,{httpsAgent})).data,
                getUser: async () => (await axios.get(`https://jsonplaceholder.typicode.com/users${id}`, httpsAgent)).data,
                hello: ()=> "Your welcome in graphQl",
                say: (_: any, {name}: {name: string})=> `Hey ${name}, How are you?`
            }
        }
    });

    app.use(express.json());
    app.use(cors());
    await apolloServer.start();
    app.use("/graphql", expressMiddleware(apolloServer));

    app.listen(PORT, ()=>{
        console.log(`Server run on ${PORT} port`);
    });
}