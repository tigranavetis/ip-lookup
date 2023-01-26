### IP Lookup API

This is a simple API that allows you to lookup the IP address of a given domain IP address.

#### Usage

* Copy `.env.example` into `.env` and fill in the required values
* Run `docker-compose up`
* Run `npm run migrate` to run the database migrations
* **Please note**: In order to use this package, you will need to manually add an entity in the `api_key` table of your database. The key should be added to the `key` column.
(you can do that by running `docker-compose exec db psql -U postgres -d ip-dev -c "INSERT INTO api_key (key) VALUES ('your_key_here');"`)
* In order to lookup an IP address, send a GET request to `http://localhost:3000/ip/:ip` with the `X-API-KEY` header set to the key you added to the database. Example - `curl -H "X-API-KEY: your_key_here" http://localhost:3000/ip/8.8.8.8`
* In order to remove a cached IP address result, send a DELETE request to `http://localhost:3000/ip/:ip` with the `X-API-KEY` header set to the key you added to the database. Example - `curl -X DELETE -H "X-API-KEY: your_key_here" http://localhost:3000/ip/8.8.8.8`

#### Testing

* Run `npm test` to run the unit tests

### Disclaimer

The project is not production ready. It is a proof of concept and should not be used in production.
