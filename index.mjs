import { Parser } from '@json2csv/plainjs';
import * as qs from 'qs';
import * as fs from 'fs';

/**
 * Get data from RW API.
 * 
 * @param {int} offset 
 * @param {int} limit 
 */
async function getData(offset = 0, limit = 10) {
    // Base URL for the API.
    const url = new URL('https://api.reliefweb.int/v1/reports');

    // Filters for the API.
    const params = {
        appname: 'rw-api-csv-rw-1085',
        profile: 'list',
        preset: 'latest',
        offset: offset,
        limit: limit,
        fields: {
            include: [
                'id',
                'url',
                'url_alias',
                'title',
                'origin',
                'language.code',
                'source.name',
                'source.shortname',
                'source.type',
                'primary_country.iso3',
                'country.iso3',
                'disaster.type',
                'disaster.name',
                'disaster.type.name',
                'format.name',
                'ocha_product.name',
                'theme.name',
                'file.filename',
                'image.url-small',
                'headline.title',
                'date.created',
                'date.original',
            ]
        }
    };

    url.search = qs.stringify(params);
    const json = await fetch(url.toString())
        .then(res => res.json())

    return json;
}

/**
 * Extract and build csv data.
 * 
 * @param {int} offset 
 * @param {int} limit 
 */
async function writeCsv(offset = 0, limit = 10) {
    let data = await getData(offset, limit);
    let results = data.data;
    let needsHeader = offset == 0;

    // Define the output for each field.
    const opts = {
        fields: [
            {
                label: 'Id',
                value: 'id'
            },
            {
                label: 'Title',
                value: 'fields.title'
            },
            {
                label: 'Url',
                value: 'fields.url',
            },
            {
                label: 'Url alias',
                value: 'fields.url_alias',
            },
            {
                label: 'Origin',
                value: 'fields.origin',
            },
            {
                label: 'Language code',
                value: (row) => row.fields.language.map((x) => x.code).join(',')
            },
            {
                label: 'Source name',
                value: (row) => row.fields.source.map((x) => x.name).join(',')
            },
            {
                label: 'Source shortname',
                value: (row) => row.fields.source.map((x) => x.shortname).join(',')
            },
            {
                label: 'Source type',
                value: (row) => row.fields.source.map((x) => x.type.name).join(',')
            },
            {
                label: 'Primary country',
                value: 'fields.primary_country.iso3',
            },
            {
                label: 'Country',
                value: (row) => row.fields.country.map((x) => x.iso3).join(',')
            },
            {
                label: 'Disaster name',
                value: (row) => row.fields.disaster && row.fields.disaster.map((x) => x.name).join(',')
            },
            {
                label: 'Disaster code',
                value: (row) => row.fields.disaster && row.fields.disaster.map((x) => x.type.map((y) => y.code)).join(',')
            },
            {
                label: 'Disaster type',
                value: (row) => row.fields.disaster && row.fields.disaster.map((x) => x.type.map((y) => y.name)).join(',')
            },
            {
                label: 'Format name',
                value: (row) => row.fields.format && row.fields.format.map((x) => x.name).join(',')
            },
            {
                label: 'OCHA product',
                value: (row) => row.fields.ocha_product && row.fields.ocha_product.map((x) => x.name).join(',')
            },
            {
                label: 'Theme',
                value: (row) => row.fields.theme && row.fields.theme.map((x) => x.name).join(',')
            },
            {
                label: 'Filename',
                value: (row) => row.fields.file && row.fields.file.map((x) => x.filename).join(',')
            },
            {
                label: 'Image',
                value: (row) => row.fields.image && row.fields.image['url-small']
            },
            {
                label: 'Headline title',
                value: (row) => row.fields.headline && row.fields.headline.title
            },
            {
                label: 'Date created',
                value: 'fields.date.created',
            },
            {
                label: 'Date original',
                value: 'fields.date.original',
            },
        ],
        header: needsHeader,
    };

    const json2csvParser = new Parser(opts);
    const csv = json2csvParser.parse(results);

    return csv;
}

(async function () {
    // Max number of records to fetch.
    let limit = 1000;

    // Max number of runs.
    let maxRuns = 5;

    let currentRun = 1;

    let writeStream = fs.createWriteStream('./data.csv');

    while (currentRun <= maxRuns) {
        console.info('Run ' + currentRun + ' of ' + maxRuns);

        let offset = (currentRun - 1) * limit;
        let csv = await writeCsv(offset, limit);
        if (!csv) {
            console.error('No data received.');
            break;
        }

        writeStream.write(csv);
        currentRun++
    }

    writeStream.close();
})();
