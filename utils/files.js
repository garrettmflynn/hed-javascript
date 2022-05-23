const browserError = 'Browser cannot read a local .xml file. Please pass a File object instead to use the readBrowserFile() method.'

/**
 * Read a local file (lazy loads fs).
 *
 * @param {string} fileName The file path.
 * @return {Promise<unknown>} A promise with the file contents.
 */
const readFile = async function (fileName) {
  if (globalThis.process && !globalThis.fs) globalThis.fs = await import('fs').then(({ default: fs }) => fs)
  if (globalThis.fs) return new Promise((resolve) => fs.readFile(fileName, 'utf8', (err, data) => process.nextTick(() => resolve(data)))) // node
  else throw new Error(browserError) // browser
}

/**
 * Read a remote file using HTTPS (lazy loads node-fetch).
 *
 * @param {string} url The remote URL.
 * @return {Promise<string>} A promise with the file contents.
 */
const readHTTPSFile = async function (url) {
  if (!globalThis.fetch) globalThis.fetch = await import('node-fetch').then(({ default: fetch }) => fetch)
  return fetch(url).then((res) => {
    return res.text()
  })
}

/**
 * Read a browser-specified File object.
 *
 * @param {string} file File object.
 * @return {Promise<string>} A promise with the file text contents.
 */
const readBrowserFile = function (file) {
  if (globalThis.FileReader){
    const reader = new FileReader();
    return new Promise(resolve => {
      reader.addEventListener('load', async (event) => resolve(event.target.result));
      reader.readAsText(file);
    })
  }
}

export {
  readFile,
  readHTTPSFile,
  readBrowserFile,
  browserError
}
