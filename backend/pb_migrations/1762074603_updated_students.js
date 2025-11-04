/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3922585925")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role =\"teacher\" || @request.auth.role =\"admin\"",
    "deleteRule": "@request.auth.role =\"teacher\" || @request.auth.role =\"admin\"",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.role =\"teacher\" || @request.auth.role =\"admin\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1640833450",
    "max": 0,
    "min": 0,
    "name": "preferred_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date1089581607",
    "max": "",
    "min": "",
    "name": "date_of_birth",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3922585925")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  // remove field
  collection.fields.removeById("text1640833450")

  // remove field
  collection.fields.removeById("date1089581607")

  return app.save(collection)
})
