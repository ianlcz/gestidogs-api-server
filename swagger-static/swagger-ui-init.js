
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
      "/v0/sessions": {
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
          "operationId": "SessionsController_find",
          "summary": "Find sessions",
          "parameters": [
            {
              "name": "reserved",
              "required": false,
              "in": "query",
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "educatorId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "activityId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "establishmentId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "begin",
              "required": false,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            },
            {
              "name": "end",
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
      "/v0/sessions/{sessionId}/report": {
        "post": {
          "operationId": "SessionsController_writeReport",
          "summary": "Write a session report",
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
                  "$ref": "#/components/schemas/WriteReportDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Successfully written session report",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Session"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can write a session report"
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
        }
      },
      "/v0/sessions/daily": {
        "get": {
          "operationId": "SessionsController_findDaily",
          "summary": "Find a daily sessions",
          "parameters": [
            {
              "name": "date",
              "required": true,
              "in": "query",
              "schema": {
                "format": "date-time",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found daily sessions"
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can write a session report"
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
      "/v0/sessions/{sessionId}": {
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
            "400": {
              "description": ""
            },
            "401": {
              "description": ""
            },
            "404": {
              "description": "Session not found"
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
            "400": {
              "description": ""
            },
            "401": {
              "description": "**Client** not allowed to modify a session"
            },
            "404": {
              "description": "Session to modify not found"
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
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can delete a session"
            },
            "404": {
              "description": "Session to delete not found"
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
      "/v0/sessions/{sessionId}/remaining-places": {
        "get": {
          "operationId": "SessionsController_findPlacesLeft",
          "summary": "Find number of places left in a session",
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
              "description": "Number of places remaining in a session",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "number"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can find number of places left in a session"
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
      "/v0/sessions/educators/{educatorId}": {
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
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can delete a session"
            },
            "404": {
              "description": "Sessions to delete not found"
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
      "/v0/sessions/activities/{activityId}": {
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
            "204": {
              "description": "Sessions successfully deleted"
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete a session"
            },
            "404": {
              "description": "Sessions to delete not found"
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
      "/v0/users/register": {
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
      "/v0/users/login": {
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
      "/v0/users/logout": {
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
      "/v0/users/refresh": {
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
      "/v0/users/me": {
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
      "/v0/users": {
        "get": {
          "operationId": "UsersController_find",
          "summary": "Find users",
          "parameters": [
            {
              "name": "establishmentId",
              "required": false,
              "in": "query",
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
              "description": "Unauthorized because only **Administrators** and **Managers** can find users"
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
      "/v0/users/{userId}": {
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
              "description": "User successfully found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": ""
            },
            "404": {
              "description": "User not found"
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
              "description": ""
            },
            "401": {
              "description": ""
            },
            "404": {
              "description": "User to modify not found"
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
            "204": {
              "description": "The deleted user",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can delete a user"
            },
            "404": {
              "description": "User to delete not found"
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
      "/v0/establishments": {
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
          "operationId": "EstablishmentsController_find",
          "summary": "Find establishments",
          "parameters": [
            {
              "name": "ownerId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
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
      "/v0/establishments/{establishmentId}/newEmployee": {
        "post": {
          "operationId": "EstablishmentsController_addEmployee",
          "summary": "Add a new employee in establishment",
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
                  "$ref": "#/components/schemas/NewEmployeeDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Establishment employees",
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
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can add a new employee"
            },
            "404": {
              "description": "Employees of establishment not found"
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
      "/v0/establishments/{establishmentId}": {
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
            "400": {
              "description": ""
            },
            "401": {
              "description": ""
            },
            "404": {
              "description": "Establishment not found"
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
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can modify an establishment"
            },
            "404": {
              "description": "Establishment to modify not found"
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
            "204": {
              "description": "The deleted establishment",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Establishment"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can delete an establishment"
            },
            "404": {
              "description": "Establishment to delete not found"
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
      "/v0/establishments/owners/{ownerId}": {
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
            "204": {
              "description": "Establishments successfully deleted"
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** can delete establishments based on their owner"
            },
            "404": {
              "description": "Establishments to delete not found"
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
      "/v0/dogs": {
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
          "operationId": "DogsController_find",
          "summary": "Find dogs",
          "parameters": [
            {
              "name": "ownerId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "establishmentId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
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
              "description": "Unauthorized because only **Administrators** and **Managers** can find dogs"
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
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Dogs successfully deleted"
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete dogs based on their owner"
            },
            "404": {
              "description": "Dogs to delete not found"
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
      "/v0/dogs/{dogId}": {
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
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized if the **Client** is not the owner of the dog"
            },
            "404": {
              "description": "Dog not found"
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
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized if the **Client** is not the owner of the dog"
            },
            "404": {
              "description": "Dog to modify not found"
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
            "204": {
              "description": "The deleted dog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Dog"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete a dog"
            },
            "404": {
              "description": "Dog to delete not found"
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
      "/v0/activities": {
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
          "operationId": "ActivitiesController_find",
          "summary": "Find activities",
          "parameters": [
            {
              "name": "establishmentId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
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
      "/v0/activities/{activityId}": {
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
            "400": {
              "description": ""
            },
            "401": {
              "description": ""
            },
            "404": {
              "description": "Activity not found"
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
            "400": {
              "description": ""
            },
            "401": {
              "description": ""
            },
            "404": {
              "description": "Activity to modify not found"
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
            "204": {
              "description": "The deleted activity",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Activity"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete an activity"
            },
            "404": {
              "description": "Activity to delete not found"
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
      "/v0/reservations": {
        "post": {
          "operationId": "ReservationsController_create",
          "summary": "Create a reservation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateReservationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Reservation successfully created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Reservation"
                  }
                }
              }
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "reservations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "ReservationsController_find",
          "summary": "Find reservations",
          "parameters": [
            {
              "name": "sessionId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of reservations",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Reservation"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can find reservations"
            }
          },
          "tags": [
            "reservations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/v0/reservations/{reservationId}": {
        "get": {
          "operationId": "ReservationsController_findOne",
          "summary": "Find a reservation",
          "parameters": [
            {
              "name": "reservationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found reservation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Reservation"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "404": {
              "description": "Reservation not found"
            }
          },
          "tags": [
            "reservations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "ReservationsController_updateOne",
          "summary": "Update a reservation",
          "parameters": [
            {
              "name": "reservationId",
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
                  "$ref": "#/components/schemas/UpdateReservationDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified reservation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Reservation"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "**Client** not allowed to modify a reservation"
            },
            "404": {
              "description": "Reservation to modify not found"
            }
          },
          "tags": [
            "reservations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "ReservationsController_deleteOne",
          "summary": "Delete a reservation",
          "parameters": [
            {
              "name": "reservationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "The deleted reservation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Reservation"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete a reservation"
            },
            "404": {
              "description": "Reservation to delete not found"
            }
          },
          "tags": [
            "reservations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/v0/payments": {
        "post": {
          "operationId": "PaymentsController_createPaymentIntent",
          "summary": "Make a payment intent",
          "parameters": [
            {
              "name": "paymentMethodId",
              "required": true,
              "in": "query",
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
                  "$ref": "#/components/schemas/PaymentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Payment intent successfully done"
            },
            "401": {
              "description": "Unauthorized because only **Clients** can do a payment intent"
            }
          },
          "tags": [
            "payments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "PaymentsController_findPaymentMethodsByStripeId",
          "summary": "Find all user's payment methods",
          "parameters": [
            {
              "name": "stripeId",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of user's payment methods"
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can find all user payment methods"
            }
          },
          "tags": [
            "payments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/v0/payments/card": {
        "post": {
          "operationId": "PaymentsController_createCard",
          "summary": "Add card as payment method",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CardDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Card payment method successfully added"
            },
            "401": {
              "description": "Unauthorized because only **Clients** can add their card as payment method"
            }
          },
          "tags": [
            "payments"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/v0/observations": {
        "post": {
          "operationId": "ObservationsController_create",
          "summary": "Create a dog observation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateObservationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Observation successfully created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Observation"
                  }
                }
              }
            },
            "401": {
              "description": "**Client** not allowed to create a dog observation"
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "observations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "ObservationsController_find",
          "summary": "Find all dog observations",
          "parameters": [
            {
              "name": "dogId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of all dog observations",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Observation"
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "observations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/v0/observations/{observationId}": {
        "get": {
          "operationId": "ObservationsController_findOne",
          "summary": "Find a dog observation",
          "parameters": [
            {
              "name": "observationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found dog observation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Observation"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": ""
            },
            "404": {
              "description": "Observation not found"
            }
          },
          "tags": [
            "observations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "ObservationsController_updateOne",
          "summary": "Update a dog observation",
          "parameters": [
            {
              "name": "observationId",
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
                  "$ref": "#/components/schemas/UpdateObservationDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified dog observation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Observation"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "**Client** not allowed to modify a dog observation"
            },
            "404": {
              "description": "Observation to modified not found"
            }
          },
          "tags": [
            "observations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "ObservationsController_deleteOne",
          "summary": "Delete a dog observation",
          "parameters": [
            {
              "name": "observationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "The deleted dog observation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Observation"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete a dog observation"
            },
            "404": {
              "description": "Observation to delete not found"
            }
          },
          "tags": [
            "observations"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/v0/holidays": {
        "post": {
          "operationId": "HolidaysController_create",
          "summary": "Take a vacation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateHolidayDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Holiday successfully taked",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Holiday"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized because only **Administrators**, **Managers** and **Educators** can take vacations"
            },
            "422": {
              "description": "Unprocessable Entity"
            }
          },
          "tags": [
            "holidays"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "get": {
          "operationId": "HolidaysController_find",
          "summary": "Find employee holidays",
          "parameters": [
            {
              "name": "employeeId",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of employee holidays",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Holiday"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "**Clients** not allowed to find all employee holidays"
            }
          },
          "tags": [
            "holidays"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        }
      },
      "/v0/holidays/{holidayId}": {
        "get": {
          "operationId": "HolidaysController_findOne",
          "summary": "Find a holiday",
          "parameters": [
            {
              "name": "holidayId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "The found holiday",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Holiday"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "**Clients** not allowed to find an employee holiday"
            },
            "404": {
              "description": "Holiday not found"
            }
          },
          "tags": [
            "holidays"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "put": {
          "operationId": "HolidaysController_updateOne",
          "summary": "Update a holiday",
          "parameters": [
            {
              "name": "holidayId",
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
                  "$ref": "#/components/schemas/UpdateHolidayDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "The modified holiday",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Holiday"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "**Client** not allowed to modify a holiday"
            },
            "404": {
              "description": "Holiday to modify not found"
            }
          },
          "tags": [
            "holidays"
          ],
          "security": [
            {
              "BearerToken": []
            }
          ]
        },
        "delete": {
          "operationId": "HolidaysController_deleteOne",
          "summary": "Delete a holiday",
          "parameters": [
            {
              "name": "holidayId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "The deleted holiday",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Holiday"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can delete a holiday"
            },
            "404": {
              "description": "Holiday to delete not found"
            }
          },
          "tags": [
            "holidays"
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
      "title": "GestiDogs API Server",
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
            "establishment": {
              "type": "string"
            },
            "status": {
              "type": "string",
              "enum": [
                "Canceled",
                "Online",
                "Pending",
                "Postponed"
              ],
              "default": "Pending"
            },
            "maximumCapacity": {
              "type": "number",
              "default": 1
            },
            "beginDate": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "educator",
            "activity",
            "establishment",
            "status",
            "maximumCapacity",
            "beginDate"
          ]
        },
        "Establishment": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
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
            "_id",
            "owner",
            "name",
            "address",
            "schedules"
          ]
        },
        "Activity": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
            "establishment": {
              "$ref": "#/components/schemas/Establishment"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "imageUrl": {
              "type": "string"
            },
            "color": {
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
            "_id",
            "establishment",
            "title",
            "color",
            "duration",
            "price"
          ]
        },
        "User": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
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
              "examples": [
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
            "phoneNumber": {
              "type": "string"
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
            "stripeId": {
              "type": "string"
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
            "_id",
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
            "_id": {
              "type": "string"
            },
            "educator": {
              "$ref": "#/components/schemas/User"
            },
            "activity": {
              "$ref": "#/components/schemas/Activity"
            },
            "establishment": {
              "$ref": "#/components/schemas/Establishment"
            },
            "status": {
              "type": "string",
              "enum": [
                "Canceled",
                "Online",
                "Pending",
                "Postponed"
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
            "_id",
            "educator",
            "activity",
            "establishment",
            "status",
            "maximumCapacity",
            "beginDate",
            "endDate"
          ]
        },
        "WriteReportDto": {
          "type": "object",
          "properties": {
            "report": {
              "type": "string"
            }
          },
          "required": [
            "report"
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
                "Canceled",
                "Online",
                "Pending",
                "Postponed"
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
              "examples": [
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
            "phoneNumber": {
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
            "phoneNumber": {
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
        "NewEmployeeDto": {
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
                "Manager",
                "Educator"
              ],
              "default": "Educator"
            },
            "emailAddress": {
              "type": "string"
            },
            "phoneNumber": {
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
            "imageUrl": {
              "type": "string"
            },
            "gender": {
              "type": "string",
              "enum": [
                "Male",
                "Female"
              ],
              "examples": [
                "Male",
                "Female"
              ]
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
            "_id": {
              "type": "string"
            },
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
            "imageUrl": {
              "type": "string"
            },
            "gender": {
              "type": "string",
              "enum": [
                "Male",
                "Female"
              ],
              "examples": [
                "Male",
                "Female"
              ]
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
            "_id",
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
            "imageUrl": {
              "type": "string"
            },
            "gender": {
              "type": "string",
              "enum": [
                "Male",
                "Female"
              ],
              "examples": [
                "Male",
                "Female"
              ]
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
            "imageUrl": {
              "type": "string"
            },
            "color": {
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
            "color",
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
            "imageUrl": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "duration": {
              "type": "number"
            },
            "price": {
              "type": "number"
            }
          }
        },
        "CreateReservationDto": {
          "type": "object",
          "properties": {
            "session": {
              "type": "string"
            },
            "dog": {
              "type": "string"
            },
            "isApproved": {
              "type": "boolean",
              "default": false
            }
          },
          "required": [
            "session",
            "dog"
          ]
        },
        "Reservation": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
            "session": {
              "$ref": "#/components/schemas/Session"
            },
            "dog": {
              "$ref": "#/components/schemas/Dog"
            },
            "isApproved": {
              "type": "boolean",
              "default": false
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "_id",
            "session",
            "dog"
          ]
        },
        "UpdateReservationDto": {
          "type": "object",
          "properties": {
            "session": {
              "type": "string"
            },
            "dog": {
              "type": "string"
            },
            "isApproved": {
              "type": "boolean",
              "default": false
            }
          },
          "required": [
            "session",
            "dog"
          ]
        },
        "PaymentDto": {
          "type": "object",
          "properties": {
            "amount": {
              "type": "number"
            },
            "currency": {
              "type": "string"
            }
          },
          "required": [
            "amount",
            "currency"
          ]
        },
        "CardDto": {
          "type": "object",
          "properties": {
            "number": {
              "type": "string"
            },
            "expMonth": {
              "type": "number"
            },
            "expYear": {
              "type": "number"
            },
            "cvc": {
              "type": "string"
            }
          },
          "required": [
            "number",
            "expMonth",
            "expYear",
            "cvc"
          ]
        },
        "CreateObservationDto": {
          "type": "object",
          "properties": {
            "dog": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          },
          "required": [
            "dog"
          ]
        },
        "Observation": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
            "dog": {
              "$ref": "#/components/schemas/Dog"
            },
            "description": {
              "type": "string"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string",
              "default": "2023-06-29T16:37:56.465Z"
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "_id",
            "dog",
            "createdAt"
          ]
        },
        "UpdateObservationDto": {
          "type": "object",
          "properties": {
            "dog": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          }
        },
        "CreateHolidayDto": {
          "type": "object",
          "properties": {
            "employee": {
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
            "status": {
              "type": "string",
              "enum": [
                "Approved",
                "Pending",
                "Refused"
              ],
              "default": "Pending"
            }
          },
          "required": [
            "employee",
            "beginDate",
            "endDate",
            "status"
          ]
        },
        "Holiday": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
            "employee": {
              "$ref": "#/components/schemas/User"
            },
            "beginDate": {
              "format": "date-time",
              "type": "string"
            },
            "endDate": {
              "format": "date-time",
              "type": "string"
            },
            "status": {
              "type": "string",
              "enum": [
                "Approved",
                "Pending",
                "Refused"
              ],
              "default": "Pending"
            },
            "isApproved": {
              "type": "boolean",
              "default": false
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "_id",
            "employee",
            "beginDate",
            "endDate",
            "status"
          ]
        },
        "UpdateHolidayDto": {
          "type": "object",
          "properties": {
            "employee": {
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
            "status": {
              "type": "string",
              "enum": [
                "Approved",
                "Pending",
                "Refused"
              ],
              "default": "Pending"
            },
            "isApproved": {
              "type": "boolean",
              "default": false
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
