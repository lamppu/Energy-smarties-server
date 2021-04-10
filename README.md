# Energy-smarties-server

This repository includes the files for the back-end of the GreenerApps mobile application for the Innovation Project course.

App idea: The app is used to evaluate how "green" an app is and compare it with other apps within the same category.

This repository contains:
- Migrations for creating the database and making changes to it
- Seed files for seeding the database with data from csv.-files
- Model files for modeling the tables of the database into objects
- Server files

The server in a nutshell: The server has a search functionality to search for apps by app name or category. The server counts the different scores for the apps and returns them in the response.

Used tools and technologies: Node.js, Express.js, MySQL, Knex.js, Bookshelf.js, Nginx, Azure Cloud, CircleCI, ESLint

## For team members:

Gitignore from
https://github.com/github/gitignore/blob/master/Node.gitignore

To get started
- clone the repository
- run "npm install" in project root folder to install dependencies
- add a .env file (in the project root) with the db connection stuff, you can find the contents you should add in the Developers channel in Teams, I've posted it on October 23rd
- run "npm start" to start the server


### Conventions

This project uses ESLinter to check code formatting and style.

To run the linter manually, use:  
```npm run lint```

To attempt to fix linter issues automatically, use:  
```npm run lint-fix```

Note that not all errors can be fixed automatically.
