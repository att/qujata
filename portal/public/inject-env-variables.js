const fs = require('fs');

const WORK_DIR = process.argv[2];
const templateFileName = 'index.html.tpl';
const indexFileName = 'index.html';
const templateFilePath = `${WORK_DIR}/${templateFileName}`;
const indexFilePath = `${WORK_DIR}/${indexFileName}`;
const scriptContainerTag = 'head';
const placeholderTag = '</head>';
const envVariablesKeyInGlobalScope = 'PQC_PORTAL_ENV';
const envVariablesProcessPrefix = 'PQC_PORTAL__';
const envVariablesPortalPrefix = 'REACT_APP__';

fs.readFile(templateFilePath, 'utf8', function(error, indexHtmlTemplate){
    if (error) {
        console.log(error);
        killProcess(templateFilePath);
    } else {
        const updatedIndexHtml = indexHtmlTemplate.replace(placeholderTag, `${getEnvVariablesScript()}${placeholderTag}`)
        overrideIndexFile(indexFilePath, updatedIndexHtml);
    }
});

function killProcess(fileName) {
    console.log(`Could not find ${fileName} file`);
    process.exit(-1);
}

function getEnvVariablesScript() {
    return `<script>${getEnvVariablesScriptContent()}</script>`;
}

function getEnvVariablesScriptContent() {
    return `${setEnvVariablesInGlobal()}${removeEnvVariablesScriptFromHtml()}`;
}

function setEnvVariablesInGlobal() {
    const envVariables = filterPortalVariables();
    return `window.${envVariablesKeyInGlobalScope} = ${JSON.stringify(envVariables)};`;
}

function filterPortalVariables() {
    console.log(process.env);
    return Object.keys(process.env)
        .filter(key => key.startsWith(envVariablesProcessPrefix))
        .reduce((obj, key) => {
            console.log(key);
            const portalKey = key.replace(envVariablesProcessPrefix, envVariablesPortalPrefix)
            obj[portalKey] = process.env[key];
            return obj;
        }, {});
}

function removeEnvVariablesScriptFromHtml() {
    const currentScript = 'const currentScriptTag=document.currentScript;';
    const headerTag = `const headerTag = document.getElementsByTagName('${scriptContainerTag}')[0];`;
    const removeScriptFromHtml = 'headerTag.removeChild(currentScriptTag);';
    return `${currentScript}${headerTag}${removeScriptFromHtml}`;
}

function overrideIndexFile(path, htmlContent) {
    fs.writeFile(path, htmlContent, function (err) {
        if (err)  {
            console.log(err)
            killProcess(path);
        } else {
            console.log('Finish injecting environment variables');
        }
    });
}
