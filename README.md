## ***Neighbourly***
    
  Neighbourly is a local community platform to help neighbors connect and share updates easily.

## demo

https://youtu.be/vb7d1-lfE3U?si=LeTMSNDW33cqTY_v

## Run Locally

1. Go to the backend folder:

```bash
cd backend
```

2. Create a `.env` file and add your environment variables like this:

```
MONGODB_URI=your_mongodb_connection_string  
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  
ACCESS_TOKEN_SECRET=your_access_token_secret  
ACCESS_TOKEN_EXPIRY=3d  
REFRESH_TOKEN_SECRET=your_refresh_token_secret  
REFRESH_TOKEN_EXPIRY=15d  
CORS_ORIGIN=*
```

3. Install backend dependencies:

```bash
npm install
```

4. Go back and then to the frontend folder:

```bash
cd ..
cd frontend
```

5. Install frontend dependencies:

```bash
npm install
```

6. Run the frontend development server:

```bash
npm run dev
```

