/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_303932248")

  // update collection data
  unmarshal({
    "name": "subjects"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_303932248")

  // update collection data
  unmarshal({
    "name": "Subjects"
  }, collection)

  return app.save(collection)
})
