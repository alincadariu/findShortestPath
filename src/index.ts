import { Grid } from "./Grid";
const wrapper = document.getElementById('wrapper') as HTMLDivElement;

const rowsLength = 20;
const columnsLength = 50;

const startNode = [10, 10];
const destinationNode = [10, 40];

new Grid({
    startNode,
    destinationNode,
    rowsLength,
    columnsLength,
    parent: wrapper,
})

document.body.appendChild(wrapper);


