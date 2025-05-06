require('dotenv').config();
const pg = require('pg');

const config = {
    user: process.env.DB_USER || "avnadmin",
    password: process.env.DB_PASSWORD || "AVNS_JRit76bbI23XtcUg_0K",
    host: process.env.DB_HOST || "commerce-kushagra746-a828.j.aivencloud.com",
    port: process.env.DB_PORT || 12264,
    database: process.env.DB_NAME || "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA || `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIULQQ8Msr164XZjWWFus4MVFhh3NQwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvY2I3YjE3MmUtZDZhZC00MTM1LThkZDktZGFiZTFkYWE5
Y2EyIFByb2plY3QgQ0EwHhcNMjQwNTAzMDEzNzAxWhcNMzQwNTAxMDEzNzAxWjA6
MTgwNgYDVQQDDC9jYjdiMTcyZS1kNmFkLTQxMzUtOGRkOS1kYWJlMWRhYTljYTIg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANI77VVK
J0n4EQ+7d/uAgtv8LCnIxHUy7HCEDydTQzerQKV1HrNi2S+hEpBbFDMTGlH/PdlN
kR8lSREiYm0PtbbCSSwu9gW20UrRbSUTZIgzFkn5wiNgdv7qpO1PUxkXtNFRlX8i
070iKjHpPWFwU291GBxJg3M6+7GozNUL+TKxny0ZLoB/pzf0A3Wk56A5frrLnXxJ
IYTPyCqD9dy4tNKYkJENN1QseNUGfJHpJqGOd7vmbNQsKq+iFKz1jmEhmza9IbCI
WFREKH7c1NE3C8uwFSeLrnwsYZAnzLTEwJNzzEFLFw1lWuSwUgYaBAVJGpCWy121
5AR/p7sP75J3akYF86Xz5RChgb1v7vnZiQGzzldZMxktW2uSM57/FgFeH5TsZnYu
FVm12axE9mIdtrfVd8lnflHABImvNtllRbE9DcmRbJYE89PeLj98CJaX2wMjYee8
DzjdltAVs4VwDgAsy9gcUWXS4y1yTAD7ei0QDVt0eZ1/J9TJN6cZ3NbEVQIDAQAB
oz8wPTAdBgNVHQ4EFgQUwz84uRf92OT1qhP52d/n9WAwJJ8wDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAFIig9FbAe+vofni
b3a/QQx4rVI/esTXuJrjsnL1j3N7zM0w2ezNiGZzM+yJZzSV/rTnRkqTbKFKhaEG
/kFO7uc38gg1Qbn1MzE0jnCeQZ9EalbBmTAHmSn15ujWSYRN1R6h4h9vHVb8wQwh
mQIHj0m01JhOlo48cBNk5Ml0QQSw8LE/F/QA+KZLSOhvy+Q6DfNvh3rkLnjOCU9A
0icQUGbpFCrtynkCtarufjbKa1OK6rltg3lSzjRpvJs9ilYrlbiN2yHJ5tzaNwvN
3zP+FeU0IEesbj10RyoZLhrLqzitdaEwkneQUFoWg3OaykWhBwSvuIqkWJrKlZrG
Lb8fhsdHVQojTWw8UcjQsrpwwxMt3fsHoGCqfbTpCduzO8BWNHL2jVHvDWyk7hMe
pMGu/fJXN4VO5Jajg+C53qJIpN/MonunddNrrJ4kOm8VhkvaQx0rC9uKZL73zVAK
ol3CkJq1ZCfiBnM3K+6W85gcGR+v3JgOSPOB9fI6ohwU/zz1Qw==
-----END CERTIFICATE-----`,
    },
};

async function queryDatabase(sql) {
    const client = new pg.Client(config);
    try {
        await client.connect();
        console.log('Connected to database.');
        const result = await client.query(sql);
        await client.end();
        console.log('Disconnected from database.');
        return result.rows;

    } catch (err) {
        console.error("Error executing SQL query:", err);
        return []; // Or throw the error
    }
}

module.exports = { queryDatabase };