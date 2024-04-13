# Real Estate Webb App

### Table of Contents

- [Prerequisites](#Prerequisites)
- [Tech Stack](#Tech-Stack)
- [Interaction](#Interaction)
- [Screenshot](#Screenshot)
- [Links](#Links)
- [Getting Started](#Getting-Started)
- [Deployment](#Deployment)
- [Structure](#Structure)
- [Author](#Author)

### Prerequisites

- <img src="client/public/readme/npm.png" width="25" style="top: 8px" /> _npm: Node Package Manager for JavaScript_
- <img src="client/public/readme/vite.jpg" width="25" style="top: 8px" /> _Vite: Frontend build tool for modern web development_
- <img src="client/public/readme/js.png" width="25" style="top: 8px" /> _JavaScript: Web development language._

#

### Tech Stack

- <img src="client/public/readme/nodejs.png" width="25" style="top: 8px" /> _Node.js: JavaScript runtime environment_
- <img src="client/public/readme/expressjs.png" width="25" style="top: 8px" /> _Express: Minimalist web framework for Node.js_
- <img src="client/public/readme/tailwind.png" width="25" style="top: 8px" /> _Tailwind Css: Utility-first framework for efficient, responsive web styling._
- <img src="client/public/readme/mongoose.png" width="25" style="top: 8px" /> _Mongoose: MongoDB object modeling for Node.js._
- <img src="client/public/readme/jwt.png" width="25" style="top: 8px" /> _JWT: JSON Web Token for authentication_
- <img src="client/public/readme/bcrypt.png" width="25" style="top: 8px" /> _bcrypt: Password hashing library for security._
- <img src="client/public/readme/firebase.png" width="25" style="top: 8px" /> _Firebase: Scalable backend services, authentication, and real-time database for web apps._

### Interaction

Users should be able to:

Authentication:

- Sign up securely with email and password.
- Log in using Google Authentication.

Profile Management:

- Edit personal information.
- Change profile picture.
- Delete or edit user profile.

Real Estate Operations:

- Add new property listings.
- Edit existing property details.
- Delete property listings.

Search and Sort:

- Search properties based on price and features.
- Sort properties by price and listing time.

Image Management:

- Add images to property listings.
- Edit or delete images.

### Screenshot

![](./client/public/preview.png)

### Links

- Solution URL: [Add solution URL here](https://github.com/DavitDvalashvili/real-estate-web-app)
- Live Site URL: [Add live site URL here](https://real-estate-web-app-client.vercel.app)

### Getting Started

1. First of all you need to clone app repository from github:

```
git clone https://github.com/DavitDvalashvili/real-estate-web-app.git
```

2. Next step requires install all the dependencies.

```
npm install
```

3. To see project in action

```
npm run dev
```

### Deployment

Before every deployment you need to create build file.

```
npm run build
```

after this you can use this file to deploy project on server.

## Structure

```
|-- api
| |-- controllers
| |-- models
| |-- routes
|-|-- utils
|-- index.js
|-- client
| |-- public
| | |-- readme
| |--src
| | |--assets
| | | |-- components
| | | |-- pages
| | |-- redux
| | | |-- user
| | |-- app.js
| | |-- main.js
| | |-- index.css
| |--index.html

```

### Author

- Github profile - [Add your name here](https://github.com/DavitDvalashvili)
- Linkedin profile - [Add your name here](https://www.linkedin.com/in/davit-dvalashvili-0421b6253)
- Email - [@your_username](davitdvalashvili1996@gmail.com)
