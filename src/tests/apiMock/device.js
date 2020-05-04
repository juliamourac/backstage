const device1 = {
  "id": "124e15",
  "label": "disp12",
  "attrs": [],
};

const deviceHello = {
  "attrs": {
    "1": [
      {
        "created": "2020-03-09T17:10:34.364406+00:00",
        "id": 1,
        "is_static_overridden": false,
        "label": "attr1",
        "metadata": [
          {
            "created": "2020-03-09T17:10:34.369905+00:00",
            "id": 2,
            "is_static´_overridden": false,
            "label": "protocol",
            "static_value": "mqtt",
            "type": "protocol",
            "updated": null,
            "value_type": "string"
          }
        ],
        "static_value": "",
        "template_id": "1",
        "type": "dynamic",
        "value_type": "integer"
      }
    ],
    "2": [
      {
        "created": "2020-03-17T14:33:22.912227+00:00",
        "id": 4,
        "is_static_overridden": false,
        "label": "atributo_b",
        "static_value": "",
        "template_id": "2",
        "type": "dynamic",
        "value_type": "string"
      },
      {
        "created": "2020-03-17T14:33:22.906988+00:00",
        "id": 3,
        "is_static_overridden": false,
        "label": "atributo_a",
        "static_value": "",
        "template_id": "2",
        "type": "dynamic",
        "value_type": "float"
      }
    ]
  },
  "created": "2020-03-17T14:33:43.176756+00:00",
  "id": "d1b582",
  "label": "Hello",
  "templates": [
    2,
    1
  ]
};

const deviceList = JSON.parse[
  {
    "devices": [
      {
        "id": "124e15",
        "label": "disp12",
        "attrs": [
          {
            "label": "attr1",
            "type": "dynamic",
            "value_type": "NUMBER",
            "value": null,
            "meta": null
          }
        ],
        "templates": [
          {
            "label": "Template",
            "id": 1
          }
        ]
      },
      {
        "id": "17e0d0",
        "label": "disp11",
        "attrs": [
          {
            "label": "attr1",
            "type": "dynamic",
            "value_type": "NUMBER",
            "value": null,
            "meta": null
          }
        ],
        "templates": [
          {
            "label": "Template",
            "id": 1
          }
        ]
      },
      {
        "id": "65f9d7",
        "label": "disp10",
        "attrs": [
          {
            "label": "attr1",
            "type": "dynamic",
            "value_type": "NUMBER",
            "value": null,
            "meta": null
          }
        ],
        "templates": [
          {
            "label": "Template",
            "id": 1
          }
        ]
      }
    ]
  }
];


module.exports = { device1, deviceList};