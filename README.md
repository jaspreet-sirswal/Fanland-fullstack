## Implementation of Fanland
Project Fanland is a piece of work to showcase my full-stack development skills. The project's tech stack includes a React.js frontend, a back-end server in Django, and a socket.io server to support the RTC inside the app. The user's data is stored in a Postgres database.

Fanland is a dynamic SPA with multiple features improvising the UX.
The beautiful UI dark theme is used to achieve the attraction of the user. The back-end uses Django's built-in packages, including **django-rest-framework** and **django-cors** to make a **REST-ful API**. I have used **SQLAlchemy and django-rest-serializers** to interface the database with python classes.

### linked repositories
- Backend API - [Github](https://github.com/maayami/fanland-server)
- Socket server - [Github](https://github.com/maayami/fanland-socket-server)

### Features
- Fanland is a web application where a user can join fan clubs of their choice. Anyone can create a fan club, and others can search for it.
- New messages are highlighted with a yellow line.
- An image preview feature while sharing an image.
- There is a member list in each fan club's chat room, where online users are highlighted with a green mark on their profile pic.
- Fans can share their thoughts and images in real-time with all the members (RTC support via WebSockets).
- Admin can assign a member an admin role.
- Admins can delete any message and can also ban any user.
- The banned user will not be able to participate in the discussions or anything which can affect other members.
- A leader is there on every club page, indicating the most active members in that particular Fanclub.
A real-time notification feature shows the admin activity (make admin to other member && ban a user).
- Attractive design and interactive UI inspired by our favourite, Spotify.
- Each person have a unique username.

## The Fanland
![Screenshot from 2021-03-20 18-51-51](https://user-images.githubusercontent.com/55585868/111871250-ed17b200-89ae-11eb-8f2f-3107a3bf5ac9.png)
![Screenshot from 2021-03-20 18-52-02](https://user-images.githubusercontent.com/55585868/111871251-eee17580-89ae-11eb-8ad4-9f209d621758.png)
![Screenshot from 2021-03-20 18-52-06](https://user-images.githubusercontent.com/55585868/111871252-ef7a0c00-89ae-11eb-8f57-36e483d46cd1.png)
![Screenshot from 2021-03-20 18-52-15](https://user-images.githubusercontent.com/55585868/111871254-f0ab3900-89ae-11eb-9be7-a2fd1e18d993.png)
![Screenshot from 2021-03-20 18-55-54](https://user-images.githubusercontent.com/55585868/111871132-a5912600-89ae-11eb-9b7f-70ef4dd6396d.png)
![image](https://user-images.githubusercontent.com/55585868/111996900-7ca09a80-8b40-11eb-9414-5d070770f506.png)
![Screenshot from 2021-03-20 18-59-48](https://user-images.githubusercontent.com/55585868/111871134-a7f38000-89ae-11eb-8126-787552b6799a.png)
![Screenshot from 2021-03-20 19-00-09](https://user-images.githubusercontent.com/55585868/111871137-a9bd4380-89ae-11eb-8b5e-671590a073f6.png)
![Screenshot from 2021-03-20 19-00-15](https://user-images.githubusercontent.com/55585868/111871139-ac1f9d80-89ae-11eb-9218-8f9320bb421a.png)
![Screenshot from 2021-03-20 18-52-46](https://user-images.githubusercontent.com/55585868/111871241-df622c80-89ae-11eb-92fe-dd5f52731cab.png)
![Screenshot from 2021-03-20 18-53-08](https://user-images.githubusercontent.com/55585868/111871243-e1c48680-89ae-11eb-8826-b2ea40beb1f0.png)
![Screenshot from 2021-03-20 18-51-43](https://user-images.githubusercontent.com/55585868/111871247-e8eb9480-89ae-11eb-9c99-361919f34dbe.png)
![Screenshot from 2021-03-22 18-59-00](https://user-images.githubusercontent.com/55585868/111997192-cc7f6180-8b40-11eb-90e9-5959257cfd40.png)
![Screenshot from 2021-03-22 19-00-21](https://user-images.githubusercontent.com/55585868/111997280-e5881280-8b40-11eb-98d9-b11a916b727d.png)

# Setup Instructions
Below are the instructions to run this project on your local machines.
If you face any problem or encounter any issue, please let me know via [Mail](mailto:mayank_m@cs.iitr.ac.in)
## Local Setup
### Backend and Database
1. Requirements
  - PostgreSQL [Guide to install and setup](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-20-04)
  - Python3^
2. Databse setup instructions
 - Fanland uses postgreSQl as database tool so you first need to create a databse on your local machine using postgres. Install postgresql if you haven't already.
 - After installing postgresql on your machine, run the below commands on your `Terminal`.
 ```
sudo -u postgres psql
CREATE DATABASE myfirstpsqlproject;
CREATE USER firstpsqluser WITH PASSWORD 'psqlpassword';
 ```

3. Few Optimizations
- Afterwards, we’ll modify a few of the connection parameters for the user we just created. This will speed up database operations so that the correct values do not have to be queried and set each time a connection is established.

- We are setting the default encoding to UTF-8, which Django expects. We are also setting the default transaction isolation scheme to “read committed”, which blocks reads from uncommitted transactions. 
```
ALTER ROLE firstpsqluser SET client_encoding TO 'utf8';
ALTER ROLE firstpsqluser SET default_transaction_isolation TO 'read committed';
ALTER ROLE firstpsqluser SET timezone TO 'Asia/Kolkata';
```
- Now, we can give our new user access to administer our new database:
```
GRANT ALL PRIVILEGES ON DATABASE myfirstpsqlproject TO firstpsqluser;
exit
```
- Note:  give the Databse name and user name accodingly.

- If you want to use your own names and password make sure to follow these below steps otherwise you can skip to step- 4 `Setting up the API`.
   - After creation of the DB, you must configure it with the [fanland-backend](https://github.com/maayami/fanland-server).
   - Open your terminal again and clone the server code.
   ```![Screenshot from 2021-03-22 17-31-49](https://user-images.githubusercontent.com/55585868/111987159-dac78080-8b34-11eb-96b9-00a69a76de5e.png)

   git clone https://github.com/maayami/fanland-server
   ```
   - then open `../fanland-server/testproject/testproject/settings.py`.
   - then on line 82, you will see the default DB configs like this
   ```
   DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'myfirstpsqlproject',
        'USER': 'firstpsqluser',
        'PASSWORD': 'psqlpassword',
        'HOST': 'localhost',
        'PORT': '',
        }
    }
    ```
  - update the above variables i.e. `NAME` , `USER` and `PASSWORD` accordingly.

- Like in the below commands, I have used DB named `fanlanddb` and `maayami` as my user. So I would configure these changes in the settings.py file in my django project directory shown above.

![Screenshot from 2021-03-22 17-31-49](https://user-images.githubusercontent.com/55585868/111987236-f6cb2200-8b34-11eb-8b5e-f6bbd6eb2d1b.png)

![image](https://user-images.githubusercontent.com/55585868/111990409-41e73400-8b39-11eb-93a1-9f9e30d67e6d.png)

4. Setting up the API
- Clone the [fanland-server](https://github.com/maayami/fanland-server).
``` 
git clone https://github.com/maayami/fanland-server
cd fanland-server/testproject/
```
- create a virtual environemnt before any installation in the directory root `../fanland-server/`.
```
python3 -m venv .venv
source .venv/bin/activate
```
- When done install the dependencies in the `../fanland-server/`
 ```
 pip install -r requirements.txt
 cd testproject/
 ```
 ![image](https://user-images.githubusercontent.com/55585868/111989842-4fe88500-8b38-11eb-9d75-0893c808a230.png)
 
 - check your pwd, it should be `../fanland-server/testproject/`
 - makemigrations to create the database tables `python manage.py makemigrations`.
 - migrate the changes `python manage.py migrate`.
 - run the API server by typing `python manage.py runserver`.
 ![image](https://user-images.githubusercontent.com/55585868/111990969-ca65d480-8b39-11eb-8f8d-4bd3ca2fe46e.png)
![image](https://user-images.githubusercontent.com/55585868/111991170-0436db00-8b3a-11eb-887a-e8ae62901cee.png)

> Done!
 
## Setting up the socket-server
1. Prerequisites
- node and npm
- nodemon, install nodemon dependeing on your OS.
2. Setup Instructions
- Fanland uses socket.io for RTC. The code for fanland-socket-server can be found on [fanland-socket-server](https://github.com/maayami/fanland-socket-server).
```
git clone https://github.com/maayami/fanland-socket-server
cd fanland-socket-server
npm install
```
- After installing `nodemon` and typing `npm install` inside `../fanland-socket-server/`.
- run the socket server
```
nodemon index.js
```
![image](https://user-images.githubusercontent.com/55585868/111991619-83c4aa00-8b3a-11eb-93d0-6889600dec54.png)

> # Note: if your port crashes try to save the index.js file again and again (worked for me :).
> Done!
 
## Setting up the frontend
Fanland frontend is built in React
1. Prerequisites
- node and npm
2. Setup Instructions
- clone the repository
```
git clone https://github.com/maayami/fanland-frontend
cd fanland-frontend
```
- install the dependencies
```
npm install
```
- run the server `npm start`
- visit [port:3000](http://localhost:3000/) on your browser.
> Done!

## Guide to use fanland

### First step
- You first need to create an account, go to `http://localhost:3000/signup` .
- Then login to the fanland.
- After login, I would recommend you to go and check your profile. Check on the top-right, do you see your username there, click on it.
- Edit your profile as you like. You can also upload a new profile image. Just click on the old profile pic in the `Edit Profile` popup.
- The diamond icons indicates the number of fanclubs you follow but our DB is empty, so we need to create a new fanclub to check all the features.
- Come to bottom-left, do you see `New Club` there?
- Now you are ready!!

