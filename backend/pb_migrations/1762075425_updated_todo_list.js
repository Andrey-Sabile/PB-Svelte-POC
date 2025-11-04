/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3293012906")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2677325484",
    "hidden": false,
    "id": "relation3755665077",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "todo_items",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3293012906")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2677325484",
    "hidden": false,
    "id": "relation3755665077",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "TodoItem",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
