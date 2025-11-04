/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3922585925")

  // update collection data
  unmarshal({
    "name": "students"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3922585925")

  // update collection data
  unmarshal({
    "name": "Students"
  }, collection)

  return app.save(collection)
})
