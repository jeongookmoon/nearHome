![](NearHomeDemo.gif)

# How to use Near Home
1. Allow the browser to access your current location
2. Browser will display nearby hotels
3. Input your name, id and select any hotel and click book
4. Once you see notification on the right, booking is successfully made
5. If user name doesn't match with existing User Id, booking can not be completed.
6. Booking can be searched by either property id or user id
7. Search result will appear as table if exists
7. Search API can be tested via Postman 
( localhost:3333, api/properties/:property_id/bookings, api/users/:user_id/bookings )

## To run locally
# Frontend (./client)
1. Create .env file at client folder
2. INCLUDE `REACT_APP_HERE_APP_ID={YOUR_HERE_API_ID}` at .env
3. INCLUDE `REACT_APP_HERE_APP_CODE={YOUR_HERE_API_CODE}` at .env
4. To lunch `yarn run start` or `npm run start` at client folder
6. Alternatively, `yarn run client` or `npm run client` at root folder

# Backend (./server)
1. Create new user using the following commands after accessing mysql with root
2. `CREATE USER 'nearhome'@'localhost' IDENTIFIED BY 'nearhome';`
3. `GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';`
4. `ALTER USER 'nearhome'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nearhome';`
5. `flush privileges;`
6. Setup database using following command at root folder
7. `npm run setupDB` or `yarn run setupDB`
8. To lunch `yarn run start` or `npm run start` at server folder
9. Alternatively, `yarn run server` or `npm run server` at root folder

# Stack
MERN: MySQL, ExpressJS, React and NodeJS
UI: Ant Design