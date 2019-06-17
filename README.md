# How to use Near Home
1. Allow the browser to access your current location
2. Browser will display nearby hotels
3. Input your name, id and select any hotel and click book
4. Once you see notification on the right, booking is successfully made

## To run locally
# Frontend (./client)
1. Create .env file at client folder
1-1. INCLUDE `REACT_APP_HERE_APP_ID={YOUR_HERE_API_ID}` 
1-2. INCLUDE `REACT_APP_HERE_APP_CODE={YOUR_HERE_API_CODE}`

# Backend (./server)
1. Create new user using the following commands after accessing mysql with root
1-1. `CREATE USER 'nearhome'@'localhost' IDENTIFIED BY 'nearhome';`
1-2. `GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';`
1-3. `ALTER USER 'nearhome'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nearhome';`
1-4. `flush privileges;`

2. Setup database using following command at root folder
2-1. `npm run setupDB` or `yarn run setupDB`

# Stack
MERN: MySQL, ExpressJS, React and NodeJS