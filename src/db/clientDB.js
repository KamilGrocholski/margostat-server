import mongoose from 'mongoose'

const clientDB = async (URI) => {
    await mongoose
        .connect(URI)
        .then(() => {
            console.log('>> Połączono z bazą danych.')
        })
        .catch(err => {
            console.log(err)
        })
}

export default clientDB