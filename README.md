# README

# **StatusAirQuality Application**

## **Table of Contents**

1.  [Getting
    Started](#getting-started)

    1.  [Prerequisites](#Prerequisites)

    2.  [Installation](#installation)

2.  [Tech
    Stack](#tech-stack)

3.  [Tools and
    Integration](#tools)

4.  [Developers](#developers)

5.  [Future Scope](#futurescope)

## **Live Link**

Frontend Link:
<http://statusairquality.s3-website.us-east-2.amazonaws.com/>

Backend Link:
<http://pestosanabackend-env.eba-ga5kkvzc.us-east-2.elasticbeanstalk.com/>

## **Getting Started**

To get a local copy up and running follow these simple steps.

### **Prerequisites**

This is an example of how to list things you need to use the software
and how to install them.

- npm

> npm install npm@latest -g

### **Installation**

1.  Clone the repos backend & frontend

> git clone https://github.com/monalidoshi123/Pesto_Sana_Frontend/tree/master

> git clone https://github.com/monalidoshi123/Pesto_Sana_Backend/tree/master

2.  Install NPM packages in both

    > npm install

3.  Add the .env file in the root for backend app.

> PORT=4000

> MONGODB_URL="mongo_URL"

> JWT_SECRET_KEY="jwt_secret_key"

> JWT_TIMEOUT_DURATION = 3600

> API_TOKEN ="api_token"

4.  Run the backend server

> nodemon start

5.  Run the frontend app

> npm run start

5.  Existing user credentials

> username: monalidoshi@gmail.com, password: Monali123

### **Tech Stack**

- [React.js](https://reactjs.org/)

- [Redux](https://redux.js.org/)

- [Node.js](https://nodejs.org/en/)

- [MongoDB](https://www.mongodb.com/)

### **3rd Party Integration**

- [AWS S3](https://aws.amazon.com/)

### **Tools**

- [AWS](https://aws.amazon.com/)

- [Github](https://github.com/)

### **Source Code Repo**

- Front End Source Repo -
  <https://github.com/monalidoshi123/Pesto_Sana_Frontend/tree/master/tree/master>

- Back End Source Repo -
  <https://github.com/monalidoshi123/Pesto_Sana_Backend/tree/master>

## **Developer**

- Monali Doshi

## **Future Scope**

The application can be further improved if to be used in the Production environment as follows:

- Create separate environments for development, qa and production
- Improve validations and error handling
- Use location picker instead of dropdown with limited locations
- Add more tests for both backend and frontend
- Setup precommit git webhooks for linting
