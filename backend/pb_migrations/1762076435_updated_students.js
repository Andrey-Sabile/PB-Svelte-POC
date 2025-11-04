/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3922585925")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2280898106",
    "maxSelect": 1,
    "name": "grade_level",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "pp"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3922585925")

  // remove field
  collection.fields.removeById("select2280898106")

  return app.save(collection)
})
