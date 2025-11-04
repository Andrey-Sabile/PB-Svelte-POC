/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2677325484")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3293012906",
    "hidden": false,
    "id": "relation2215197619",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "todo_list",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2677325484")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3293012906",
    "hidden": false,
    "id": "relation2215197619",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "TodoList",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
