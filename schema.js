const { GraphQLObjectType, GraphQLInt,
    GraphQLSchema, GraphQLString,
    GraphQLNonNull, GraphQLList } = require( 'graphql' );
const Axios = require('axios')
/*
const Customers = [
    {id:'1',name:'John Doe', email:'john@hotmail.com', age:20},
    {id:'2',name:'Steve Smith', email:'steve@hotmail.com', age:80},
    {id:'3',name:'Sara lanson', email:'sara@hotmail.com', age:28},
]
*/

//CustomerType
const CustomerType = new GraphQLObjectType( {
    name: 'Customer',
    fields: () => ( {
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt},
    })
})


//Root Query
const RootQuery = new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLString }
            },
            resolve( parentValue, args ) {
                return Axios.get( `http://localhost:3000/customers/${ args.id }` )
                    .then( res => res.data )
            }
        },
        customers: {
            type: new GraphQLList( CustomerType ),
            resolve( parentValue, args ) {
                return Axios.get( 'http://localhost:3000/customers' )
                    .then( res => res.data )
            }
        }
    }
   
} );

const mutation = new GraphQLObjectType( {
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name:{type: new GraphQLNonNull(GraphQLString)},
                email:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args) {
                return Axios.post( 'http://localhost:3000/customers',args )
                    .then( res => res.data )
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLString)},
                
            },
            resolve(parentValue, args) {
                return Axios.delete( `http://localhost:3000/customers/${args.id}`, )
                    .then( res => res.data )
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLString)},
                name:{type: GraphQLString},
                email:{type: GraphQLString},
                age:{type: GraphQLInt}
            },
            resolve(parentValue, args) {
                return Axios.patch( `http://localhost:3000/customers/${args.id}`,args )
                    .then( res => res.data )
            }
        }
    }
})



module.exports = new GraphQLSchema( {
    query: RootQuery,
    mutation
})