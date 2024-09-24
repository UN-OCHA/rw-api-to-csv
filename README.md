# ReliefWeb API to CSV

## Install

```bash
npm i
npm start
```

You will now have a file `data.csv` containing the data.

## Customize

To change the fields to fetch from ReliefWeb API, have a look at `getData()`,
it support the fields defined in the [documentation](https://apidoc.reliefweb.int/fields-tables).

Make sure to also define the output of the field in `writeCsv()`, the code depends on the type of the field.

- Simple property (ex. Title): `fields.title`
- Nested property (ex. Primary country): `fields.primary_country.iso3`
- Array of objects (ex. Country): `(row) => row.fields.country.map((x) => x.iso3).join(',')`
