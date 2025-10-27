/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3293012906")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3293012906")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.id ?= user.id  "
  }, collection)

  return app.save(collection)
})
