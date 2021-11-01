function log() {
    console.log(`${APP_NAME}: `, ...arguments)
}

function debug() {
    console.debug(`${APP_NAME}: `, ...arguments)
}

Object.prototype.isEmpty = function () {
    return Object.keys(this).length == 0
}

const openLink = url => chrome.tabs.update({'url': url, 'selected': true})

const getStorageData = async key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, result =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve(result)
    )
  )

const setStorageData = async data =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.set(data, () =>
      chrome.runtime.lastError
        ? reject(Error(chrome.runtime.lastError.message))
        : resolve()
    )
  )