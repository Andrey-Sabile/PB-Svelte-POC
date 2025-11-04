/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1489547457")

  // update collection data
  unmarshal({
    "name": "calendar_events"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1489547457")

  // update collection data
  unmarshal({
    "name": "CalendarEvents"
  }, collection)

  return app.save(collection)
})
