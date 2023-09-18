<img src="https://github.com/att/qujata/assets/7979328/199a9c84-840b-415e-a221-621c22184ad2" width="300">

## Description
This is a `Post Quantum Cryptography` tool,
<br/>
using [React](https://github.com/facebook/create-react-app) framework.


## Pre-requisite
[Node.js](#https://nodejs.org/en/download) (includes npm) has to be installed on your system in order to run this project.

## Installation

1. To start, clone the qujata repository:
```bash
git clone https://github.com/att/qujata.git
cd qujata/portal
```
2. Install yarn:
```bash
npm install -g yarn
```
2. Install dependencies and compile the application:
```bash
yarn install
yarn run build
```
3. Start the application (using  [api server](#https://github.com/att/qujata/tree/main/api)):
```bash
yarn run start:quantum-api
```

4. Open your browser: `http://localhost:2001`


### Optional - working with mock server
under `qujata/portal` folder, run the following:

```bash
cd mock-server 
yarn install
yarn serve # if the command fails, run `yarn run-server` to start
```

## How to Use the Portal

### Page initial
![Algorithms](https://github.com/att/qujata/assets/52351606/bf87347e-966d-4aaf-9f52-626a99291d3f)

- <b>`Algorithm(s)` section</b> - features a comprehensive list of supported algorithms, sorted by their types (Classic, Hybrid, PQ).
- <b>`Number of iterations` section</b> - specifies the number of iterations for each algorithm. <br />Increasing the input value will result in longer processing times but improved outcomes.
- <b>`Run` button</b> - initiates the process upon clicking.

Upon completion of the process, the results will be generated.

### Post-Process Completion
![Post Process Results](https://github.com/att/qujata/assets/52351606/c3905d69-b148-424c-ab51-85102d923a11)

Upon completion, the page will present the results for the selected algorithms. For each executed algorithm, you'll encounter three segments:
- <b>Average `Session Time` (mSec)</b>
- <b>Average `Session Handshake Time` (mSec)</b>
- <b>Average `Download Speed` (kB/sec)</b>

In each segment, you'll receive the overall average, along with the minimum and maximum values observed during the process.

### Charts
![Charts](https://github.com/att/qujata/assets/52351606/95503151-1fa3-436d-9047-067ad8115bcb)

Following the completion of the process, four charts will be displayed, illustrating the performance of each algorithm:
- `Server Memory (%)`
- `Server CPU (%)`
- `Client Memory (%)`
- `Client CPU (%)`

These diagrams will present the values for each iteration throughout the process. Every chart includes all the algorithms involved in the process.

