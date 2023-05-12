# Gestidogs API Server

## Development Team

- **Bordeaux Ynov Campus IT department :**
  - [Mathieu CHAMBAUD](https://github.com/FrekiManagarm) - Master2 Expert in Web Development
  - [Dorian FRANÇAIS](https://github.com/DorianFRANCAIS) - Master2 Expert in Web Development
  - [Yann LE COZ](https://github.com/ianlcz) - Master2 Expert in Web Development

## Installation

You can install the project by cloning this repository:

```bash
git clone https://github.com/ianlcz/gestidogs-api-server.git
```

### Install dependencies

First of all, if you have just cloned the repository you have to install the project dependencies with the command `npm install` in the **root** folder.

## Usage

### How to generate a JWT secret ?

On Linux and Mac, type this command `openssl rand -hex 32` or go to https://generate-secret.now.sh/32.

### Write the .env files

You must copy the `.env.example` file in the root folder of the application and replace `<GESTIDOGS_MONGO_URI>`, `<GESTIDOGS_JWT_ACCESS_SECRET>`, `<GESTIDOGS_JWT_REFRESH_SECRET>` and `<STRIPE_SECRET_API_KEY>` with your own :

```
GESTIDOGS_MONGO_URI=<GESTIDOGS_MONGO_URI>

JWT_ACCESS_SECRET=<GESTIDOGS_JWT_ACCESS_SECRET>
JWT_REFRESH_SECRET=<GESTIDOGS_JWT_REFRESH_SECRET>

STRIPE_API_KEY=<STRIPE_SECRET_API_KEY>
```

### Running

```bash
# development mode
$ npm run start

# watch mode
$ npm run start:dev
```

Then you can go to your browser at http://localhost:8080/docs to see the Swagger documentation of the GestiDogs API Server.

### Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

You can launch the API with Docker by following the [Docker commands](./docs/docker.md) documentation.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
