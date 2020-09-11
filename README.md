# book_app

**Author**: Ahmad Yousef, Dina Alsaid, Hamza sami
**Version**: 1.6.1

## Overview

A book list with the ability to search the Google Books API. The user will also be able to add books to the home page, delete them and modify/update the information.

## Getting Started
to be able to run the server locally you will need :

dotenv: for adding local enviroment parameters for local testing
ejs: used for templating
Express: for creating the server/app
method-override: to be able to use the PUT and DELETE methods
pg: for connecting postgresql database to the client
superagent: to help retrieve data from APIs.

## Architecture

The backend is an Express.js server with dependencies on the following packages:

    "dotenv": "^8.2.0",
    "ejs": "^3.1.5",
    "express": "^4.17.1",
    "method-override": "^3.0.0",
    "pg": "^8.3.3",
    "superagent": "^6.1.0"

The web app is deployed on Heroku.

## Change Log

08-09-2020 3:00pm - Application now has a fully-functional express server, with GET method for the main route the search books route and the show books route.

09-09-2020 4:00pm - POST method for searching for new books and retrieves data from the google books API (with some bugs), and displays them, and displays an error if the data is not retreived correctly then the app is connected to a database.

09-09-2020 6:00pm - Application now has PUT method to update the books in the database, and a DELETE route to reomve books from the database.
