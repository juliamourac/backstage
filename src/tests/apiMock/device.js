const device1 = {
  "id": "124e15",
  "label": "disp12",
  "attrs": [],
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
        "attrs": {"1":[
          {
            "label": "attr1",
            "type": "dynamic",
            "value_type": "NUMBER",
            "value": null,
            "meta": null
          }
        ]},
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
        "attrs": {"1": [
          {
            "label": "attr1",
            "type": "dynamic",
            "value_type": "NUMBER",
            "value": null,
            "meta": null
          }
        ]},
        "templates": [
          {
            "label": "Template",
            "id": 1
          }
        ]
      }
    ],
    "pagination": {
      "has_next": false,
      "next_page": null,
      "page": 1,
      "total": 1
    }
  }
];


module.exports = { device1 };