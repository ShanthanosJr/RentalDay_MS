# RentalDay Server Setup

## MongoDB Connection Setup

### Option 1: Local MongoDB
1. Install MongoDB locally on your machine
2. Start the MongoDB service
3. The default connection string in `.env` will connect to `mongodb://localhost:27017/rentalday`

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Add your IP address to the network access list
5. Update the `MONGODB_URI` in your `.env` file with your cluster connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/rentalday?retryWrites=true&w=majority
```

### Environment Variables
Create a `.env` file in the server directory with the following:

```
MONGODB_URI=mongodb://localhost:27017/rentalday
```

## Running the Server
```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:5002`