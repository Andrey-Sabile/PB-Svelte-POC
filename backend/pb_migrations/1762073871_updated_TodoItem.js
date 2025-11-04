/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2677325484")

  // update collection data
  unmarshal({
    "name": "todo_items"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2677325484")

  // update collection data
  unmarshal({
    "name": "TodoItem"
  }, collection)

  return app.save(collection)
})
