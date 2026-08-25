import { Client, Databases, ID, Query } from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const TABLE_NAME = import.meta.env.VITE_APPWRITE_TABLE_NAME
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
    //1. check appwrite if the search already exists in the database
        // a. if it does ExecutionStatus, update the Count
        // b. if it doesn,t create a new record with the search term and count as 1.
    console.log(PROJECT_ID, DATABASE_ID, TABLE_NAME);

    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, [
            Query.equal('searchTerm', searchTerm),
        ])
        //2. If it does, update the count
        if(result.documents.length > 0) {
            const doc = result.documents[0]
            await database.updateDocument(DATABASE_ID, TABLE_NAME, doc.$id, {
                count: doc.count + 1,
            })
        // 3. If it doesn't, create a new record with the search term and count as 1 a
        }else {
            await database.createDocument(DATABASE_ID, TABLE_NAME, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch(error) {
        console.error(error)
    }
}

export const getTrendingMovies = async () => {
    try{
        const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, [
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents;
    }catch(error){
        console.error(error)
    }
}