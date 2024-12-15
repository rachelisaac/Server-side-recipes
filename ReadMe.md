# Recipe Server 2024

> **NOTE:**  
> Change `http://localhost:5000/` to your `process.env.PORT` in production.

---

## Users Resource

| URL                                  | Method | Description                     | Permissions           | Parameters | Optional Parameters | Body                                                                 | Headers                              | Returns                                                                                  | Status Codes |
|--------------------------------------|--------|---------------------------------|---------------------|------------|--------------------|----------------------------------------------------------------------|--------------------------------------|------------------------------------------------------------------------------------------|--------------|
| [http://localhost:5000/users/login](http://localhost:5000/users/login) | POST   | Sign in user and return JWT token | -                   | -          | -                  | `{ "email": "user@example.com", "password": "yourpassword" }`        | -                                    | `{ "token": "JWT token", "name": "User Name" }`                                        | 200, 401     |
| [http://localhost:5000/users/register](http://localhost:5000/users/register) | POST   | Register user and return JWT token | -                   | -          | -                  | `{ "name": "John", "email": "john@example.com", "password": "yourpassword" }` | -                                    | `{ "message": "User registered successfully" }`                                      | 201, 400     |
| [http://localhost:5000/users](http://localhost:5000/users) | GET    | Get all users (admin only)      | admin               | -          | -                  | -                                                                    | `Authorization: Bearer <token>`      | `{ "users": [ { "name": "John Doe", "email": "john@example.com" } ] }`              | 200, 403     |


# Recipes API Endpoints

| URL                                                                                      | Method | Description                                         | Permissions           | Parameters        | Optional Parameters | Body                                                                                          | Headers                              | Returns                                                                                  | Status Codes |
|------------------------------------------------------------------------------------------|--------|-----------------------------------------------------|---------------------|------------------|--------------------|-----------------------------------------------------------------------------------------------|--------------------------------------|------------------------------------------------------------------------------------------|--------------|
| [http://localhost:5000/recipes](http://localhost:5000/recipes)                       | GET    | Fetch all recipes (public or by logged-in user)      | -                   | -                | ?query=<search_term> | -                                                                                         | -                                    | `{ "recipes": [ { "name": "Chocolate Cake" } ] }`                                      | 200          |
| [http://localhost:5000/recipes/with-minutes/:minutes](http://localhost:5000/recipes/with-minutes/:minutes) | GET    | Get recipes with a preparation time of up to X minutes | -                   | `:minutes`       | -                  | -                                                                                         | -                                    | `{ "recipes": [ { "name": "Chocolate Cake" } ] }`                                      | 200          |
| [http://localhost:5000/recipes/user/:id](http://localhost:5000/recipes/user/:id)      | GET    | Get recipes by a specific user ID                 | -                   | `:id`            | -                  | -                                                                                         | -                                    | `{ "recipes": [ { "name": "Recipe 1" } ] }`                                           | 200          |
| [http://localhost:5000/recipes](http://localhost:5000/recipes)                       | POST   | Add a new recipe                                   | user or admin only  | -                | -                  | `{ "name": "Recipe Name", "description": "Recipe instructions" }`                          | `Authorization: Bearer <token>`      | `{ "message": "Recipe added successfully" }`                                         | 201, 403     |
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id)                | PUT    | Update recipe details by recipe ID                | author or admin only | `:id`            | -                  | `{ "name": "Updated Recipe Name", "description": "Updated description" }`                 | `Authorization: Bearer <token>`      | `{ "message": "Recipe updated successfully" }`                                       | 200, 403     |
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id)                | DELETE | Delete a recipe by recipe ID                      | author or admin only | `:id`            | -                  | -                                                                                         | `Authorization: Bearer <token>`      | `{ "message": "Recipe deleted successfully" }`                                       | 204, 403     |
| [http://localhost:5000/recipes/:id](http://localhost:5000/recipes/:id)                | GET    | Get recipe details by ID with access control check | author or admin only | `:id`            | -                  | -                                                                                         | `Authorization: Bearer <token>`      | `{ "recipe": { "name": "Chocolate Cake" } }`                                        | 200          |


## Categories Resource

| URL                                      | Method | Description                                 | Permissions | Parameters   | Optional Parameters | Body | Headers | Returns                                                                                  | Status Codes |
|------------------------------------------|--------|---------------------------------------------|-------------|--------------|--------------------|-------|---------|------------------------------------------------------------------------------------------|--------------|
| `/categories`                             | GET    | Get all categories                         | -           | -            | -                  | -     | -       | `{ "categories": [ { "name": "Desserts" } ] }`                                        | 200          |
| `/categories/with-recipes`                | GET    | Get all categories with their associated recipes | -       | -            | -                  | -     | -       | `{ "categories": [ { "name": "Desserts", "recipes": [ { "name": "Chocolate Cake" } ] } ] }` | 200          |
| `/categories/:name/recipes`               | GET    | Get recipes for a specific category by name | -           | `:name`      | -                  | -     | -       | `{ "categories": [ { "name": "Desserts", "recipes": [ { "name": "Chocolate Cake" } ] } ] }` | 200          |

---

## Testing with Tools

1. **Postman/Thunder Client:** Use the provided endpoints to test authentication, authorization, and CRUD actions.
2. **Setup Authorization Headers:** Use Authorization: Bearer <token> after logging in via /users/signin.

---

## Notes

1. **Authentication:**  
   JWT tokens are required for authentication in all endpoints that involve user access or restricted permissions. Tokens must be sent in the `Authorization: Bearer <token>` header for endpoints that require authentication.

2. **Validation:**  
   Input validation is implemented using **Joi** to ensure that only valid and correctly formatted data is processed by the server and saved to MongoDB.

3. **Role Management:**  
   - Admins can access restricted routes, like `GET /users`.  
   - User roles are defined (`admin`, `user`) and are checked via middleware to allow or restrict access based on the user's role.

---