/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select2324791398",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "student",
      "teacher",
      "guardian",
      "admin"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select2324791398",
    "maxSelect": 1,
    "name": "userType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "student",
      "teacher",
      "guardian",
      "admin"
    ]
  }))

  return app.save(collection)
})
