# ReliefWeb API to CSV

## Install locally

```bash
npm i
npm start
```

You will now have a file `data.csv` containing the data.

## Edit on GitGub

- [Edit index.mjs](https://github.com/UN-OCHA/rw-api-to-csv/edit/main/index.mjs)
- Make changes
- Click on *Commit changes...*
- Specify a new branch

## Filters

You can change the used filters at the top of the file.

Check [API documentation](https://apidoc.reliefweb.int/fields-tables#reports) for an overview.

```js
let filters = [
    {
        field: 'date.created',
        value: {
            from: '2024-01-01T00:00:00+00:00',
            to: '2024-12-31T23:59:59+00:00'
        }
    }
];
```

## Customize

To change the fields to fetch from ReliefWeb API, have a look at `getData()`,
it support the fields defined in the [documentation](https://apidoc.reliefweb.int/fields-tables).

Make sure to also define the output of the field in `writeCsv()`, the code depends on the type of the field.

- Simple property (ex. Title): `fields.title`
- Nested property (ex. Primary country): `fields.primary_country.iso3`
- Array of objects (ex. Country): `(row) => row.fields.country.map((x) => x.iso3).join(',')`
