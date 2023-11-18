<img src="https://github.com/att/qujata/assets/7979328/199a9c84-840b-415e-a221-621c22184ad2" width="300">

## Description
This is a `Post Quantum Cryptography` tool,
using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Pre-requisite
[Node.js](#https://nodejs.org/en/download) (includes npm) have to be installed on your system in order to run this project.

## Installation
1. To start, clone the qujata repository:
```bash
git clone https://github.com/att/qujata.git
cd qujata/curl
```
2. Install dependencies:
```bash
npm install
```
3. Run the application:
```bash
npm run start
```

4. Application is available now in: `http://localhost:3010`, curl example:
```bash
curl --location 'http://localhost:3010/curl' \
--header 'Content-Type: application/json' \
--data '{
    "algorithm": "kyber512",
    "iterationsCount": 5
}'
```

