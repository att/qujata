<img src="https://github.com/att/qujata/assets/7979328/199a9c84-840b-415e-a221-621c22184ad2" width="300">

## Description
This is a `Post Quantum Cryptography` tool,
<br/>
docker based with `Open Quantum Safe` images,
<br/>
using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Platform limitations
Pay attention that the Operating System of the machine running this project has an effect on the proper data returned in the results.
<br/>
Not all algorithms are equally well-supported on all platforms. In case of questions, it is first advised to review the [documentation files for each algorithm](https://github.com/open-quantum-safe/liboqs/tree/main/docs/algorithms).
<br/>
<ul>
  <li>On Mac, it is expected to work well and was tested with AllowedAlgorithms.</li>
  <li>On Windows, some Algorithms may not be supported by `Open Quantum Safe` docker images, but the code will work successfully.<br/>(Seeing `downloadSpeed=0` is suspected to be a sign of no-support for selected Algorithm).</li>
  <li>Other Platforms were not tested yet.</li>
</ul>

## Pre-requisite
[Node.js](#https://nodejs.org/en/download) (includes npm) and [Docker](https://docs.docker.com/engine/install) have to be installed on your system in order to run this project.

## Installation
1. To start, clone the qujata repository.
```bash
git clone https://github.com/att/qujata.git
cd qujata/api
```
2. Install dependencies:
```bash
npm install
```

3. Open a Terminal / Command-Line on this project's folder and run:<br/>
```bash
docker compose up
```
> You need to verify that 2 images went up and are running ("curl" & "nginx") using `docker ps`.

4. Run the application:

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

5. Test the application sending this request:
```bash
curl --location 'http://localhost:3010/analyze/' \
--header 'Content-Type: application/json' \
--data '{
    "algorithm": "kyber512",
    "iterationsCount": 5
}'
```

#### Run the FrontEnd Portal, from this Azure DevOps Repository: [here](#https://github.com/att/qujata/tree/main/portal/README.md)


