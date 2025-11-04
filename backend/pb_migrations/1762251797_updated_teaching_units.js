/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4000001007")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != ''",
    "deleteRule": "@request.auth.id = teacherId",
    "listRule": "@request.auth.id = teacherId",
    "updateRule": "@request.auth.id = teacherId",
    "viewRule": "@request.auth.id = teacherId"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4000001007")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id !=\"\"",
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
