/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_605318786")

  // update collection data
  unmarshal({
    "name": "classrooms"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_605318786")

  // update collection data
  unmarshal({
    "name": "Classrooms"
  }, collection)

  return app.save(collection)
})
