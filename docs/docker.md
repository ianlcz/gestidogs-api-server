# Docker commands

## Build the image

To build your Docker image run the following command :

```
docker build -t ianlcz/gestidogs-api-server:<tag> .
```

## Launch container with this image

Run **gestidogs-api-server** container by using Docker thanks to this command on Linux:

```
docker run --rm -d -p 8080:8080 --name gestidogs-api-server -v $(pwd)/src:/home/gestidogs-api-server/src gestidogs-api-server:<tag>
```

or on Windows :

```
docker run --rm -d -p 8080:8080 --name gestidogs-api-server -v %cd%/src:/home/gestidogs-api-server/src gestidogs-api-server:<tag>
```
