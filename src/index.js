import { domReady, api, getCachedData, storeCache } from './utils'
import Component from "./components"

const EditmodeStandAlone = {
  projectId: null,

  // Initialize
  start: async function () {
    console.log('Discovering contents...')

    await domReady() 

    this.discoverContents()

    this.addMagicEditorPlugin()
    window.chunksProjectIdentifier = this.projectId
  },

  discoverContents: function() {
    this.discoverChunks(el => {
      this.getChunk(el)
    })

    this.discoverCollections(el => {
      this.getCollection(el)
    })
  },

  // Scan DOM Search for tags with chunk-id attr
  discoverChunks: function(callback) {
    const chunkElements = document.querySelectorAll('[chunk-id]');

    chunkElements.forEach(el => {
      callback(el)
    })
  },

  // Get chunk data from Editmode API
  getChunk: function(el) {
    const chunkId = el.getAttribute('chunk-id')
    const chunkProjectId = el.getAttribute('project-id')
    const cacheData = getCachedData(chunkId)
    
    if (cacheData) {
      console.log('%c Rendering from cache: ' + chunkId, 'color: #bada55');
      Component.renderChunk(el, cacheData)
    }

    api(`/chunks/${chunkId}?project_id=${chunkProjectId || this.projectId}`).then(chunk => {
      storeCache(chunkId, chunk)

      // If no cache data, render content from API
      if (!cacheData) {
        Component.renderChunk(el, chunk)
      }
    })
  },

  // Scan DOM Search for collection tags
  discoverCollections: function(callback) {
    const collectionElements = document.querySelectorAll('template[collection-id]')

    collectionElements.forEach(el => {
      callback(el)
    })
  },

   // Get collection data from Editmode API
  getCollection: function(el) {
    const collectionId = el.getAttribute('collection-id')
    const chunkProjectId = el.getAttribute('project-id')
    const urlParams = new URLSearchParams({
      collection_identifier: collectionId,
      projectId: chunkProjectId || this.projectId
    });

    const cacheData = getCachedData(collectionId)
    
    if (cacheData) {
      console.log('%c Rendering from cache: ' + collectionId, 'color: #bada55');
      Component.renderCollection(el, cacheData)
    }

    api(`/chunks/?${urlParams}`).then(res => {
      const chunks = res.chunks
      storeCache(collectionId, chunks)

      if (!cacheData) {
        Component.renderCollection(el, chunks)
      }
    })
  },

  // Add magic editor plugin script tag before closing body tag
  addMagicEditorPlugin: function() {
    var s = document.createElement('script')
    s.setAttribute('src', "https://static.editmode.com/editmode@^2.0.0/dist/editmode.js")
    s.async = true

    document.body.appendChild( s )
  }
}


window.EditmodeStandAlone = EditmodeStandAlone
window.EditmodeStandAlone.start()

export default EditmodeStandAlone
