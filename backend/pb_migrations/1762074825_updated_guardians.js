/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1681966216")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3922585925",
    "hidden": false,
    "id": "relation2758380978",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "students",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1681966216")

  // remove field
  collection.fields.removeById("relation2758380978")

  return app.save(collection)
})
