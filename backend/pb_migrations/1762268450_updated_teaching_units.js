/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4000001007")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = userid.id",
    "listRule": "@request.auth.id = userid.id",
    "updateRule": "@request.auth.id = userid.id",
    "viewRule": "@request.auth.id = userid.id"
  }, collection)

  // remove field
  collection.fields.removeById("relation_units_teacher")

  // add field
  collection.fields.addAt(15, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation4046612846",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "userid",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4000001007")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = teacherId",
    "listRule": "@request.auth.id = teacherId",
    "updateRule": "@request.auth.id = teacherId",
    "viewRule": "@request.auth.id = teacherId"
  }, collection)

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2907260911",
    "hidden": false,
    "id": "relation_units_teacher",
    "maxSelect": 1,
    "minSelect": 1,
    "name": "teacherId",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("relation4046612846")

  return app.save(collection)
})
