import { Parser } from '@json2csv/plainjs';
import * as qs from 'qs';

async function getData(offset = 0, limit = 10) {
    const url = new URL('https://api.reliefweb.int/v1/reports');
    const params = {
        appname: 'rwint-user-0',
        profile: 'list',
        preset: 'latest',
        offset: 0,
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

(async function(){
    let data = await getData(0, 1000);
    let results = data.data;
    //console.log(JSON.stringify(results));

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
      ]
    };

    const json2csvParser = new Parser(opts);
    const csv = json2csvParser.parse(results);

    console.log(csv);

})();

