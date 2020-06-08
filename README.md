# backstage
[![Build Status](https://travis-ci.com/dojot/backstage.svg?branch=master)](https://travis-ci.com/dojot/backstage) [![DeepScan grade](https://deepscan.io/api/teams/2714/projects/3991/branches/33559/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=2714&pid=3991&bid=33559) [![CodeFactor](https://www.codefactor.io/repository/github/dojot/backstage/badge)](https://www.codefactor.io/repository/github/dojot/backstage)

This repository is to get together all services can help GUI

Documentation for development: https://dojot.github.io/backstage/development/

## **Environment Variables**
Key                        | Purpose                                                  | Default Value      | Valid Values |
-------------------------- | -------------------------------------------------------- | ---------------    | -----------  |
PORT                       | Port in which the application will be accessible         | 3005               | Integer      |
POSTGRES_USER              | User to login into postgres database                     | postgres           | String       |
POSTGRES_PASSWORD          | Password to login into postgres database                 | postgres           | String       |
POSTGRES_HOST              | Postgres' instance host address                          | postgres           | String       |
POSTGRES_DATABASE          | The name of the 'default' database to be used            | dojot_devm         | String       |
POSTGRES_PORT              | User to login into postgres database                     | 5432               | Integer      |
BACKSTAGE_DB_NAME          | The name of the database that stores users' dashboard configuration| dojot_dash_users           | String       |
BACKSTAGE_DB_USER          | User to login into users' dashboard configuration database| postgres           | String       |
BACKSTAGE_DB_PWD           | User to login into postgres database                     | postgres           | String       |
BACKSTAGE_DB_HOST          | User to login into postgres database                     | postgres           | String       |
BACKSTAGE_DB_PORT          | User to login into postgres database                     | 5432           | Integer       |
