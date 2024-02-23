# Tinder clone

## Tech stack
* Redis: for session cookie
* MongoDB: storage of data
* React: frontend
* Node.js: Implementation of backend
* Express

## Steps
1. **Install the redis.** Proper guide is on this link: https://redis.io/docs/install/install-redis/install-redis-on-windows/ 

    Briefly, use these commands step by step through the WSL:

    ```
    curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

    sudo apt-get update
    sudo apt-get install redis
    ```

    Before the start backend and frontend the command have to be run:

    ``` console 
    sudo service redis-server start
    ```
2. **Install MongoDB**
    Via this link download the MongoDB Community Server and install it: https://www.mongodb.com/try/download/community

3. **Install Node.js**

    Guide for installtion is here: https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm
    
    Download (from here: https://github.com/coreybutler/nvm-windows/releases) the nvm-setup.zip file for the most recent release.

    Once downloaded, open the zip file, then open the nvm-setup.exe file.

    The Setup-NVM-for-Windows installation wizard will walk you through the setup steps, including choosing the directory where both nvm-windows and Node.js will be installed.

4. **Keys**
    
    Open file in path server/routes/keys.js and write there your id and secret from google API.

    Go to google API and go to credentinals page

    ![credentinals](./images/Cred.png)

    Press on create button and OAuth client ID

    ![credentinals](./images/Create.png)

    Fill the information

    ![credentinals](./images/fill.png)

    Copy and paste the id and secret from this fields

    ![credentinals](./images/copy.png)

5. **Install dependencies**
    
    For installation dependencies for client side:

    ```
    C:\Users\...\findu-app> npm run install
    ```

    For installation dependencies for client side:

    ```
    C:\Users\...\findu-app> npm run preinstall
    ```
6. **Run**

    You have to use two command lines. In the first run this command to run the server side.

    ```
    C:\Users\...\findu-app>set "NODE_ENV=development" && npm run dev:server
    ```

    In the second run this command to run the client side.

    ```
    C:\Users\...\findu-app> npm run dev:client
    ```
## User manual

The app have several pages:

* Autherization/register page
* Page with cards to swipe
* List of chats
* Chat with user
* Page if user wants to go on Autherization/register page, when he is already authentificated 

On this
[video](./images/my_video.mp4) you can see the registration and authentification process

# Note: 
if user added the image in the profile, it is need to reload the page and it will appeare

## Features
* Utilization of a frontside framework, such as React, but you can also use Angular, Vue or some other (5)

    React is used in whole client side project.
* One can swipe to left or right to dislike or like the profile (2)

    On the route '/cards' are cards, which user can swipe. If user swipes on the right, another user will be liked/matched (if like is mutual). If user swipes on the right, another user will be disliked.
* Use of a pager when there is more than 10 chats available available (2)

    On the route '/chats' is the list of chats, if them more than 10, division on pagaes will be available
* Login with Facebook, Google, X or other accounts (use Passport.js) (2)

    The page with login and registration is on the route '/', if user is not authenticated. The clicking on grey button with sign 'Log in' will change the form for log in. There will be the red button with sign 'Google+'. If user clickes on this button, he will go through the process of authentication.
* If match is being found the UI gives option to start chat immediately (2)

    If the users are matched, the toast appeares with button "Open the chat!", which can be pressed and user can write the message there. 
* User can click username and see user profile page where name, register date, (user picture) and user bio is listed (2)

    This feature was implemented in routes '/cards', on the card, which user can swipe, is the name of user, which he can click and go to the profile of these user, and '/userchat', where user can click on the bold nsme of another user and go to the profile.
* Last edited timestamp is stored and shown within chat (2)

    On the '/userchat' route and with double clicking on the own message user can edit it and the timestamp will be changed.
* Translation of the whole UI in two or more languages (2)
    
    The UI is translated on russian and english languages, except the page with registration and log in.

**In total**: 19 additional points and 25 for the main features = 44 points

