const departureHeaders = [
    {
        important : true,
        title : "STCW National"
    },
    {
        important : true,
        title : "Flag State"
    },
    {
        important : false,
        title : "GDPR Documents"
    },
    {
        important : false,
        title : "Training"
    },
    {
        important : false,
        title : "Technical"
    },
];

const preDepartureDoc = [
    {
        id : 1,
        title : "Autom. Radar Plotting Aids (ARPA) CERT",
        docNumber : "",
        issueDate : "N/A",
        expDate : "22.04.22",
        type : "attention",
        completed : "no",
        submitted : false
    },
    {
        id : 2,
        title : "GMDSS GOC",
        docNumber : "RUS, 6533/5563",
        issueDate : "N/A",
        expDate : "22.04.22",
        type : "mandatory",
        completed : "no",
        submitted : false
    },
    {
        id : 3,
        title : "GMDSS GOC",
        docNumber : "RUS, 6533/5563",
        issueDate : "N/A",
        expDate : "24.04.22",
        type : "skip",
        completed : "yes",
        submitted : false
    },
    {
        id : 4,
        title : "Vaccination Certificate",
        docNumber : "RUS, 697-076/22-01C",
        issueDate : "22.04.2022",
        expDate : "22.04.22",
        type : "mandatory",
        completed : "no",
        submitted : false
    },
    {
        id : 5,
        title : "Vaccination Certificate",
        docNumber : "RUS, 697-076/22-01C",
        issueDate : "24.04.2022",
        expDate : "24.04.22",
        type : "skip",
        completed : "yes",
        submitted : false
    },
    {
        id : 6,
        title : "GMDSS GOC",
        docNumber : "RUS, 6533/5563",
        issueDate : "N/A",
        expDate : "22.04.22",
        type : "mandatory",
        completed : "no",
        submitted : false
    },
];


export {
    departureHeaders,
    preDepartureDoc
}