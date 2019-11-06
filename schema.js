const schema = [
    {
        "_id": "_collection",
        "name": "event"
    },
    {
        "_id": "_collection",
        "name": "person"
    },
    {
        "_id": "_predicate",
        "name": "event/location",
        "type": "string"
    },
    {
        "_id": "_predicate",
        "name": "event/name",
        "type": "string",
        "unique": true
    },
    {
        "_id": "_predicate",
        "name": "event/attendees",
        "type": "ref",
        "multi": true,
        "restrictCollection": "person"
    },
    {
        "_id": "_predicate",
        "name": "person/email",
        "type": "string",
        "unique": true
    },
    {
        "_id": "_predicate",
        "name": "person/name",
        "type": "string"
    },
    {
        "_id": "_predicate",
        "name": "person/events",
        "type": "ref",
        "multi": true,
        "restrictCollection": "event"
    }
]