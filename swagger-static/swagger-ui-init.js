
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
        }
      },
      "/users/online": {
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
            "401": {
              "description": "Unauthorized because only **Administrators** and **Managers** can find a user"
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
            "304": {
              "description": "Not Modified"
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
                  "$ref": "#/components/schemas/EstablishmentDto"
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
              "description": "Unauthorized because only **Administrators** can create a new establishment"
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
              "description": "Unauthorized because only **Administrators** can find all establishments"
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
                  "$ref": "#/components/schemas/EstablishmentDto"
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
            "304": {
              "description": "Not Modified"
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
      "/establishments/owner/{ownerId}": {
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
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "lastname": {
              "type": "string"
            },
            "firstname": {
              "type": "string"
            },
            "role": {
              "type": "string",
              "enum": [
                "Admin",
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
            }
          },
          "required": [
            "lastname",
            "firstname",
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
            "role": {
              "type": "string",
              "enum": [
                "Admin",
                "Educator",
                "Client"
              ],
              "default": "Client"
            },
            "emailAddress": {
              "type": "string",
              "uniqueItems": true
            },
            "avatarUrl": {
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
            "lastname",
            "firstname",
            "emailAddress"
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
        "EstablishmentDto": {
          "type": "object",
          "properties": {
            "ownerId": {
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
            }
          },
          "required": [
            "ownerId",
            "name",
            "address"
          ]
        },
        "Establishment": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
            "ownerId": {
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
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "ownerId",
            "name",
            "address"
          ]
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
