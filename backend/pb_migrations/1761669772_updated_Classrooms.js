/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_605318786")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_303932248",
    "hidden": false,
    "id": "relation4224597626",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "subject",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_605318786")

  // remove field
  collection.fields.removeById("relation4224597626")

  return app.save(collection)
})
