
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_initApp",
          "summary": "Get API informations",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The GestiDogs API informations"
            }
          }
        }
      },
      "/sessions": {
        "post": {
          "operationId": "SessionsController_create",
          "summary": "Create a session",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSessionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Session successfully created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Session"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can create a new session"
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "SessionsController_findAll",
          "summary": "Find all sessions",
          "parameters": [],
          "responses": {
            "200": {
              "description": "List of sessions",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Session"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can find all sessions"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "SessionsController_deleteAll",
          "summary": "Remove all sessions",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Remove all sessions"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can remove all sessions"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/sessions/{sessionId}": {
        "get": {
          "operationId": "SessionsController_findOne",
          "summary": "Find a session",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found session",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Session"
                  }
                }
              }
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "SessionsController_updateOne",
          "summary": "Update a session",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateSessionDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified session",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Session"
                  }
                }
              }
            },
            "304": {
              "description": "Not Modified"
            },
            "401": {
              "description": "**Client** not allowed to modify a session"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "SessionsController_deleteOne",
          "summary": "Delete a session",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The deleted session",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Session"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can delete a session"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/sessions/users/{userId}": {
        "get": {
          "operationId": "SessionsController_findByEducator",
          "summary": "Find sessions by user",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "date",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of sessions by their user",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Session"
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/sessions/activities/{activityId}": {
        "get": {
          "operationId": "SessionsController_findByActivity",
          "summary": "Find sessions by activity",
          "parameters": [
            {
              "name": "activityId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of sessions by activity",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Session"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "SessionsController_deleteByActivity",
          "summary": "Delete sessions by activity",
          "parameters": [
            {
              "name": "activityId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Sessions successfully deleted"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete a session"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/sessions/educators/{educatorId}": {
        "delete": {
          "operationId": "SessionsController_deleteByEducator",
          "summary": "Delete sessions by educator",
          "parameters": [
            {
              "name": "educatorId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Sessions successfully deleted"
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can delete a session"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "sessions"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users/register": {
        "post": {
          "operationId": "UsersController_register",
          "summary": "Register a user",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User successfully registered"
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users/login": {
        "post": {
          "operationId": "UsersController_login",
          "summary": "Login a user",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthLoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User successfully logged"
            },
            "400": {
              "description": "Bad Request"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users/logout": {
        "post": {
          "operationId": "UsersController_logout",
          "summary": "Logout a user",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users/refresh": {
        "get": {
          "operationId": "UsersController_refreshTokens",
          "summary": "Refresh a user",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Refresh User"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users/me": {
        "get": {
          "operationId": "UsersController_getInfos",
          "summary": "Get user logged informations",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The logged user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users": {
        "get": {
          "operationId": "UsersController_findAll",
          "summary": "Find all users",
          "parameters": [],
          "responses": {
            "200": {
              "description": "List of users",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can find all users"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "UsersController_deleteAll",
          "summary": "Remove all users",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Remove all users"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can remove all users"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users/{userId}": {
        "get": {
          "operationId": "UsersController_findOne",
          "summary": "Find a user",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "UsersController_updateOne",
          "summary": "Update user informations",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "UsersController_deleteOne",
          "summary": "Delete a user",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The deleted user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can delete a user"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/users/establishments/{establishmentId}": {
        "get": {
          "operationId": "UsersController_findByEstablishment",
          "summary": "Find users of an establishment",
          "parameters": [
            {
              "name": "establishmentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "role",
              "required": false,
              "in": "query",
              "schema": {
                "enum": [
                  "Administrator",
                  "Manager",
                  "Educator",
                  "Client"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of users by establishment",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can find a user"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/establishments": {
        "post": {
          "operationId": "EstablishmentsController_create",
          "summary": "Create an establishment",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateEstablishmentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Establishment successfully created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Establishment"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can create a new establishment"
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "EstablishmentsController_findAll",
          "summary": "Find all establishments",
          "parameters": [],
          "responses": {
            "200": {
              "description": "List of establishments",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Establishment"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Clients** can find all establishments"
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "EstablishmentsController_deleteAll",
          "summary": "Remove all establishments",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Remove all establishments"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can remove all establishments"
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/establishments/{establishmentId}": {
        "get": {
          "operationId": "EstablishmentsController_findOne",
          "summary": "Find an establishment",
          "parameters": [
            {
              "name": "establishmentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found establishment",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Establishment"
                  }
                }
              }
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "EstablishmentsController_updateOne",
          "summary": "Update an establishment",
          "parameters": [
            {
              "name": "establishmentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateEstablishmentDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified establishment",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Establishment"
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can modify an establishment"
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "EstablishmentsController_deleteOne",
          "summary": "Delete an establishment",
          "parameters": [
            {
              "name": "establishmentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The deleted establishment",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Establishment"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can delete an establishment"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/establishments/owners/{ownerId}": {
        "get": {
          "operationId": "EstablishmentsController_findByOwner",
          "summary": "Find establishments by owner",
          "parameters": [
            {
              "name": "ownerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of owner-managed establishments",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Establishment"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "EstablishmentsController_deleteByOwner",
          "summary": "Delete establishments by owner",
          "parameters": [
            {
              "name": "ownerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Establishments successfully deleted"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can delete establishments based on their owner"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "establishments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/dogs": {
        "post": {
          "operationId": "DogsController_create",
          "summary": "Create a dog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateDogDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Dog successfully created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Dog"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can create a new dog"
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "DogsController_findAll",
          "summary": "Find all dogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": "List of dogs",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Dog"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can find all dogs"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "DogsController_deleteAll",
          "summary": "Remove all dogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Remove all dogs"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can remove all dogs"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/dogs/{dogId}": {
        "get": {
          "operationId": "DogsController_findOne",
          "summary": "Find a dog",
          "parameters": [
            {
              "name": "dogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found dog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Dog"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized if the **Client** is not the owner of the dog"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "DogsController_updateOne",
          "summary": "Update a dog",
          "parameters": [
            {
              "name": "dogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateDogDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified dog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Dog"
                  }
                }
              }
            },
            "304": {
              "description": "Not Modified"
            },
            "401": {
              "description": "Unauthorized if the **Client** is not the owner of the dog"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "DogsController_deleteOne",
          "summary": "Delete a dog",
          "parameters": [
            {
              "name": "dogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The deleted dog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Dog"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete a dog"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/dogs/owners/{ownerId}": {
        "get": {
          "operationId": "DogsController_findByOwner",
          "summary": "Find dogs by owner",
          "parameters": [
            {
              "name": "ownerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of dogs by their owner",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Dog"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can find dogs by their owner"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "DogsController_deleteByOwner",
          "summary": "Delete dogs by owner",
          "parameters": [
            {
              "name": "ownerId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Dogs successfully deleted"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete dogs based on their owner"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/dogs/establishments/{establishmentId}": {
        "get": {
          "operationId": "DogsController_findByEstablishment",
          "summary": "Find dogs by establishment",
          "parameters": [
            {
              "name": "establishmentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of dogs by establishment",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Dog"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "dogs"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/activities": {
        "post": {
          "operationId": "ActivitiesController_create",
          "summary": "Create an activity",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateActivityDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Activity successfully created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can create an activity"
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "activities"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "ActivitiesController_findAll",
          "summary": "Find all activities",
          "parameters": [],
          "responses": {
            "200": {
              "description": "List of activities",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Activity"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can find all activities"
            }
          },
          "tags": [
            "activities"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "ActivitiesController_deleteAll",
          "summary": "Remove all activities",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Remove all activities"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can remove all activities"
            }
          },
          "tags": [
            "activities"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/activities/{activityId}": {
        "get": {
          "operationId": "ActivitiesController_findOne",
          "summary": "Find an activity",
          "parameters": [
            {
              "name": "activityId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found activity",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "activities"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "ActivitiesController_updateOne",
          "summary": "Update an activity",
          "parameters": [
            {
              "name": "activityId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateActivityDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified activity",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            },
            "304": {
              "description": "Not Modified"
            }
          },
          "tags": [
            "activities"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "ActivitiesController_deleteOne",
          "summary": "Delete an activity",
          "parameters": [
            {
              "name": "activityId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The deleted activity",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete an activity"
            },
            "404": {
              "description": "Not found"
            }
          },
          "tags": [
            "activities"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/activities/establishments/{establishmentId}": {
        "get": {
          "operationId": "ActivitiesController_findByEstablishment",
          "summary": "Find activities of an establishment",
          "parameters": [
            {
              "name": "establishmentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of activities of an establishment",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Activity"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "activities"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "GestiDogs",
      "description": "Backend of a dog training center management application",
      "version": "0.0.1",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "BearerToken": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "description": "Default JWT Authorization",
          "type": "http",
          "in": "header"
        }
      },
      "schemas": {
        "CreateSessionDto": {
          "type": "object",
          "properties": {
            "educator": {
              "type": "string"
            },
            "activity": {
              "type": "string"
            },
            "status": {
              "type": "string",
              "enum": [
                "Online",
                "Pending",
                "Postponed",
                "Canceled"
              ],
              "default": "Pending"
            },
            "maximumCapacity": {
              "type": "number",
              "default": 1
            },
            "report": {
              "type": "string"
            },
            "beginDate": {
              "format": "date-time",
              "type": "string"
            },
            "endDate": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "educator",
            "activity",
            "status",
            "maximumCapacity",
            "beginDate",
            "endDate"
          ]
        },
        "Establishment": {
          "type": "object",
          "properties": {
            "owner": {
              "$ref": "#/components/schemas/User"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "phoneNumber": {
              "type": "string"
            },
            "emailAddress": {
              "type": "string"
            },
            "employees": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/User"
              }
            },
            "schedules": {
              "type": "array",
              "items": {
                "type": "array",
                "properties": {
                  "startTime": {
                    "type": "string"
                  },
                  "endTime": {
                    "type": "string"
                  }
                }
              },
              "default": []
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "owner",
            "name",
            "address",
            "schedules"
          ]
        },
        "Activity": {
          "type": "object",
          "properties": {
            "establishment": {
              "$ref": "#/components/schemas/Establishment"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "duration": {
              "type": "number"
            },
            "price": {
              "type": "number"
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "establishment",
            "title",
            "duration",
            "price"
          ]
        },
        "User": {
          "type": "object",
          "properties": {
            "lastname": {
              "type": "string"
            },
            "firstname": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            },
            "role": {
              "type": "string",
              "enum": [
                "Administrator",
                "Manager",
                "Educator",
                "Client"
              ],
              "default": "Client"
            },
            "emailAddress": {
              "type": "string",
              "uniqueItems": true
            },
            "birthDate": {
              "format": "date-time",
              "type": "string"
            },
            "activities": {
              "default": [],
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Activity"
              }
            },
            "registeredAt": {
              "format": "date-time",
              "type": "string"
            },
            "lastConnectionAt": {
              "format": "date-time",
              "type": "string"
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "lastname",
            "firstname",
            "role",
            "emailAddress",
            "registeredAt"
          ]
        },
        "Session": {
          "type": "object",
          "properties": {
            "educator": {
              "$ref": "#/components/schemas/User"
            },
            "activity": {
              "$ref": "#/components/schemas/Activity"
            },
            "status": {
              "type": "string",
              "enum": [
                "Online",
                "Pending",
                "Postponed",
                "Canceled"
              ],
              "default": "Pending"
            },
            "maximumCapacity": {
              "type": "number",
              "default": 1
            },
            "report": {
              "type": "string"
            },
            "beginDate": {
              "format": "date-time",
              "type": "string"
            },
            "endDate": {
              "format": "date-time",
              "type": "string"
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "educator",
            "activity",
            "status",
            "maximumCapacity",
            "beginDate",
            "endDate"
          ]
        },
        "UpdateSessionDto": {
          "type": "object",
          "properties": {
            "educator": {
              "type": "string"
            },
            "activity": {
              "type": "string"
            },
            "status": {
              "type": "string",
              "enum": [
                "Online",
                "Pending",
                "Postponed",
                "Canceled"
              ],
              "default": "Pending"
            },
            "maximumCapacity": {
              "type": "number",
              "default": 1
            },
            "report": {
              "type": "string"
            },
            "beginDate": {
              "format": "date-time",
              "type": "string"
            },
            "endDate": {
              "format": "date-time",
              "type": "string"
            }
          }
        },
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "lastname": {
              "type": "string"
            },
            "firstname": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            },
            "role": {
              "type": "string",
              "enum": [
                "Administrator",
                "Manager",
                "Educator",
                "Client"
              ],
              "default": "Client"
            },
            "emailAddress": {
              "type": "string"
            },
            "password": {
              "type": "string"
            },
            "birthDate": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "lastname",
            "firstname",
            "role",
            "emailAddress",
            "password"
          ]
        },
        "AuthLoginDto": {
          "type": "object",
          "properties": {
            "emailAddress": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "emailAddress",
            "password"
          ]
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {
            "lastname": {
              "type": "string"
            },
            "firstname": {
              "type": "string"
            },
            "emailAddress": {
              "type": "string"
            },
            "password": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            }
          },
          "required": [
            "lastname",
            "firstname",
            "emailAddress",
            "password"
          ]
        },
        "CreateEstablishmentDto": {
          "type": "object",
          "properties": {
            "owner": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "phoneNumber": {
              "type": "string"
            },
            "emailAddress": {
              "type": "string"
            },
            "employees": {
              "type": "array"
            },
            "schedules": {
              "type": "array",
              "items": {
                "type": "array",
                "properties": {
                  "startTime": {
                    "type": "string"
                  },
                  "endTime": {
                    "type": "string"
                  }
                }
              },
              "default": []
            }
          },
          "required": [
            "owner",
            "name",
            "address",
            "emailAddress",
            "schedules"
          ]
        },
        "UpdateEstablishmentDto": {
          "type": "object",
          "properties": {
            "owner": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "phoneNumber": {
              "type": "string"
            },
            "emailAddress": {
              "type": "string"
            },
            "employees": {
              "type": "array"
            },
            "schedules": {
              "type": "array",
              "items": {
                "type": "array",
                "properties": {
                  "startTime": {
                    "type": "string"
                  },
                  "endTime": {
                    "type": "string"
                  }
                }
              },
              "default": []
            }
          }
        },
        "CreateDogDto": {
          "type": "object",
          "properties": {
            "owner": {
              "type": "string"
            },
            "establishment": {
              "type": "string"
            },
            "nationalId": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "breed": {
              "type": "string"
            },
            "weight": {
              "type": "number"
            },
            "height": {
              "type": "number"
            }
          },
          "required": [
            "owner",
            "establishment",
            "nationalId",
            "name",
            "breed",
            "weight",
            "height"
          ]
        },
        "Dog": {
          "type": "object",
          "properties": {
            "owner": {
              "$ref": "#/components/schemas/User"
            },
            "establishment": {
              "$ref": "#/components/schemas/Establishment"
            },
            "nationalId": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "breed": {
              "type": "string"
            },
            "birthDate": {
              "format": "date-time",
              "type": "string"
            },
            "weight": {
              "type": "number"
            },
            "height": {
              "type": "number"
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "owner",
            "establishment",
            "nationalId",
            "name",
            "breed",
            "weight",
            "height"
          ]
        },
        "UpdateDogDto": {
          "type": "object",
          "properties": {
            "owner": {
              "type": "string"
            },
            "establishment": {
              "type": "string"
            },
            "nationalId": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "breed": {
              "type": "string"
            },
            "weight": {
              "type": "number"
            },
            "height": {
              "type": "number"
            }
          },
          "required": [
            "owner",
            "establishment"
          ]
        },
        "CreateActivityDto": {
          "type": "object",
          "properties": {
            "establishment": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "duration": {
              "type": "number"
            },
            "price": {
              "type": "number"
            }
          },
          "required": [
            "establishment",
            "title",
            "duration",
            "price"
          ]
        },
        "UpdateActivityDto": {
          "type": "object",
          "properties": {
            "establishment": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "duration": {
              "type": "number"
            },
            "price": {
              "type": "number"
            }
          }
        }
      }
    }
  },
  "customOptions": {
    "tagsSorter": "alpha",
    "operationsSorter": "method"
  }
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}