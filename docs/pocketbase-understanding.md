Tables are Collections
Collections have records which are the rows for a table
Collections have fields which are the columns for a table (except View types)
API Rules
- Collections filter and access. Could be the one that holds business logic

Collections have three types
Base, Auth and View
View - Use SQL Query

API ROUTES
BASE_URL/api/collections/{SPECIFIC_COLLECTION}/records

Example
TODOLIST Collection
TodoItem Collection
TodoLIST can have many TodoItems
TodoItem can only have one TodoList
What is the api call for 
Get all the TODOLISTS and all the TodoItems for that TODOLIST 