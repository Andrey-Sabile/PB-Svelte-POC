/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3293012906")

  // update collection data
  unmarshal({
    "name": "todo_list"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3293012906")

  // update collection data
  unmarshal({
    "name": "TodoList"
  }, collection)

  return app.save(collection)
})
