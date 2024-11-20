const prods = [{
    "sku": "KUCHENMANZANANUEZ",
    "name": "Kuchen de manzana nuez",
    "recipe": [],
    "production": {
        "batch": 2,
        "time": 10,
        "groups": [
            "1",
            "4",
            "5",
            "6",
            "9",
            "11",
            "12"
        ],
        "at": "distributor"
    },
    "sellable": true,
    "expiration": 6,
    "cost": 18990,
    "price": 22990,
    "storage": {
        "cold": true
    }
},
{
    "sku": "KUCHENMANZANANUEZTROZO",
    "name": "Porción de kuchen de manzana nuez",
    "recipe": [
        {
            "req": 1,
            "sku": "KUCHENMANZANANUEZ"
        }
    ],
    "production": {
        "batch": 5,
        "time": 5,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "kitchen"
    },
    "sellable": true,
    "expiration": 6,
    "cost": 10,
    "price": 4290,
    "storage": {
        "cold": true
    }
},
{
    "sku": "BROWNIE",
    "name": "Porción de brownie tradicional",
    "recipe": [],
    "production": {
        "batch": 4,
        "time": 10,
        "groups": [
            "1",
            "4",
            "5",
            "6",
            "9",
            "10"
        ],
        "at": "distributor"
    },
    "sellable": true,
    "expiration": 6,
    "cost": 1990,
    "price": 3490,
    "storage": {
        "cold": false
    }
},
{
    "sku": "CHEESECAKE",
    "name": "Cheesecake de frambuesa",
    "recipe": [],
    "production": {
        "batch": 1,
        "time": 10,
        "groups": [
            "2",
            "3",
            "7",
            "8",
            "10",
            "13"
        ],
        "at": "distributor"
    },
    "sellable": true,
    "expiration": 10,
    "cost": 19990,
    "price": 24990,
    "storage": {
        "cold": true
    }
},
{
    "sku": "CHEESECAKEPORCION",
    "name": "Porción de cheesecake de frambuesa",
    "recipe": [
        {
            "req": 1,
            "sku": "CHEESECAKE"
        }
    ],
    "production": {
        "batch": 5,
        "time": 5,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "kitchen"
    },
    "sellable": true,
    "expiration": 10,
    "cost": 10,
    "price": 4990,
    "storage": {
        "cold": true
    }
},
{
    "sku": "PALMERA",
    "name": "Palmera gigante",
    "recipe": [],
    "production": {
        "batch": 1,
        "time": 20,
        "groups": [
            "3",
            "6",
            "8",
            "11",
            "12"
        ],
        "at": "distributor"
    },
    "sellable": true,
    "expiration": 20,
    "cost": 990,
    "price": 1290,
    "storage": {
        "cold": false
    }
},
{
    "sku": "CROISSANT",
    "name": "Croissant",
    "recipe": [],
    "production": {
        "batch": 10,
        "time": 20,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "distributor"
    },
    "sellable": true,
    "expiration": 8,
    "cost": 590,
    "price": 990,
    "storage": {
        "cold": false
    }
},
{
    "sku": "QUESOENTERO",
    "name": "Trozo de queso entero",
    "recipe": [],
    "production": {
        "batch": 1,
        "time": 20,
        "groups": [
            "2",
            "7",
            "8",
            "11",
            "13"
        ],
        "at": "distributor"
    },
    "sellable": false,
    "expiration": 12,
    "cost": 5590,
    "price": 5990,
    "storage": {
        "cold": true
    }
},
{
    "sku": "QUESOLAMINADO",
    "name": "Queso laminado",
    "recipe": [
        {
            "req": 1,
            "sku": "QUESOENTERO"
        }
    ],
    "production": {
        "batch": 30,
        "time": 5,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "kitchen"
    },
    "sellable": false,
    "expiration": 4,
    "cost": 10,
    "price": 199,
    "storage": {
        "cold": true
    }
},
{
    "sku": "JAMONENTERO",
    "name": "Trozo de jamón entero",
    "recipe": [],
    "production": {
        "batch": 1,
        "time": 20,
        "groups": [
            "1",
            "3",
            "9",
            "10",
            "12"
        ],
        "at": "distributor"
    },
    "sellable": false,
    "expiration": 12,
    "cost": 3990,
    "price": 4290,
    "storage": {
        "cold": true
    }
},
{
    "sku": "JAMONLAMINADO",
    "name": "Jamón laminado",
    "recipe": [
        {
            "req": 1,
            "sku": "JAMONENTERO"
        }
    ],
    "production": {
        "batch": 40,
        "time": 5,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "kitchen"
    },
    "sellable": false,
    "expiration": 6,
    "cost": 10,
    "price": 159,
    "storage": {
        "cold": true
    }
},
{
    "sku": "JAMONLAMINADO",
    "name": "Croissant de jamón queso derretido",
    "recipe": [
        {
            "req": 2,
            "sku": "JAMONLAMINADO"
        },
        {
            "req": 2,
            "sku": "QUESOLAMINADO"
        },
        {
            "req": 1,
            "sku": "CROISSANT"
        }
    ],
    "production": {
        "batch": 1,
        "time": 5,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "kitchen"
    },
    "sellable": true,
    "expiration": 1,
    "cost": 150,
    "price": 3590,
    "storage": {
        "cold": false
    }
},
{
    "sku": "NUTELLA",
    "name": "Frasco de Nutella",
    "recipe": [],
    "production": {
        "batch": 1,
        "time": 20,
        "groups": [
            "2",
            "4",
            "5",
            "7",
            "13"
        ],
        "at": "distributor"
    },
    "sellable": false,
    "expiration": 100,
    "cost": 7990,
    "price": 9990,
    "storage": {
        "cold": false
    }
},
{
    "sku": "NUTELLAPORCION",
    "name": "Porción de Nutella",
    "recipe": [
        {
            "req": 1,
            "sku": "NUTELLA"
        }
    ],
    "production": {
        "batch": 80,
        "time": 5,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "kitchen"
    },
    "sellable": false,
    "expiration": 100,
    "cost": 10,
    "price": 129,
    "storage": {
        "cold": false
    }
},
{
    "sku": "CROISSANTNUTELLA",
    "name": "Croissant tibio de Nutella",
    "recipe": [
        {
            "req": 1,
            "sku": "NUTELLAPORCION"
        },
        {
            "req": 1,
            "sku": "CROISSANT"
        }
    ],
    "production": {
        "batch": 1,
        "time": 5,
        "groups": [
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
            "13",
            "14",
            "15"
        ],
        "at": "kitchen"
    },
    "sellable": true,
    "expiration": 1,
    "cost": 150,
    "price": 3990,
    "storage": {
        "cold": false
    }
}]