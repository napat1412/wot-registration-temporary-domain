### WoT registration server for temporary domain

### Installation
```
cp .env.template .env
nvm use
npm install
```

### Running

This example requires Mariadb, MySQL or SQLITE installation. 
By default, sourcecode use local file: db.sqlite in this project. Please install sqlite3 into your os.
 
`apt install sqlite3`

If you need to use other SQL database, you can config through .env: DATABASE_URL.

#### [optional] Running with Docker

There is a `docker-compose.yml` file for starting Docker.

`docker-compose up`

After running the sample, you can stop the Docker container with

`docker-compose down`

### Run the sample

Then, run Nest as usual:

`npm run start:dev`

